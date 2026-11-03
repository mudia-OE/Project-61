const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function reply(){
 return {statusCode:200,headers:{},body:null,setHeader(k,v){this.headers[k]=v;return this},status(n){this.statusCode=n;return this},json(x){this.body=x;return this}};
}
const config=require('../api/config.js');
const inquiry=require('../api/inquiries.js');
const keys=['RESEND_API_KEY','INQUIRY_TO_EMAIL','INQUIRY_FROM_EMAIL','TURNSTILE_SECRET_KEY','TURNSTILE_SITE_KEY','TURNSTILE_HOSTNAMES'];
async function withEnvironment(settings,fn){
 const old={};for(const k of keys){old[k]=process.env[k];if(k in settings)process.env[k]=settings[k];else delete process.env[k]}
 const priorFetch=global.fetch;
 try{return await fn()}finally{global.fetch=priorFetch;for(const k of keys){if(old[k]===undefined)delete process.env[k];else process.env[k]=old[k]}}
}
const configured={RESEND_API_KEY:'re_test',INQUIRY_TO_EMAIL:'studio@example.com',INQUIRY_FROM_EMAIL:'studio@verified.example',TURNSTILE_SECRET_KEY:'secret-test',TURNSTILE_SITE_KEY:'site-test'};
function good(){return {service:'video',deliverables:['Short-form videos'],other:'',description:'I need a story-led vertical video for our organization.',budget:'$150–$500',timeline:'Within 2–4 weeks',references:'',name:'Example Buyer',email:'buyer@example.com',company:'Sample',consent:true,website:'',turnstileToken:'valid-challenge-token'}}
test('all public assets exist and client scripts parse',()=>{
 const html=read('index.html');
 for(const item of ['styles.css','app.js','demos.js','inquiry.js','favicon.svg','og.svg','privacy.html'])assert.ok(fs.existsSync(path.join(root,item)),item+' missing');
 for(const script of ['app.js','demos.js','inquiry.js'])assert.doesNotThrow(()=>new vm.Script(read(script),{filename:script}));
 for(const id of ['mosaic','world-detail','project-grid','project-dialog','project-form','turnstile-mount'])assert.ok(html.includes('id="'+id+'"'),'Missing #'+id);
 const cards=[...html.matchAll(/data-project="([^"]+)"/g)];
 assert.equal(cards.length,8,'Expected eight case studies/demos');
 assert.ok(!html.includes('61st idea'),'Private origin story leaked into homepage');
});
test('missing server configuration reports offline delivery',async()=>{
 await withEnvironment({},async()=>{
  const res=reply();await config({method:'GET'},res);
  assert.equal(res.statusCode,200);assert.deepEqual(res.body,{enabled:false,siteKey:null});
  const failed=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body:good()},failed);
  assert.equal(failed.statusCode,503);assert.match(failed.body.message,/not yet configured/);
 });
});
test('configured public settings expose only a site key',async()=>{
 await withEnvironment(configured,async()=>{
  const res=reply();await config({method:'GET'},res);
  assert.equal(res.statusCode,200);assert.deepEqual(res.body,{enabled:true,siteKey:'site-test'});
  assert.ok(!JSON.stringify(res.body).includes('re_test'));
 });
});
test('valid, verified inquiry sends through Resend',async()=>{
 await withEnvironment(configured,async()=>{
  const calls=[];
  global.fetch=async(url,options)=>{
   calls.push({url:String(url),options});
   if(String(url).includes('/siteverify'))return {ok:true,json:async()=>({success:true,hostname:'preview.example'})};
   return {ok:true,json:async()=>({id:'sent_123'})};
  };
  const res=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body:good()},res);
  assert.equal(res.statusCode,200);assert.equal(res.body.ok,true);
  assert.equal(calls.length,2);
  const mail=JSON.parse(calls[1].options.body);
  assert.equal(mail.reply_to,'buyer@example.com');
  assert.equal(mail.to[0],'studio@example.com');
  assert.match(mail.text,/story-led vertical video/);
 });
});
test('invalid security challenge is rejected and email is not sent',async()=>{
 await withEnvironment(configured,async()=>{
  let calls=0;
  global.fetch=async()=>{calls++;return {ok:true,json:async()=>({success:false})}};
  const res=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body:good()},res);
  assert.equal(res.statusCode,403);assert.equal(calls,1);
 });
});
test('email provider rejection does not report success',async()=>{
 await withEnvironment(configured,async()=>{
  global.fetch=async(url)=>String(url).includes('/siteverify')?{ok:true,json:async()=>({success:true})}:{ok:false,status:422,json:async()=>({message:'provider error'})};
  const res=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body:good()},res);
  assert.equal(res.statusCode,502);assert.ok(!res.body.ok);
 });
});
test('invalid user fields are rejected before external requests',async()=>{
 await withEnvironment(configured,async()=>{
  let called=false;global.fetch=async()=>{called=true;return {}};
  const body=good();body.description='tiny';
  const res=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body},res);
  assert.equal(res.statusCode,400);assert.equal(called,false);
 });
});
test('honeypot field blocks submissions',async()=>{
 await withEnvironment(configured,async()=>{
  const body=good();body.website='spam.example';
  const res=reply();await inquiry({method:'POST',headers:{'content-type':'application/json'},body},res);
  assert.equal(res.statusCode,400);
 });
});
test('HTTP method restrictions are enforced',async()=>{
 await withEnvironment(configured,async()=>{
  const res=reply();await inquiry({method:'GET',headers:{}},res);
  assert.equal(res.statusCode,405);
 });
});

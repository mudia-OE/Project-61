// Project 61 inquiry endpoint for Vercel's Node.js Functions.
// No database. Successful inquiries are sent as plain-text emails through Resend.
const allowedServices=new Set(['video','data','web','software','unsure']);
const text=(value,max=200)=>typeof value==='string'?value.trim().slice(0,max):'';
const safeLine=(value,max=200)=>text(value,max).replace(/[\r\n]+/g,' ');
function validEmail(address){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)&&address.length<=254}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({message:'Method not allowed'})}
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({message:'Expected JSON'});
  const env=process.env;
  const config=['RESEND_API_KEY','INQUIRY_TO_EMAIL','INQUIRY_FROM_EMAIL','TURNSTILE_SECRET_KEY','TURNSTILE_SITE_KEY'];
  if(!config.every(k=>env[k]))return res.status(503).json({message:'Online submissions are not yet configured. Please email us directly.'});
  let data=req.body;
  if(typeof data==='string'){try{data=JSON.parse(data)}catch{return res.status(400).json({message:'Invalid request body'})}}
  if(!data||typeof data!=='object'||Array.isArray(data))return res.status(400).json({message:'Invalid request body'});
  if(JSON.stringify(data).length>13000)return res.status(413).json({message:'Brief is too large'});
  const service=text(data.service,20),name=safeLine(data.name,100),email=safeLine(data.email,254),
    description=text(data.description,2500),company=safeLine(data.company,120),
    other=safeLine(data.other,180),budget=safeLine(data.budget,60),timeline=safeLine(data.timeline,60),
    references=text(data.references,400),token=text(data.turnstileToken,2049);
  const deliverables=Array.isArray(data.deliverables)?data.deliverables.slice(0,16).filter(s=>typeof s==='string').map(s=>safeLine(s,90)):[];
  if(text(data.website,100))return res.status(400).json({message:'Unable to accept this request.'});
  if(!allowedServices.has(service)||name.length<2||!validEmail(email)||description.length<25||description.length>2500||data.consent!==true)
    return res.status(400).json({message:'Please review your name, email, service, project details and consent.'});
  if(token.length<10||token.length>2048)return res.status(403).json({message:'Security check missing or expired.'});
  try{
    const validationResponse=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
      method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token}),
      signal:AbortSignal.timeout(8000)
    });
    if(!validationResponse.ok)throw Error('Challenge validation service unavailable');
    const challenge=await validationResponse.json();
    const allowedHosts=(env.TURNSTILE_HOSTNAMES||'').split(',').map(h=>h.trim()).filter(Boolean);
    if(!challenge.success||(allowedHosts.length>0&&!allowedHosts.includes(challenge.hostname)))
      return res.status(403).json({message:'Security verification failed. Please retry the challenge.'});
    const subject='Project 61 inquiry / '+service.toUpperCase();
    const brief=[
      'NEW PROJECT 61 INQUIRY',
      '----------------------',
      'Service: '+service,
      'Deliverables: '+(deliverables.join(', ')||'Not selected'),
      'Other needs: '+(other||'—'),
      'Budget (CAD): '+(budget||'Not sure'),
      'Timeline: '+(timeline||'Flexible'),
      'References: '+(references||'—'),
      '',
      'PROJECT BRIEF',description,'',
      'CONTACT','Name: '+name,'Email: '+email,'Organization: '+(company||'—'),
      '',
      'Consent to contact: yes'
    ].join('\n');
    const sent=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:env.INQUIRY_FROM_EMAIL,to:[env.INQUIRY_TO_EMAIL],reply_to:email,subject,text:brief}),
      signal:AbortSignal.timeout(9000)
    });
    const response=await sent.json().catch(()=>({}));
    if(!sent.ok||!response.id){console.error('Email provider rejected inquiry',{status:sent.status});return res.status(502).json({message:'Email delivery did not complete. Please try again or contact us directly.'})}
    return res.status(200).json({ok:true,message:'Inquiry accepted for delivery'});
  }catch(err){console.error('Inquiry service error',String(err?.message||err));return res.status(503).json({message:'The inquiry service is temporarily unavailable. Please email us directly.'})}
};
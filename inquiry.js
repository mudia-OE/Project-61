(()=>{
'use strict';
const form=document.querySelector('#project-form');
if(!form)return;
const steps=Array.from(form.querySelectorAll('.form-step')),back=document.querySelector('#step-back'),next=document.querySelector('#step-next'),send=document.querySelector('#step-submit'),error=document.querySelector('#form-error'),status=document.querySelector('#form-status'),copy=document.querySelector('#copy-brief');
const serviceMap={video:['Short-form videos','Cinematic edit','Motion graphics','Captions and subtitles','Sound and colour','Explainer or promotional video'],data:['Data cleaning','Exploratory analysis','Interactive dashboard','Charts and reports','Statistical modelling','Python or R scripts'],web:['Website or landing page','Personal or business portfolio','Interactive experience','Website redesign','Responsive implementation','Publishing and deployment'],software:['Small web application','Workflow automation','Custom scripts','Data processing tool','API integration','Prototype and testing'],unsure:['Creative guidance','Technical guidance','Help with project scope','Cross-disciplinary project']};
const serviceLabels={video:'Video',data:'Data',web:'Web',software:'Software',unsure:'Not sure yet'};
let step=0,secured=false,widgetId=null,pending=false,submissionStarted=Date.now();
const field=id=>document.querySelector('#'+id);
const checkedService=()=>form.querySelector('input[name="service"]:checked')?.value||'';
function showError(msg){error.textContent=msg;error.hidden=false;error.focus?.({preventScroll:true})}
function clearError(){error.hidden=true;error.textContent=''}
function selectService(service){
 if(!serviceMap[service])return;
 const choice=form.querySelector('input[name="service"][value="'+service+'"]');
 if(choice)choice.checked=true;
 renderDeliverables();
}
window.Project61Inquiry={selectService};
function renderDeliverables(){
 const selected=checkedService()||'unsure',list=serviceMap[selected],mount=field('deliverables');
 const previous=new Set(Array.from(mount.querySelectorAll('input:checked')).map(x=>x.value));
 mount.replaceChildren();
 list.forEach(label=>{
 const element=document.createElement('label');element.className='deliverable';
 const box=document.createElement('input');box.type='checkbox';box.name='deliverable';box.value=label;box.checked=previous.has(label);
 const text=document.createElement('span');text.textContent=label;element.append(box,text);mount.append(element);
 });
}
function chosenDeliverables(){return Array.from(form.querySelectorAll('input[name="deliverable"]:checked')).map(x=>x.value)}
function brief(){
 return {
 service:checkedService(),
 deliverables:chosenDeliverables(),
 other:field('other-deliverables').value.trim(),
 description:field('project-description').value.trim(),
 budget:field('project-budget').value,
 timeline:field('project-timeline').value,
 references:field('project-links').value.trim(),
 name:field('client-name').value.trim(),
 email:field('client-email').value.trim(),
 company:field('client-company').value.trim(),
 consent:field('client-consent').checked,
 website:field('website-trap').value.trim(),
 startedAt:submissionStarted
 };
}
function formatBrief(data){
 return ['PROJECT 61 / CLIENT INQUIRY','', 'Service: '+(serviceLabels[data.service]||'Not selected'),
 'Deliverables: '+(data.deliverables.length?data.deliverables.join(', '):'Not selected'),
 'Other needs: '+(data.other||'—'),'',
 'Description:',''+(data.description||'Not provided'),'', 'Budget (CAD): '+data.budget,
 'Timeline: '+data.timeline,'References: '+(data.references||'—'), '',
 'Name: '+(data.name||'—'),'Email: '+(data.email||'—'),'Organization: '+(data.company||'—')].join('\n');
}
function updateReview(){field('review-box').textContent=formatBrief(brief())}
function validate(index){
 const data=brief();
 if(index===0&&!data.service)return 'Choose a world to continue.';
 if(index===2&&data.description.length<25)return 'Tell us a little more about your project (at least 25 characters).';
 if(index===4){
 if(data.name.length<2)return 'Enter your name.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))return 'Enter a valid email address.';
 if(!data.consent)return 'Please agree to the inquiry privacy notice.';
 }
 return '';
}
function showStep(i){
 if(i<0||i>=steps.length)return;
 clearError();step=i;
 steps.forEach((el,j)=>{el.hidden=j!==i});
 back.hidden=i===0;next.hidden=i===4;send.hidden=i!==4;
 field('builder-current').textContent=String(i+1).padStart(2,'0');
 field('rail-progress-fill').style.width=((i+1)/5*100)+'%';
 field('builder-step-title').textContent=['CHOOSE YOUR WORLD','DEFINE THE NEED','DESCRIBE THE IDEA','TIME + BUDGET','SAY HELLO'][i];
 if(i===4)updateReview();
 steps[i].querySelector('legend')?.setAttribute('tabindex','-1');
 if(i>0)steps[i].querySelector('legend')?.focus({preventScroll:true});
}
next.addEventListener('click',()=>{
 const msg=validate(step);
 if(msg){showError(msg);return}
 if(step===0)renderDeliverables();
 showStep(Math.min(4,step+1));
});
back.addEventListener('click',()=>showStep(Math.max(0,step-1)));
form.querySelectorAll('input[name="service"]').forEach(el=>el.addEventListener('change',()=>renderDeliverables()));
field('project-description').addEventListener('input',()=>{field('description-count').textContent=field('project-description').value.length+' / 2500'});
copy.addEventListener('click',async()=>{
 const value=formatBrief(brief());
 try{await navigator.clipboard.writeText(value);const prev=copy.textContent;copy.textContent='✓ COPIED TO CLIPBOARD';setTimeout(()=>copy.textContent=prev,2400)}
 catch{const a=document.createElement('textarea');a.value=value;document.body.append(a);a.select();document.execCommand('copy');a.remove();copy.textContent='✓ BRIEF COPIED'}
});
async function setupBot(){
 const mount=field('turnstile-mount'),message=field('bot-status');
 try{
 const response=await fetch('/api/config',{headers:{Accept:'application/json'}});
 if(!response.ok)throw new Error('Missing configuration');
 const data=await response.json();
 if(!data.enabled||!data.siteKey){message.textContent='Online submission is not yet configured. Use Copy My Brief or email us directly.';return}
 const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
 script.onload=()=>{
 if(!window.turnstile){message.textContent='Security check unavailable. Try again or email us.';return}
 try{widgetId=window.turnstile.render(mount,{sitekey:data.siteKey,theme:'dark',callback:()=>{secured=true;message.textContent='Security check complete.'},'expired-callback':()=>{secured=false;message.textContent='Security check expired. Please retry.'},'error-callback':()=>{secured=false;message.textContent='Could not complete security check.'}});message.textContent='Complete the security check before submitting.'}
 catch{message.textContent='Security check unavailable. Try again or email us.'}
 };
 script.onerror=()=>{message.textContent='Security check could not load. Check your connection or email us.'};
 document.head.append(script);
 }catch{message.textContent='Online submission is not yet configured. Use Copy My Brief or email us directly.'}
}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(pending)return;
 let msg=validate(4);if(msg){showError(msg);return}
 const data=brief();
 if(!secured||!window.turnstile||widgetId===null){showError('Secure online submission is not available yet. Copy your brief or email us directly.');return}
 const token=window.turnstile.getResponse(widgetId);
 if(!token){showError('Please complete the security check.');return}
 data.turnstileToken=token;
 pending=true;send.disabled=true;send.innerHTML='SENDING…';clearError();
 status.className='';status.textContent='';
 try{
 const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 const responseData=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(responseData.message||'Unable to send your inquiry right now.');
 status.className='form-status-success';
 status.textContent='✓ Your project brief was accepted for delivery. We will review it and respond by email.';
 form.querySelectorAll('input,textarea,select,button').forEach(el=>el.disabled=true);
 }catch(err){
 status.className='form-status-error';status.textContent='Message not sent. '+err.message+' Your brief is still here. You can copy it or email us.';
 secured=false;
 try{window.turnstile?.reset(widgetId)}catch{}
 }finally{pending=false;if(!form.querySelector('input:disabled')){send.disabled=false;send.innerHTML='SUBMIT PROJECT <span>↗</span>'}}
});
const params=new URLSearchParams(location.search);
if(serviceMap[params.get('service')])selectService(params.get('service'));else renderDeliverables();
showStep(0);
setupBot();
})();
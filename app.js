(()=>{
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const worldData={
video:{number:'01',title:'STORIES<br>THAT MOVE.',description:'Short-form videos, cinematic edits and explainers built around pacing, personality and the point you want to make. The attention to detail should be obvious. The process should be straightforward.',services:['Reels, Shorts & social video','Story-first editing','Kinetic typography & motion graphics','Sound design & colour treatment','Platform-specific formatting','Explainers & promotional content'],projects:[['barkley','Anticipate Reel'],['cut','61 / CUT']]},
data:{number:'02',title:'FIND<br>THE SIGNAL.',description:'From messy spreadsheets to interpretable models, we connect the numbers to the question that matters. Careful methods, clear communication, and no invented certainty.',services:['Data cleaning & preparation','Python / R analysis','Interactive dashboards','Charts & data storytelling','Exploratory & statistical analysis','Practical predictive modelling'],projects:[['haliburton','Comeback Model'],['timemachine','NBA Time Machine'],['signal','61 / SIGNAL']]},
web:{number:'03',title:'DIGITAL<br>WITH A POINT.',description:'Distinctive websites should also be useful. We design and build responsive digital experiences that are clear, accessible and grounded in what the audience actually needs.',services:['Landing pages & portfolios','Editorial and content-driven sites','Responsive UI engineering','Interactive experiences','Performance & accessibility basics','Launch and hosting support'],projects:[['anticipate','Anticipate Website'],['frame','61 / FRAME']]},
software:{number:'04',title:'MAKE IT<br>FUNCTION.',description:'Small, thoughtfully scoped tools can solve large everyday frustrations. We translate workflows into practical applications, automations and custom scripts.',services:['Lightweight custom applications','Data workflow tooling','Browser-based utilities','Automation scripts','API connections where appropriate','Prototype-to-release support'],projects:[['flow','61 / FLOW']]}
};
const projectData={
barkley:{tag:'PUBLISHED EDITORIAL / VIDEO',title:'One story. A different level of attention.',lead:'The Anticipate Charles Barkley Reel combines short-form editing, motion graphics and research-led storytelling. A comparison with another Anticipate Reel offers a useful snapshot of audience response.',stats:[['3,175','VIEWS ON FEATURED REEL'],['326','VIEWS ON EARLIER REEL'],['18s','AVERAGE WATCH TIME'],['40','SHARES ON FEATURED REEL']],sections:[['The work','A self-initiated NBA storytelling production. The project involved a narrative arc, visual pacing, animated information and platform-oriented editing.'],['What the numbers show','The featured Reel reached 3,175 views versus 326 for the comparison post, and averaged 18 seconds watch time versus 7. Those are approximately 9.7× and 2.6× respectively.'],['Important context','These were two different posts. Publication timing, audience, content and platform distribution were not controlled. The observed difference does not establish that editing alone caused the increase. The published Reel is an independent project, not a paid client commission.']],links:[['Read the research','https://anticipate-peak.vercel.app/research/charles-barkley-time-machine/']]},
haliburton:{tag:'INDEPENDENT ANALYTICS / DATA',title:'What does recovery look like in the numbers?',lead:'An interpretable model estimating Tyrese Haliburton’s potential per-36 production after an Achilles injury, built from a small set of historical NBA cases.',stats:[['23','HISTORICAL CASES'],['1.67','CROSS-VALIDATED MAE (COMBINED)'],['23.4','PROJECTED PTS PER 36'],['10.1','PROJECTED AST PER 36']],sections:[['Method','A ridge regression model estimates changes in points, assists and rebounds per 36 minutes. Leave-one-out cross-validation evaluates prediction error given the small historical sample.'],['Why this matters','The goal is not to pretend a projection is certainty. It is to show the inputs, method, uncertainty and practical limitations transparently.'],['Limitations','Historic cases are few and may not represent every recovery. Projections are model estimates, not observed post-injury outcomes.']],links:[['Explore source code','https://github.com/mudia-OE/Hali-Predict'],['View Anticipate','https://anticipate-peak.vercel.app/']]},
anticipate:{tag:'PUBLISHED WEBSITE / WEB',title:'An editorial home for evidence-led basketball stories.',lead:'Anticipate is a live, independent research publication built to make statistical basketball stories accessible, memorable and visually engaging.',sections:[['The challenge','Combine long-form research, clear visual structure and recurring editorial releases into a website readers actually want to explore.'],['What was built','A responsive research-oriented website with a featured investigation, article pages, supporting visualizations and an organized archive.'],['Scope','This is an independent publication project, not evidence of a contracted client website.']],links:[['Visit live publication','https://anticipate-peak.vercel.app/']]},
timemachine:{tag:'INDEPENDENT RESEARCH / DATA',title:'A statistical bridge between eras.',lead:'The NBA Time Machine compares historical basketball player profiles with a modern group using standardized statistical and physical distances.',sections:[['The approach','Variables are standardized against a reference population and combined into distance measures. A smaller distance indicates greater similarity under the chosen variables and weights.'],['Interpretation','Similarity is a modelling choice, not an objective identity. Results depend on metrics, sample inclusion, era differences and feature weighting.'],['Implementation','An R-based analysis with reproducible calculations and a reader-friendly research presentation.']],links:[['Explore the publication','https://anticipate-peak.vercel.app/']]},
cut:{tag:'ORIGINAL INTERACTIVE DEMO / VIDEO',title:'61 / CUT: Motion as a material.',lead:'An original, silent kinetic-type motion study generated in your browser. Play, pause and scrub through the sequence to explore a few motion-design ideas.',sections:[['What it demonstrates','Rhythm, kinetic typography, layout, colour transitions and time-based visual composition.'],['What it does not claim','This is a browser-rendered motion experiment, not a client video or a finished, sound-designed commercial Reel. The cinematic editing portfolio remains represented by the Anticipate work.']],demo:'cut'},
signal:{tag:'ORIGINAL INTERACTIVE DEMO / DATA',title:'61 / SIGNAL: Turn variables into insight.',lead:'A small, transparent analysis lab using deterministic synthetic data. Change the metric and grouping to see the chart and summary statistics recalculate.',sections:[['How it works','The chart is calculated from 24 synthetic observations generated from a documented formula. Controls change the observed subset and metric.'],['Data provenance','All values are synthetic and exist only to demonstrate charting, filtering and analysis logic. They are not real business performance.']],demo:'signal'},
flow:{tag:'ORIGINAL FUNCTIONAL DEMO / SOFTWARE',title:'61 / FLOW: Transform data. Actually run it.',lead:'A compact local workflow tool. Select processing operations, run them against sample rows and export the resulting CSV or workflow configuration.',sections:[['What it demonstrates','Input validation, ordered operations, deterministic results, user controls, error states and data export.'],['Scope limitation','An intentionally small browser demonstration. It is not a cloud automation service, and it does not connect to external accounts.']],demo:'flow'},
frame:{tag:'ORIGINAL INTERACTIVE DEMO / WEB',title:'61 / FRAME: Design is a living system.',lead:'An original fictional-brand microsite preview with live styling controls. Explore how layout and visual treatment change without abandoning clarity.',sections:[['What it demonstrates','Responsive layout, typography, adaptable theming, and meaningful interactive controls.'],['Scope','This is a self-initiated interface study with a fictional concept brand, not a commissioned customer website.']],demo:'frame'}
};
window.Project61={projectData,worldData,openProject,openWorld};
const mosaic=$('#mosaic'),detail=$('#world-detail'),tiles=$$('.world-tile');
let selectedWorld=null,lastWorldTrigger=null,lastProjectTrigger=null,dialogOldHash=null;
function openWorld(id,opts={}){
 if(!worldData[id])return;
 if(selectedWorld===id&&!opts.force){closeWorld();return}
 const data=worldData[id];selectedWorld=id;
 lastWorldTrigger=$('[data-world="'+id+'"]');
 document.body.dataset.activeWorld=id;
 mosaic.classList.add('has-selected');
 tiles.forEach(t=>{const on=t.dataset.world===id;t.classList.toggle('is-selected',on);t.setAttribute('aria-expanded',String(on))});
 $('#detail-index').textContent='WORLD '+data.number+' / 04';
 $('#detail-title').innerHTML=data.title;
 $('#detail-description').textContent=data.description;
 $('#detail-services').innerHTML=data.services.map(s=>'<div class="detail-service">'+s+'</div>').join('');
 $('#detail-projects').innerHTML='<div class="related-work">'+data.projects.map(([slug,label])=>'<button type="button" data-related="'+slug+'">'+label+' ↗</button>').join(' ')+'</div>';
 $('#detail-cta').setAttribute('href','#start');
 $('#detail-cta').dataset.service=id;
 detail.hidden=false;
 if(opts.scroll!==false){requestAnimationFrame(()=>detail.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'}))}
}
function closeWorld(){
 selectedWorld=null;detail.hidden=true;
 document.body.removeAttribute('data-active-world');mosaic.classList.remove('has-selected');
 tiles.forEach(t=>{t.classList.remove('is-selected');t.setAttribute('aria-expanded','false')});
 if(lastWorldTrigger)lastWorldTrigger.focus({preventScroll:true});
}
tiles.forEach(tile=>tile.addEventListener('click',()=>openWorld(tile.dataset.world)));
$('#close-world').addEventListener('click',closeWorld);
$('#detail-projects').addEventListener('click',e=>{const btn=e.target.closest('[data-related]');if(btn)openProject(btn.dataset.related)});
$('#detail-cta').addEventListener('click',()=>window.Project61Inquiry?.selectService(selectedWorld||'unsure'));
$$('.work-filter').forEach(b=>b.addEventListener('click',()=>{
 const category=b.dataset.filter;
 $$('.work-filter').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected))});
 $$('.project-card').forEach(c=>c.hidden=category!=='all'&&c.dataset.category!==category);
}));
const modal=$('#project-dialog'),modalContent=$('#dialog-content');
function openProject(slug,options={}){
 const p=projectData[slug];if(!p)return;
 lastProjectTrigger=document.activeElement;
 let html='<div class="dialog-body"><div class="dialog-category">'+p.tag+'</div><h2 id="dialog-title">'+p.title+'</h2><p class="dialog-lead">'+p.lead+'</p>';
 if(p.stats){html+='<div class="dialog-grid">'+p.stats.map(([n,label])=>'<div class="dialog-stat"><strong>'+n+'</strong><span>'+label+'</span></div>').join('')+'</div>'}
 html+=p.sections.map(([heading,body])=>'<h3 class="dialog-subhead">'+heading+'</h3><p class="dialog-paragraph">'+body+'</p>').join('');
 if(p.links){html+='<div class="dialog-links">'+p.links.map(([label,url])=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+' ↗</a>').join('')+'</div>'}
 if(p.demo)html+='<div class="demo-panel" id="demo-mount"><div class="demo-kicker">LIVE / IN-BROWSER DEMONSTRATION</div><p>Preparing interactive demo…</p></div>';
 html+='<p class="dialog-note">Part of Project 61’s independent portfolio. Results are contextualized and original demonstrations are clearly labelled.</p></div>';
 modalContent.innerHTML=html;
 $('#dialog-tag').textContent=p.tag;
 if(!modal.open)modal.showModal();
 if(options.push!==false){dialogOldHash=location.hash;history.replaceState(null,'','#project/'+slug)}
 if(p.demo)window.Project61Demos?.mount(p.demo,$('#demo-mount'));
}
function closeProject(){
 if(!modal.open)return;
 window.Project61Demos?.unmount?.();
 modal.close();
 if(location.hash.startsWith('#project/'))history.replaceState(null,'',dialogOldHash||'#work');
 lastProjectTrigger?.focus?.({preventScroll:true});
}
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project)));
$('#dialog-close').addEventListener('click',closeProject);
modal.addEventListener('cancel',e=>{e.preventDefault();closeProject()});
modal.addEventListener('click',e=>{if(e.target===modal)closeProject()});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project/')){const slug=decodeURIComponent(location.hash.slice(9));if(projectData[slug])openProject(slug,{push:false})}});
const menuBtn=$('#menu-toggle'),mobile=$('#mobile-menu');
menuBtn.addEventListener('click',()=>{
 const open=mobile.hidden;mobile.hidden=!open;menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');
});
$$('a',mobile).forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menuBtn.setAttribute('aria-expanded','false')}));
const observer= 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.06}):null;
$$('.reveal').forEach(el=>{if(observer)observer.observe(el);else el.classList.add('visible')});
if(!reduced.matches&&window.matchMedia('(pointer:fine)').matches){
 document.body.classList.add('has-pointer');let raf=0,last=null;
 window.addEventListener('pointermove',e=>{last=e;if(raf)return;raf=requestAnimationFrame(()=>{const aura=$('#cursor-aura');aura.style.left=last.clientX+'px';aura.style.top=last.clientY+'px';raf=0})},{passive:true});
}
$('#current-year').textContent=new Date().getFullYear();
setTimeout(()=>{
 if(location.hash.startsWith('#project/')){const slug=decodeURIComponent(location.hash.slice(9));if(projectData[slug])openProject(slug,{push:false})}
 else if(location.pathname==='/work'||location.pathname.startsWith('/work/')){if(location.pathname.startsWith('/work/')){const slug=location.pathname.split('/').filter(Boolean)[1];if(projectData[slug])openProject(slug,{push:false})}else $('#work').scrollIntoView({behavior:'instant'})}
 else if(location.pathname==='/start')$('#start').scrollIntoView({behavior:'instant'});
},100);
})();
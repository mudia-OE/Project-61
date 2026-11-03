(()=>{
'use strict';
let cleanup=()=>{};
const mount=(name,root)=>{
 cleanup();cleanup=()=>{};
 if(!root)return;
 if(name==='cut')mountCut(root);
 if(name==='signal')mountSignal(root);
 if(name==='frame')mountFrame(root);
 if(name==='flow')mountFlow(root);
};
function downloadText(name,text,type='text/plain'){
 const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function mountCut(root){
 root.innerHTML='<div class="demo-kicker">61 / CUT — SILENT KINETIC MOTION STUDY</div><h3>Words, arranged in time.</h3><p class="demo-disclaimer">Original browser-rendered motion graphics. No commercial footage or audio. This is an interactive demonstration, not a completed client edit.</p><canvas class="demo-canvas" id="cut-canvas" width="1280" height="720" aria-label="Abstract animated kinetic typography demonstration"></canvas><div class="demo-controls"><button type="button" id="cut-toggle">▶ PLAY</button><label for="cut-seek">PLAYHEAD</label><input id="cut-seek" class="demo-progress" type="range" min="0" max="24" step=".01" value="0"><span id="cut-time" class="demo-hint">00:00 / 00:24</span></div><p class="demo-hint">Four visual scenes · 24 seconds · silent</p>';
 const canvas=root.querySelector('#cut-canvas'),ctx=canvas.getContext('2d'),toggle=root.querySelector('#cut-toggle'),seek=root.querySelector('#cut-seek'),time=root.querySelector('#cut-time');
 let current=0,playing=false,old=0,frame=0;
 const scenes=[{bg:'#ea604a',fg:'#18151b',top:'01 / MOTION',big:'MOVE.',sub:'NOTHING STANDS STILL.'},{bg:'#b5f34b',fg:'#172419',top:'02 / INFORMATION',big:'SEE.',sub:'THE SIGNAL IN THE NOISE.'},{bg:'#76beff',fg:'#152537',top:'03 / EXPERIENCE',big:'FEEL.',sub:'DIGITAL, BUT ALIVE.'},{bg:'#ae8bff',fg:'#271a38',top:'04 / SYSTEMS',big:'BUILD.',sub:'THEN MAKE IT BETTER.'}];
 function draw(t){
 const w=canvas.width,h=canvas.height,s=Math.min(3,Math.floor(t/6)),sc=scenes[s],local=t-s*6,p=local/6;
 ctx.clearRect(0,0,w,h);ctx.fillStyle=sc.bg;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle=sc.fg+'48';ctx.lineWidth=2;
 for(let x=-w;x<w*2;x+=90){ctx.beginPath();ctx.moveTo(x+(p*130),0);ctx.lineTo(x+w*.35+(p*130),h);ctx.stroke()}
 const angle=p*Math.PI*1.8;
 ctx.save();ctx.translate(w*.81,h*.4);ctx.rotate(angle);ctx.strokeStyle=sc.fg;ctx.lineWidth=35;ctx.beginPath();ctx.arc(0,0,235,0,Math.PI*1.55);ctx.stroke();ctx.restore();
 ctx.fillStyle=sc.fg;ctx.textAlign='left';ctx.font='700 28px monospace';ctx.fillText('PROJECT 61 / '+sc.top,54,62);
 const slide=Math.sin(Math.min(1,local/.55)*Math.PI/2),scale=1+.11*Math.sin(p*Math.PI);
 ctx.save();ctx.translate((1-slide)*-w*.25,0);ctx.scale(scale,scale);ctx.font='700 230px "Space Grotesk",sans-serif';ctx.fillText(sc.big,48/scale,390/scale);ctx.restore();
 ctx.font='700 27px monospace';ctx.fillText(sc.sub,60,485);
 ctx.fillRect(58,h-110,460,2);
 ctx.fillStyle=sc.fg;ctx.font='700 21px monospace';ctx.fillText('CREATIVE × TECHNICAL',58,h-62);
 ctx.textAlign='right';ctx.font='700 30px monospace';ctx.fillText('0'+(s+1)+' / 04',w-54,h-55);
 }
 const format=t=>'00:'+String(Math.floor(t)).padStart(2,'0');
 function update(){seek.value=current.toFixed(2);time.textContent=format(current)+' / 00:24';draw(current)}
 function tick(now){if(!playing)return;if(!old)old=now;current=Math.min(24,current+(now-old)/1000);old=now;update();if(current>=24){playing=false;toggle.textContent='↻ REPLAY';frame=0}else frame=requestAnimationFrame(tick)}
 toggle.addEventListener('click',()=>{if(playing){playing=false;cancelAnimationFrame(frame);toggle.textContent='▶ PLAY';return}if(current>=24)current=0;playing=true;old=0;toggle.textContent='❚❚ PAUSE';frame=requestAnimationFrame(tick)});
 seek.addEventListener('input',()=>{current=Number(seek.value);old=0;update()});
 update();
 cleanup=()=>{playing=false;cancelAnimationFrame(frame)};
}
function syntheticRows(){
 const rows=[];for(let i=0;i<24;i++){const month=i%12+1,year=i<12?2025:2026,group=i%2?'North':'South',cycle=Math.sin(i*.75)*13,trend=i*1.1;rows.push({period:year+'-'+String(month).padStart(2,'0'),group,visits:Math.round(115+trend+cycle+(i%2?17:0)),actions:Math.round(42+i*.68+Math.cos(i*.8)*8+(i%2?4:0))})}return rows;
}
function mountSignal(root){
 root.innerHTML='<div class="demo-kicker">61 / SIGNAL — ORIGINAL SYNTHETIC DATA</div><h3>What changes when you ask a different question?</h3><p class="demo-disclaimer">24 synthetic monthly observations across two fictional segments. Data generated deterministically in the browser. No real company metrics.</p><div class="demo-controls"><label for="signal-metric">METRIC</label><select id="signal-metric"><option value="visits">Sample visits</option><option value="actions">Sample actions</option><option value="rate">Actions / visits (%)</option></select><label for="signal-group">GROUP</label><select id="signal-group"><option value="all">All segments</option><option value="North">North</option><option value="South">South</option></select><button type="button" id="signal-download">↓ EXPORT CSV</button></div><div class="data-stats" id="signal-stats"></div><svg id="signal-chart" class="demo-chart" viewBox="0 0 760 300" role="img" aria-label="Interactive line chart showing synthetic data"></svg><div class="demo-table-wrap"><table class="demo-table"><thead><tr><th>PERIOD</th><th>GROUP</th><th>VISITS</th><th>ACTIONS</th><th>RATE</th></tr></thead><tbody id="signal-table"></tbody></table></div><p class="demo-hint">The chart, summary and table update together. All exports contain only synthetic data.</p>';
 const rows=syntheticRows(),metric=root.querySelector('#signal-metric'),group=root.querySelector('#signal-group'),chart=root.querySelector('#signal-chart'),stats=root.querySelector('#signal-stats'),tbody=root.querySelector('#signal-table');
 const val=(r,k)=>k==='rate'?100*r.actions/r.visits:r[k];
 let filtered=[];
 function render(){
 filtered=rows.filter(r=>group.value==='all'||r.group===group.value);
 const k=metric.value,values=filtered.map(r=>val(r,k)),avg=values.reduce((a,b)=>a+b,0)/values.length,min=Math.min(...values),max=Math.max(...values),padding=(max-min)*.18||5,low=Math.max(0,min-padding),hi=max+padding;
 const f=n=>k==='rate'?n.toFixed(1)+'%':Math.round(n).toLocaleString('en-CA');
 stats.innerHTML=[['OBSERVATIONS',String(filtered.length)],['AVERAGE',f(avg)],['RANGE',f(min)+'–'+f(max)]].map(([label,n])=>'<div><strong>'+escapeText(n)+'</strong><small>'+label+'</small></div>').join('');
 const pos=(n,i)=>[46+(i/Math.max(1,values.length-1))*663,245-(n-low)/(hi-low)*194];
 const path=values.map((n,i)=>{const [x,y]=pos(n,i);return(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)}).join(' ');
 let svg='<title>Synthetic '+metric.options[metric.selectedIndex].text+' for '+group.value+'; '+filtered.length+' observations</title>';
 for(let j=0;j<5;j++){const y=52+j*48.5;svg+='<line class="gridline" x1="46" y1="'+y+'" x2="712" y2="'+y+'"/><text x="8" y="'+(y+4)+'" font-family="monospace" font-size="11" fill="#afb7ba">'+escapeText(f(hi-(hi-low)*j/4))+'</text>'}
 svg+='<path class="graph-line" d="'+path+'"/>';
 values.forEach((n,i)=>{const [x,y]=pos(n,i);svg+='<circle class="graph-dot" cx="'+x+'" cy="'+y+'" r="5"><title>'+escapeText(filtered[i].period+': '+f(n))+'</title></circle>'});
 svg+='<text x="46" y="283" font-family="monospace" font-size="12" fill="#c9cdd3">'+filtered[0].period+'</text><text x="712" y="283" text-anchor="end" font-family="monospace" font-size="12" fill="#c9cdd3">'+filtered[filtered.length-1].period+'</text>';
 chart.innerHTML=svg;
 tbody.innerHTML=filtered.slice().reverse().map(r=>'<tr><td>'+r.period+'</td><td>'+r.group+'</td><td>'+r.visits+'</td><td>'+r.actions+'</td><td>'+((r.actions/r.visits)*100).toFixed(1)+'%</td></tr>').join('');
 }
 metric.addEventListener('change',render);group.addEventListener('change',render);
 root.querySelector('#signal-download').addEventListener('click',()=>{const csv=['period,group,visits,actions,action_rate_percent',...filtered.map(r=>[r.period,r.group,r.visits,r.actions,(100*r.actions/r.visits).toFixed(2)].join(','))].join('\n');downloadText('61-signal-synthetic.csv',csv,'text/csv')});
 render();
}
function mountFrame(root){
 root.innerHTML='<div class="demo-kicker">61 / FRAME — FICTIONAL MICROSITE STUDY</div><h3>One idea. Different visual systems.</h3><p class="demo-disclaimer">Fictional studio concept; no real client, product or claim. Interact with the controls and watch the preview change.</p><div class="demo-controls"><label for="frame-theme">PALETTE</label><select id="frame-theme"><option value="light">Warm paper</option><option value="dark">Night ink</option></select><label for="frame-shape">FORM</label><select id="frame-shape"><option value="editorial">Editorial</option><option value="modern">Soft / rounded</option></select></div><div class="frame-preview" id="frame-preview"><div class="frame-meta"><span>FORM / FUNCTION</span><span>VOL. 001 — CONCEPT</span></div><h4>OBJECTS<br>FOR LIVING.</h4><p>A fictional design collection about everyday objects, ordinary moments and extraordinary attention to detail.</p><span class="frame-cta">EXPLORE THE IDEA ↗</span></div><p class="demo-hint">Real CSS state changes, responsive typography and controls. The preview is not a deployed customer shop.</p>';
 const preview=root.querySelector('#frame-preview');
 root.querySelector('#frame-theme').addEventListener('change',e=>preview.classList.toggle('dark-mode',e.target.value==='dark'));
 root.querySelector('#frame-shape').addEventListener('change',e=>preview.classList.toggle('modern-mode',e.target.value==='modern'));
}
function mountFlow(root){
 root.innerHTML='<div class="demo-kicker">61 / FLOW — EXECUTABLE LOCAL WORKFLOW</div><h3>Make the data do something.</h3><p class="demo-disclaimer">Choose a template or customize the operations below. The workflow runs locally in your browser against included synthetic rows. Nothing is sent to a server.</p><div class="demo-controls"><label for="flow-template">TEMPLATE</label><select id="flow-template"><option value="clean">Clean & deduplicate</option><option value="rank">Rank the records</option><option value="filter">Filter & summarize</option></select><button id="flow-run" type="button">▶ RUN WORKFLOW</button><button id="flow-csv" type="button">↓ CSV</button><button id="flow-json" type="button">↓ WORKFLOW JSON</button></div><div class="demo-hint">Operations execute from left to right (top to bottom). Reorder them with the arrow controls.</div><div class="flow-steps" id="flow-steps"></div><div id="flow-feedback" aria-live="polite" class="demo-hint"></div><h3 class="dialog-subhead">Calculated output</h3><div id="flow-output" class="demo-table-wrap"></div><p class="demo-hint">Sample rows include deliberate whitespace, duplicate IDs and missing scores to demonstrate real transformations.</p>';
 const original=[{id:1,name:'  Alpha ',score:85},{id:2,name:'Beta  ',score:null},{id:3,name:' Gamma',score:72},{id:2,name:'Beta  ',score:null},{id:4,name:'Delta',score:93},{id:5,name:'  Epsilon',score:58},{id:6,name:'Zeta ',score:79}];
 const labels={trim:'Trim whitespace',unique:'Remove duplicate IDs',fill:'Fill missing scores with 0',filter:'Keep scores ≥ 75',sort:'Sort scores descending'};
 const templates={clean:['trim','unique','fill'],rank:['trim','unique','fill','sort'],filter:['unique','fill','filter','sort']};
 let ops=[],result=[];
 const steps=root.querySelector('#flow-steps'),output=root.querySelector('#flow-output'),feedback=root.querySelector('#flow-feedback'),template=root.querySelector('#flow-template');
 function renderOps(){steps.innerHTML=ops.map((op,i)=>'<div class="flow-op"><strong>'+escapeText(labels[op])+'</strong><button type="button" data-shift="'+i+'" data-move="-1" aria-label="Move '+escapeText(labels[op])+' earlier">↑</button><button type="button" data-shift="'+i+'" data-move="1" aria-label="Move '+escapeText(labels[op])+' later">↓</button><button type="button" data-remove="'+i+'" aria-label="Remove '+escapeText(labels[op])+'">×</button></div>').join('')+'<label class="flow-add-label" for="flow-add">+ ADD OPERATION <select id="flow-add"><option value="">Choose…</option>'+Object.entries(labels).filter(([key])=>!ops.includes(key)).map(([key,name])=>'<option value="'+key+'">'+escapeText(name)+'</option>').join('')+'</select></label>';}
 function run(){
 let rows=original.map(r=>({...r}));try{
 for(const op of ops){
 if(op==='trim')rows=rows.map(r=>({...r,name:r.name.trim()}));
 else if(op==='unique'){const seen=new Set();rows=rows.filter(r=>!seen.has(r.id)&&!!seen.add(r.id))}
 else if(op==='fill')rows=rows.map(r=>({...r,score:r.score===null?0:r.score}));
 else if(op==='filter'){if(rows.some(r=>r.score===null))throw Error('Fill missing scores before filtering.');rows=rows.filter(r=>r.score>=75)}
 else if(op==='sort')rows=rows.slice().sort((a,b)=>(b.score??-Infinity)-(a.score??-Infinity));
 }
 result=rows;
 output.innerHTML='<table class="demo-table"><thead><tr><th>ID</th><th>NAME</th><th>SCORE</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+r.id+'</td><td>'+escapeText(r.name)+'</td><td>'+(r.score===null?'missing':r.score)+'</td></tr>').join('')+'</tbody></table>';
 feedback.textContent='✓ '+rows.length+' output rows · '+ops.length+' operations applied in order.';
 }catch(e){result=[];output.textContent='No output. Adjust your operation order and try again.';feedback.textContent='Workflow error: '+e.message}
 }
 function preset(){ops=templates[template.value].slice();renderOps();run()}
 template.addEventListener('change',preset);
 steps.addEventListener('click',e=>{
 const move=e.target.closest('[data-shift]'),remove=e.target.closest('[data-remove]');
 if(move){const idx=Number(move.dataset.shift),next=idx+Number(move.dataset.move);if(next>=0&&next<ops.length)[ops[idx],ops[next]]=[ops[next],ops[idx]]}
 else if(remove){ops.splice(Number(remove.dataset.remove),1)}else return;
 renderOps();run();
 });
 steps.addEventListener('change',e=>{if(e.target.id==='flow-add'&&e.target.value){ops.push(e.target.value);renderOps();run()}});
 root.querySelector('#flow-run').addEventListener('click',run);
 root.querySelector('#flow-csv').addEventListener('click',()=>{if(!result.length){feedback.textContent='No output to download. Run a valid workflow first.';return}downloadText('61-flow-output.csv',['id,name,score',...result.map(r=>[r.id,'"'+r.name.replace(/"/g,'""')+'"',r.score??''].join(','))].join('\n'),'text/csv')});
 root.querySelector('#flow-json').addEventListener('click',()=>downloadText('61-flow-workflow.json',JSON.stringify({version:1,name:'61 / FLOW',operations:ops},null,2),'application/json'));
 preset();
}
window.Project61Demos={mount,unmount(){cleanup();cleanup=()=>{}}};
})();
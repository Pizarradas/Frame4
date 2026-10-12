(() => {
'use strict';
const scenes=[...document.querySelectorAll('[data-scene]')],stage=document.querySelector('.wow4-stage'),glyphs=[...document.querySelectorAll('.wow4-glyph')],prefs=matchMedia('(prefers-reduced-motion: reduce)');
const dialog=document.querySelector('#viewer'),full=document.querySelector('#full-video'),lab=document.querySelector('#signal-lab'),reduce=document.querySelector('#reduce'),previous=document.querySelector('#previous'),next=document.querySelector('#next'),count=document.querySelector('#chapter-count'),progress=document.querySelector('#progress');
let manualReduce=false,mm=null,journey=null,active=0;const reduced=()=>prefs.matches||manualReduce;
const bg=[...document.querySelectorAll('[data-bg]')],visible=new Set(),paused=new Set();
function sync(v){const b=document.querySelector('[data-toggle="'+v.id+'"]');if(b)b.textContent=v.paused?'Reproducir fondo ▶':'Pausar fondo Ⅱ';}
function background(){for(const v of bg){const scene=v.closest('[data-scene]');const valid=(!journey||Number(scene.dataset.scene)===active)&&visible.has(v);if(valid&&!reduced()&&!paused.has(v)&&!dialog.open&&!document.hidden)v.play().catch(()=>sync(v));else v.pause();}}
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target)}background()},{threshold:.1});bg.forEach(v=>{observer.observe(v);v.addEventListener('play',()=>sync(v));v.addEventListener('pause',()=>sync(v));v.addEventListener('error',()=>{const b=document.querySelector('[data-toggle="'+v.id+'"]');if(b){b.textContent='Vídeo no disponible';b.disabled=true}})});
document.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const v=document.getElementById(b.dataset.toggle);if(v.paused){paused.delete(v);v.play().catch(()=>sync(v))}else{paused.add(v);v.pause()}});
function chapter(i){i=Math.max(0,Math.min(4,i));if(i!==active||count.textContent!==String(i+1).padStart(2,'0')+' / 05'){active=i;count.textContent=String(i+1).padStart(2,'0')+' / 05';background()}previous.disabled=i===0;next.disabled=i===4;if(journey){scenes.forEach((s,k)=>{s.inert=k!==i;s.setAttribute('aria-hidden',String(k!==i))})}progress.style.transform='scaleX('+((i+1)/5)+')';}
function goto(i){i=Math.max(0,Math.min(4,i));if(journey){const p=(i*2+.5)/9,st=journey.scrollTrigger;scrollTo({top:st.start+p*(st.end-st.start),behavior:'auto'});journey.progress(p);chapter(i)}else{scenes[i].scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'});chapter(i)}}
previous.onclick=()=>goto(active-1);next.onclick=()=>goto(active+1);chapter(0);
const sceneObserver=new IntersectionObserver(entries=>{if(journey)return;for(const e of entries)if(e.isIntersecting)chapter(Number(e.target.dataset.scene))},{threshold:.5});scenes.forEach(s=>sceneObserver.observe(s));
document.querySelector('#skip').addEventListener('click',e=>{e.preventDefault();document.querySelector('#cierre').scrollIntoView({behavior:reduced()?'auto':'smooth',block:'start'})});
let signalFrame=0,signalRunning=false,signalTime=0;const canvas=document.querySelector('#signal-canvas'),ctx=canvas.getContext('2d'),range=document.querySelector('#signal-intensity'),signalPause=document.querySelector('#signal-pause');
function paintSignal(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--wow4-dark').trim();const amp=Number(range.value)/100;for(let i=0;i<48;i++){const x=w*(i/48),height=h*(.07+amp*(.5+.5*Math.sin(i*.35+signalTime)));ctx.fillRect(x,(h-height)/2,w*.01,height)}if(signalRunning&&!document.hidden){signalTime+=.045;signalFrame=requestAnimationFrame(paintSignal)}}
range.oninput=()=>{if(!signalRunning)paintSignal()};signalPause.onclick=()=>{signalRunning=!signalRunning;signalPause.textContent=signalRunning?'Pausar señal':'Reproducir señal';if(signalRunning)paintSignal();else cancelAnimationFrame(signalFrame)};
document.querySelectorAll('[data-watch]').forEach(b=>b.onclick=()=>{const k=b.dataset.watch;full.pause();full.hidden=k==='signal';lab.hidden=k!=='signal';document.querySelector('#viewer-title').textContent={color:'Color in Motion — Reel',process:'First Principles — Proceso',signal:'Signal to Noise — Laboratorio'}[k];document.querySelector('#viewer-note').textContent=k==='signal'?'Concepto interactivo. El control de intensidad modifica la amplitud de la señal.':'Vídeo aportado por el usuario · Versión optimizada sin audio.';dialog.showModal();bg.forEach(v=>v.pause());if(k==='signal'){signalRunning=!reduced();signalPause.textContent=signalRunning?'Pausar señal':'Reproducir señal';paintSignal()}else{full.src='assets/video/'+(k==='color'?'color-reel.mp4':'process.mp4');full.play().catch(()=>{})}});
document.querySelector('#close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{full.pause();signalRunning=false;cancelAnimationFrame(signalFrame);background()});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){bg.forEach(v=>v.pause());full.pause();cancelAnimationFrame(signalFrame)}else{background();if(dialog.open&&!lab.hidden&&signalRunning)paintSignal()}});
function setup(){
 if(mm)mm.revert();journey=null;scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden')});reduce.disabled=prefs.matches;reduce.setAttribute('aria-pressed',String(reduced()));reduce.textContent=prefs.matches?'Movimiento reducido (sistema)':reduced()?'Activar movimiento':'Reducir movimiento';
 if(!window.gsap||!window.ScrollTrigger||!window.MotionPathPlugin){reduce.hidden=true;return}
 gsap.registerPlugin(ScrollTrigger,MotionPathPlugin);mm=gsap.matchMedia();
 if(reduced()){ScrollTrigger.refresh();background();return}
 mm.add('(min-width: 64em) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',()=>{
  const h=innerHeight,w=stage.clientWidth,margin=parseFloat(getComputedStyle(document.querySelector('.wow4-scene-content')).paddingLeft),u=parseFloat(getComputedStyle(document.querySelector('.wow4-scene')).paddingTop)/3||24;
  const palette=getComputedStyle(document.documentElement),color=n=>palette.getPropertyValue('--wow4-'+n).trim();
  const controls=document.querySelector('.wow4-chapter-controls');
  gsap.set(stage,{height:'100svh'});gsap.set(scenes,{position:'absolute',inset:0,display:'flex',alignItems:'center',paddingTop:'var(--wow4-u)',paddingBottom:'calc(4 * var(--wow4-u))',autoAlpha:0});gsap.set(scenes[0],{autoAlpha:1});
  gsap.set(controls,{position:'absolute',left:0,right:0,bottom:0,zIndex:10});gsap.set('.wow4-orbit',{display:'block'});
  gsap.set(glyphs,{opacity:0,fontSize:h*.65,x:margin,y:h*.17,rotation:0});gsap.set(glyphs[0],{opacity:.2,color:color('acid')});
  // A real curved route, derived from viewport/grid coordinates, travels through all five scenes.
  const tl=gsap.timeline({scrollTrigger:{trigger:stage,start:'top top',end:()=>'+='+innerHeight*6,pin:true,scrub:.65,invalidateOnRefresh:true,onUpdate:self=>chapter(Math.min(4,Math.floor((self.progress*9+.5)/2)))}});
  journey=tl;
  tl.to({}, {duration:1});
  for(let i=1;i<5;i++){const at=i*2-1;
   tl.to(scenes[i-1],{autoAlpha:0,xPercent:-18,duration:.8,ease:'power2.in'},at).fromTo(scenes[i],{autoAlpha:0,xPercent:35},{autoAlpha:1,xPercent:0,duration:1,ease:'power2.out'},at);
   tl.to(stage,{backgroundColor:[color('bg'),color('paper'),color('bg'),color('acid'),color('bg')][i],duration:1},at);
  }
  const route=[{x:margin,y:h*.17},{x:w*.44,y:h*.02},{x:w*.64,y:h*.21},{x:w*.75,y:h*.62},{x:w*.16,y:h*.50},{x:w*.10,y:h*.12},{x:w*.42,y:h*.08},{x:w*.75,y:h*.42},{x:w*.53,y:h*.15}];
  tl.to(glyphs[0],{motionPath:{path:route,curviness:1.5},rotation:360,scale:.45,duration:8,ease:'none'},0);
  tl.to(glyphs[0],{color:color('dark'),opacity:.15,duration:1},1).to(glyphs[0],{color:color('acid'),opacity:.17,duration:1},3).to(glyphs[0],{color:color('dark'),duration:1},5).to(glyphs[0],{color:color('acid'),opacity:.1,duration:1},7);
  tl.fromTo('.wow4-title-last',{xPercent:0},{xPercent:-12,scale:.76,transformOrigin:'left center',duration:1.8,ease:'none'},0);
  tl.fromTo('.wow4-idea-title',{xPercent:20,scale:.7},{xPercent:0,scale:1,transformOrigin:'left center',duration:1.5,ease:'power2.out'},1);
  tl.to('.wow4-idea-last',{xPercent:-8,duration:1,ease:'none'},2);
  // Layout changes from a 2:1 split to a 5:1 split while the picture counter-zooms.
  tl.fromTo('.wow4-color-layout',{gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)'},{gridTemplateColumns:'minmax(0,5fr) minmax(0,1fr)',duration:1.5,ease:'none'},3);
  tl.fromTo('.wow4-color-media img',{scale:1.4},{scale:1,rotation:-4,duration:2,ease:'none'},3);
  tl.to('.wow4-color-copy',{xPercent:70,autoAlpha:0,duration:1},4);
  tl.to('.wow4-color-caption',{yPercent:-100,rotation:-6,duration:2,ease:'none'},3);
  tl.to('.wow4-color-disc',{motionPath:{path:[{x:0,y:0},{x:-w*.2,y:h*.15},{x:-w*.3,y:h*.45}],curviness:1.5},rotation:270,scale:1.8,duration:2,ease:'none'},3);
  tl.fromTo('.wow4-tunnel',{scale:.2,rotation:-45},{scale:2.2,rotation:135,duration:2.8,ease:'none'},5);
  tl.fromTo('.wow4-signal-title',{scale:.7,xPercent:20},{scale:1.12,xPercent:-8,duration:2.4,ease:'none'},5);
  tl.to('.wow4-signal-last',{xPercent:15,duration:2,ease:'none'},5);
  tl.fromTo('.wow4-process-frame',{clipPath:'inset(0% 0% 0% 65%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:2,ease:'power2.out'},7);
  tl.fromTo('.wow4-process-last',{yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:1.4},7);
  // Assemble FRAME from five floating glyphs during the last hold, without replacing its heading.
  glyphs.forEach((g,i)=>{if(i>0){tl.set(g,{x:w*(.15+i*.14),y:h*.11,scale:.15,opacity:0,rotation:i%2?90:-90},7.6)}tl.to(g,{x:w*(.55+i*.055),y:h*.09,scale:.10,opacity:.5,rotation:0,color:color('acid'),duration:.7,ease:'power2.out'},8)});
  tl.to({}, {duration:.3},8.7);
  chapter(0);return ()=>{journey=null;scenes.forEach(s=>{s.inert=false;s.removeAttribute('aria-hidden')})};
 });
 mm.add('(max-width: 63.99em) and (prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.wow4-idea-title',{xPercent:8,opacity:.35,ease:'none',scrollTrigger:{trigger:scenes[1],start:'top 85%',end:'center 65%',scrub:1}});
  gsap.fromTo('.wow4-color-media img',{scale:1.15},{scale:1,ease:'none',scrollTrigger:{trigger:scenes[2],start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.wow4-tunnel',{scale:1.6,rotation:90,ease:'none',scrollTrigger:{trigger:scenes[3],start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.wow4-process-last',{xPercent:8,ease:'none',scrollTrigger:{trigger:scenes[4],start:'top bottom',end:'center center',scrub:1}});
 });
 mm.add('(prefers-reduced-motion: no-preference)',()=>{gsap.from('.wow4-outro-last',{xPercent:-5,ease:'none',scrollTrigger:{trigger:'#cierre',start:'top bottom',end:'center center',scrub:1}})});
 ScrollTrigger.refresh();background();
}
reduce.onclick=()=>{manualReduce=!reduced();setup()};prefs.addEventListener('change',setup);
const ready=document.fonts?document.fonts.ready:Promise.resolve();ready.then(setup);window.addEventListener('load',()=>{if(window.ScrollTrigger)ScrollTrigger.refresh()});
})();

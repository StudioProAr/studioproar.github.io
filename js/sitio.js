/* frase que rota (siempre; con movimiento reducido cambia sin fundido) */
(function(){
  const f=['agenda, que se llena sola','carta, con pedidos desde la mesa','catálogo, que vende por WhatsApp','local, fácil de encontrar en Google','negocio, en una app en tu celular'];
  const el=document.getElementById('rota');if(!el)return;
  const quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i=0;setInterval(()=>{if(quieto){i=(i+1)%f.length;el.textContent=f[i];return;}el.classList.add('fuera');setTimeout(()=>{i=(i+1)%f.length;el.textContent=f[i];el.classList.remove('fuera');},350);},2800);
})();
/* menú en celular */
(function(){
  const b=document.getElementById('menu'),n=document.querySelector('nav');if(!b||!n)return;
  b.addEventListener('click',()=>{const a=n.classList.toggle('abierto');b.setAttribute('aria-expanded',a);});
})();
/* ¿cuál me conviene? */
(function(){
  const q=document.getElementById('quiz');if(!q)return;
  const r={};const pasos=[...q.querySelectorAll('.quiz-p')],res=document.getElementById('quiz-r');
  const planes=[...document.querySelectorAll('.plan')];
  q.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.id==='quiz-otra'){Object.keys(r).forEach(k=>delete r[k]);pasos.forEach((p,i)=>p.hidden=i>0);res.hidden=true;planes.forEach(p=>p.classList.remove('marcado'));return;}
    const p=b.closest('.quiz-p');if(!p)return;r[p.dataset.q]=b.dataset.v;
    let sig=+p.dataset.q+1;
    if(r[0]==='mesa')sig=3;
    if(p.dataset.q==='0'&&r[0]!=='info')sig=2;
    p.hidden=true;
    if(sig<3){pasos[sig].hidden=false;return;}
    let n;
    if(r[0]==='mesa'){res.hidden=false;res.innerHTML='Para pedidos desde la mesa tenés el <a href="sistemas.html"><b>sistema de pedidos desde la mesa</b></a>, con o sin web. <button type="button" id="quiz-otra">Volver a empezar</button>';return;}
    if(r[2]==='si')n=4;else if(r[0]==='turnos'||r[0]==='vender')n=3;else n=r[1]==='mucho'?2:1;
    const card=planes[n-1],nom=card.querySelector('h3').textContent,pe=card.querySelector('.precio'),pre=pe.dataset.fin||pe.textContent;
    res.hidden=false;res.innerHTML='Te conviene el <b>plan '+n+' · '+nom+'</b>, desde '+pre+' de lanzamiento. <button type="button" id="quiz-otra">Volver a empezar</button>';
    planes.forEach(p=>p.classList.toggle('marcado',p===card));
    card.scrollIntoView({behavior:'smooth',block:'center'});
  });
})();
document.querySelectorAll('.copiar').forEach(b=>{
  b.addEventListener('click',async()=>{
    const txt=b.dataset.copy,prev=b.textContent;
    try{
      await navigator.clipboard.writeText(txt);
      b.textContent='Copiado';
    }catch(e){
      const n=document.getElementById(b.dataset.src),r=document.createRange();
      r.selectNodeContents(n);
      const s=getSelection();s.removeAllRanges();s.addRange(r);
      b.textContent='Seleccionado';
    }
    setTimeout(()=>{b.textContent=prev},1800);
  });
});
/* ---------- movimiento ---------- */
(function(){
  const quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* barra de progreso de lectura */
  const pr=document.createElement('div');pr.className='prog';pr.setAttribute('aria-hidden','true');document.body.appendChild(pr);
  let tic=false;
  addEventListener('scroll',()=>{if(tic)return;tic=true;requestAnimationFrame(()=>{const h=document.documentElement;pr.style.transform='scaleX('+(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight))+')';tic=false;});},{passive:true});

  /* aparición escalonada al hacer scroll */
  const grupos='.head,.flujo li,.obra,.plan,section .in > p,section .in > ul > li,section .in > ol > li,details,.cierre .in > *';
  const els=[...document.querySelectorAll(grupos)].filter(e=>!e.closest('.hero'));
  if(!quieto&&'IntersectionObserver' in window){
    els.forEach(e=>{const h=[...e.parentElement.children].filter(x=>els.includes(x));e.style.setProperty('--d',Math.min(h.indexOf(e),6)*0.08+'s');e.classList.add('rv');});
    const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target);}}),{rootMargin:'0px 0px -8% 0px'});
    els.forEach(e=>io.observe(e));
  }

  /* flujo "todo conectado": se enciende paso por paso */
  const pasos=[...document.querySelectorAll('.flujo li')];
  if(pasos.length&&!quieto){
    let k=0,t=null;
    const corre=()=>{pasos.forEach((p,j)=>p.classList.toggle('on',j===k));k=(k+1)%pasos.length;};
    new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&!t){corre();t=setInterval(corre,1400);}else if(!x.isIntersecting&&t){clearInterval(t);t=null;}}),{threshold:.3}).observe(pasos[0].parentElement);
  }

  /* relieve 3D en tarjetas (solo con mouse) */
  if(!quieto&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.obra,.plan').forEach(c=>{
      c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+(x*6)+'deg) rotateX('+(-y*6)+'deg) translateY(-4px)';});
      c.addEventListener('pointerleave',()=>{c.style.transform='';});
    });
  }

  /* precios que cuentan hasta su valor la primera vez que se ven */
  if(!quieto){
    const io2=new IntersectionObserver(es=>es.forEach(x=>{
      if(!x.isIntersecting)return;io2.unobserve(x.target);
      const el=x.target,fin=el.dataset.fin=el.textContent,num=+fin.replace(/\D/g,'');if(!num)return;
      const t0=performance.now(),dur=900;
      const paso=t=>{const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent='$'+(Math.round(num*e/500)*500).toLocaleString('es-AR');if(p<1)requestAnimationFrame(paso);else el.textContent=fin;};
      requestAnimationFrame(paso);
    }),{threshold:.6});
    document.querySelectorAll('.plan .precio').forEach(p=>io2.observe(p));
  }
})();

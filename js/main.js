/* ========== BURGER MENU ========== */
const burger=document.querySelector('.nav-burger');
const navLinks=document.querySelector('.nav-links');
if(burger){burger.addEventListener('click',()=>{navLinks.classList.toggle('active')})}

/* Close menu on link click (mobile) */
document.querySelectorAll('.nav-links a').forEach(a=>{
a.addEventListener('click',()=>{navLinks.classList.remove('active')})
});

/* ========== FADE IN ON SCROLL ========== */
const faders=document.querySelectorAll('.fade-in');
const obs=new IntersectionObserver((entries)=>{
entries.forEach(e=>{
if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
})
},{threshold:.15});
faders.forEach(f=>obs.observe(f));

/* ========== LANG TOGGLE FR / EN ========== */
let lang='fr';
const toggle=document.querySelector('.lang-toggle');
if(toggle){
toggle.addEventListener('click',()=>{
lang=lang==='fr'?'en':'fr';
toggle.textContent=lang==='fr'?'EN':'FR';
document.querySelectorAll('[data-fr]').forEach(el=>{
el.innerHTML=el.getAttribute('data-'+lang);
});
});
}

/* ========== NAV SCROLL SHADOW ========== */
const nav=document.querySelector('.nav');
if(nav){
window.addEventListener('scroll',()=>{
if(window.scrollY>50){nav.style.background='rgba(5,11,20,.95)'}
else{nav.style.background='rgba(7,15,27,.85)'}
});
}

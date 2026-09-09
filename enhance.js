const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('input').forEach((input,i)=>{input.id ||= 'field-'+i;const label=input.closest('.f-field')?.querySelector('label');if(label)label.htmlFor=input.id;input.autocomplete=input.name==='phone'?'tel':'given-name';if(input.name==='phone'){input.setAttribute('aria-label','Ваш номер телефона');input.addEventListener('input',()=>input.setCustomValidity(''));}});
document.querySelectorAll('.faq-item').forEach((item,i)=>{const q=item.querySelector('.faq-q'),a=item.querySelector('.faq-ans');a.id='answer-'+i;q.setAttribute('aria-controls',a.id);q.setAttribute('aria-expanded','false');q.addEventListener('click',()=>{document.querySelectorAll('.faq-item').forEach(x=>x.querySelector('.faq-q').setAttribute('aria-expanded',String(x.classList.contains('is-open'))));});});
const navButton=document.querySelector('#burger');navButton.setAttribute('aria-controls','nav-menu');navButton.setAttribute('aria-expanded','false');new MutationObserver(()=>navButton.setAttribute('aria-expanded',String(document.querySelector('#nav-menu').classList.contains('open')))).observe(document.querySelector('#nav-menu'),{attributes:true,attributeFilter:['class']});
for(const selector of ['.works-scroll','.video-reviews-scroll']){const track=document.querySelector(selector);if(!track)continue;const controls=document.createElement('div');controls.className='gallery-controls';for(const dir of [-1,1]){const btn=document.createElement('button');btn.type='button';btn.textContent=dir===-1?'←':'→';btn.setAttribute('aria-label',dir===-1?'Предыдущие работы':'Следующие работы');btn.onclick=()=>track.scrollBy({left:dir*track.clientWidth*.85,behavior:reduceMotion.matches?'auto':'smooth'});controls.append(btn);}track.after(controls);}
document.querySelectorAll('.work-card').forEach((card,i)=>{card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Открыть: '+card.querySelector('img').alt);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();lbOpen(i);}});});
for(const id of ['modal-ov','lb']){const dialog=document.getElementById(id);dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label',id==='lb'?'Результаты работ':'Запись на консультацию');let restore;new MutationObserver(()=>{if(dialog.classList.contains('open')){restore=document.activeElement;dialog.querySelector('button,input')?.focus();}else restore?.focus();}).observe(dialog,{attributes:true,attributeFilter:['class']});dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const items=[...dialog.querySelectorAll('button,input,a[href]')].filter(x=>x.offsetParent!==null);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});}
document.querySelector('#modal-x').setAttribute('aria-label','Закрыть');document.querySelector('.lb-close').setAttribute('aria-label','Закрыть фото');document.querySelector('.lb-prev').setAttribute('aria-label','Предыдущее фото');document.querySelector('.lb-next').setAttribute('aria-label','Следующее фото');
const portrait=document.querySelector('.hero-right');if(window.matchMedia('(hover:hover)').matches){portrait.addEventListener('pointermove',e=>{if(reduceMotion.matches)return;const r=portrait.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;portrait.querySelector('img').style.transform=`rotate(-2deg) rotateY(${x*5}deg) rotateX(${-y*3}deg)`;});portrait.addEventListener('pointerleave',()=>portrait.querySelector('img').style.transform='');}
// Keep keyboard focus within the active dialog, including its first Tab press.
for (const id of ['modal-ov','lb']) {
 const panel=document.getElementById(id);
 panel.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const focused=document.activeElement;
  const usable=[...panel.querySelectorAll('button,input,a[href]')].filter(x=>x.getClientRects().length);
  if(usable.length && (!panel.contains(focused)||focused===panel)) {e.preventDefault();usable[e.shiftKey?usable.length-1:0].focus();}
 });
}
// Hidden FAQ answers must be hidden from assistive navigation as well.
document.querySelectorAll('.faq-item').forEach(item=>{
 const answer=item.querySelector('.faq-ans');
 const sync=()=>{answer.setAttribute('aria-hidden',String(!item.classList.contains('is-open')));};
 sync();new MutationObserver(sync).observe(item,{attributes:true,attributeFilter:['class']});
});
// Labels make each gallery result identifiable before opening it.
document.querySelectorAll('.work-card').forEach(card=>{
 const caption=document.createElement('span');caption.className='work-treatment';
 caption.textContent=card.querySelector('img').alt.replace('До и после — ','');card.append(caption);
});
const galleryImage=document.getElementById('lb-img');
new MutationObserver(()=>{const file=galleryImage.getAttribute('src');const original=[...document.querySelectorAll('.work-card img')].find(img=>img.getAttribute('src')===file);galleryImage.alt=original?.alt||'Результат операции';}).observe(galleryImage,{attributes:true,attributeFilter:['src']});
// Preserve swipe scrolling without accidental opening after a drag.
let pointerStart=null;
const galleryTrack=document.querySelector('.works-scroll');
galleryTrack.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
galleryTrack.addEventListener('click',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8){e.preventDefault();e.stopImmediatePropagation();}pointerStart=null;},true);
// Reposition the existing portrait for a compact, recognisable mobile introduction.
const hero=document.querySelector('.hero');const heroLeft=hero.querySelector('.hero-left');
const mobileLayout=window.matchMedia('(max-width:640px)');
const arrangeHero=()=>{if(mobileLayout.matches)heroLeft.querySelector('.hero-h1').after(portrait);else hero.append(portrait);};
arrangeHero();mobileLayout.addEventListener('change',arrangeHero);
document.querySelectorAll('video').forEach(video=>{
 video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();}));
 video.addEventListener('error',()=>{if(video.parentElement.querySelector('.media-error'))return;const msg=document.createElement('p');msg.className='media-error';msg.textContent='Видео временно недоступно. Посмотрите фотографии результатов выше.';video.parentElement.append(msg);});
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('#nav-menu').classList.contains('open')){document.querySelector('#nav-menu').classList.remove('open');navButton.focus();}});

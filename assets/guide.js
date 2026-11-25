// Shared behaviour for guide pages: scroll reveal, copy buttons, typewriter, live UI demos.
document.documentElement.classList.add('js');

// Scroll reveal (also starts the hero fan)
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), {threshold: 0.15});
document.querySelectorAll('.rv, .fan').forEach(el => io.observe(el));

// Copy buttons: data-copy="#id" copies that element's text, or data-text copies the attribute
const toast = Object.assign(document.createElement('div'), {className: 'toast', role: 'status'});
document.body.append(toast);
let tt;
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
  const src = b.dataset.copy ? document.querySelector(b.dataset.copy) : b.closest('.say')?.querySelector('p');
  const text = (src?.dataset.full || src?.textContent || '').trim();
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = Object.assign(document.createElement('textarea'), {value: text}); document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  const label = b.querySelector('span'); const old = label.textContent;
  b.classList.add('done'); label.textContent = '복사됨';
  toast.textContent = '복사했어요. AI 채팅창에 붙여 넣으세요'; toast.classList.add('on');
  clearTimeout(tt); tt = setTimeout(() => { toast.classList.remove('on'); b.classList.remove('done'); label.textContent = old; }, 1800);
}));

// Typewriter for the big prompt (starts when visible, keeps full text for copying)
document.querySelectorAll('[data-type]').forEach(el => {
  const full = el.dataset.full = el.textContent.trim();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.textContent = '';
  const cur = Object.assign(document.createElement('span'), {className: 'cur'});
  const t = document.createTextNode(''); el.append(t, cur);
  new IntersectionObserver((es, o) => { if (!es[0].isIntersecting) return; o.disconnect();
    let i = 0; const step = () => { t.data = full.slice(0, ++i); if (i < full.length) setTimeout(step, 38); }; step();
  }, {threshold: 0.4}).observe(el);
});

// Hide the "눌러 보세요" hint after the first interaction inside a stage
document.querySelectorAll('.stage').forEach(s => s.addEventListener('pointerdown', () => s.querySelector('.hint')?.remove(), {once: true}));

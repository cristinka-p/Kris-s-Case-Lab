// Theme toggle
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.getElementById('themeToggle');
  if(btn){
    btn.addEventListener('click', ()=>{
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
    });
    if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');
  }
});

// Markdown loader helper
async function loadMD(path){
  try{
    const res = await fetch(path);
    if(!res.ok) throw new Error('Not found: '+path);
    const txt = await res.text();
    return marked.parse(txt);
  }catch(e){
    return `<pre>Ошибка загрузки: ${e.message}</pre>`;
  }
}

// Smooth scroll to element by id
function scrollToId(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

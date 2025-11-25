// projects.js
// Заполни массив projects данными: title, images[], description, caseLink (опционально)
const projects = [
  {
    id: 'proj-1',
    title: 'Пример проекта 1',
    images: ['assets/img/proj1-1.jpg','assets/img/proj1-2.jpg','assets/img/proj1-3.jpg'],
    description: 'Короткое описание проекта. Технологии: SLA, постобработка.',
    case: 'case.html?file=example.md'
  },
  // добавь свои проекты здесь
];

document.addEventListener('DOMContentLoaded', ()=>{
  // заполняем карусель (рандомизировано)
  const carousel = document.getElementById('carousel');
  const randomImgs = [];
  projects.forEach(p => p.images.forEach(img => randomImgs.push(img)));
  // shuffle
  for(let i=randomImgs.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [randomImgs[i], randomImgs[j]]=[randomImgs[j], randomImgs[i]];
  }
  randomImgs.forEach(src=>{
    const img = document.createElement('img');
    img.src = src;
    img.style.width='260px';
    img.style.height='160px';
    img.style.objectFit='cover';
    img.style.borderRadius='12px';
    carousel.appendChild(img);
  });

  // grid
  const grid = document.getElementById('projectsGrid');
  projects.forEach(p=>{
    const a = document.createElement('div');
    a.className = 'card';
    a.innerHTML = `<h3>${p.title}</h3>
      <div style="display:flex;gap:10px; overflow:auto; margin-top:10px;">
        ${p.images.map(s=>`<img src="${s}" style="height:90px; border-radius:8px; object-fit:cover;">`).join('')}
      </div>
      <p style="margin-top:12px">${p.description}</p>
      <div style="margin-top:10px">
        <button onclick="toggleProject('${p.id}')">Подробнее</button>
        ${p.case? `<a href="${p.case}" style="margin-left:10px">К кейсу</a>` : ''}
      </div>
      <div id="${p.id}" class="project-open" style="display:none; margin-top:12px;"></div>`;
    grid.appendChild(a);
  });
});

// раскрытие проекта
function toggleProject(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.style.display = el.style.display==='none' ? 'block' : 'none';
  if(el.style.display==='block' && !el.innerHTML){
    // можно подгрузить дополнительные данные сюда
    el.innerHTML = `<p>Детали проекта будут здесь. Можно вставить фото, описание, ссылку на кейс и материалы.</p>`;
  }
}

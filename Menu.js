function toggleMenu(){
  const nav = document.getElementById('mainNav');
  if(!nav) return;
  nav.classList.toggle('open');
}

// close menu on link click (mobile)
document.addEventListener('click', (e)=>{
  if(e.target.matches('#mainNav a')) {
    const nav=document.getElementById('mainNav');
    if(nav && nav.classList.contains('open')) nav.classList.remove('open');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.querySelector('.toggle-menu');
  const menu = document.querySelector('#main-nav ul');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
  });
});

(function(){
  /* === LANGUAGE TOGGLE === */
  window.toggleLang = function(){
    document.body.classList.toggle('en');
    var btn = document.querySelector('.lang-btn');
    if(btn) btn.textContent = document.body.classList.contains('en') ? 'FR' : 'EN';
  };

  /* === BURGER MENU === */
  var burger = document.querySelector('.burger');
  var navLinks = document.querySelector('.nav-links');
  if(burger && navLinks){
    burger.addEventListener('click', function(){
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ navLinks.classList.remove('open'); });
    });
  }

  /* === NAV SCROLL === */
  var nav = document.querySelector('.nav');
  if(nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* === ACTIVE NAV LINK === */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(a){
    var href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* === SMOOTH SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });

  /* === SCROLL REVEAL === */
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.opacity='1';
        entry.target.style.transform='translateY(0)';
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('section,.itin,.tarif,.extra,.avis,.spec,.contact-card').forEach(function(el){
    el.style.opacity='0';
    el.style.transform='translateY(30px)';
    el.style.transition='opacity .6s ease, transform .6s ease';
    obs.observe(el);
  });

  /* === FORM SUBMIT === */
  var form = document.getElementById('bookForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var fd = new FormData(form);
      var body = '';
      fd.forEach(function(v,k){ body += k+': '+v+'\n'; });
      var subject = encodeURIComponent('Réservation Prestige Charter');
      var mailBody = encodeURIComponent(body);
      window.location.href = 'mailto:contact@prestigecharter.fr?subject='+subject+'&body='+mailBody;
      form.reset();
    });
  }

  /* === SET MIN DATE === */
  var dateInput = document.querySelector('input[name="date"]');
  if(dateInput){
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
})();

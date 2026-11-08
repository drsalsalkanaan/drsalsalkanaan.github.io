(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var ids = panels.map(function (p) { return p.id; });
  var instaLoaded = false;

  function show(id, push) {
    if (ids.indexOf(id) === -1) id = ids[0];
    panels.forEach(function (p) { p.classList.toggle('active', p.id === id); });
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-tab') === id ? 'true' : 'false'); });
    if (push) history.replaceState(null, '', id === ids[0] ? location.pathname : '#' + id);
    if (id === 'media' && !instaLoaded && document.querySelector('.instagram-media')) {
      instaLoaded = true;
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    }
    var active = document.querySelector('.tab[aria-selected=true]');
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab],[data-goto]');
    if (t) {
      e.preventDefault();
      show(t.getAttribute('data-tab') || t.getAttribute('data-goto'), true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1), false); });
  show(location.hash.slice(1), false);

  // Publication filters
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      var k = f.getAttribute('data-filter');
      filters.forEach(function (x) { x.setAttribute('aria-pressed', x === f ? 'true' : 'false'); });
      document.querySelectorAll('.pub').forEach(function (p) {
        p.style.display = (k === 'all' || p.getAttribute('data-type') === k) ? '' : 'none';
      });
    });
  });

  // Facebook videos: load the player only when clicked
  document.querySelectorAll('.vposter').forEach(function (b) {
    b.addEventListener('click', function () {
      var href = encodeURIComponent(b.getAttribute('data-href'));
      var wrap = document.createElement('div'); wrap.className = 'vframe';
      wrap.innerHTML = '<iframe src="https://www.facebook.com/plugins/video.php?href=' + href +
        '&show_text=false&autoplay=true&width=400" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy" title="' + (b.getAttribute('aria-label') || 'video') + '"></iframe>';
      b.replaceWith(wrap);
    });
  });

  // Posts: show more
  var more = document.getElementById('more-posts');
  if (more) more.addEventListener('click', function () {
    document.querySelectorAll('.post.hidden').forEach(function (p) { p.classList.remove('hidden'); });
    more.remove();
  });

  // Lightbox
  var lb = document.getElementById('lightbox');
  if (lb && lb.showModal) {
    document.querySelectorAll('.gallery figure').forEach(function (f) {
      f.addEventListener('click', function () {
        var img = f.querySelector('img');
        lb.querySelector('img').src = img.src; lb.querySelector('img').alt = img.alt;
        lb.querySelector('p').textContent = f.querySelector('figcaption').textContent;
        lb.showModal();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') lb.close(); });
  }

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();

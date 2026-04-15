const page = document.body.dataset.page;

document.querySelectorAll('.site-nav a').forEach((link) => {
  if (link.getAttribute('href') === `${page}.html` || (page === 'home' && link.getAttribute('href') === 'index.html')) {
    link.classList.add('active');
  }
});

const transitionLinks = document.querySelectorAll('a[data-link]');

transitionLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = link.getAttribute('href');

    if (!target || target.startsWith('http') || target.startsWith('#')) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('is-exiting');

    window.setTimeout(() => {
      window.location.href = target;
    }, 360);
  });
});

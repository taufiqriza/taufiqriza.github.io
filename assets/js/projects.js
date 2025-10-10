/*
  projects.js
  - Holds a small list of finished projects and renders them into the #portfolio-list element.
  - Each project has id, title, category, short, image, tags, tech, date, url (optional), and details.
*/
(function() {
  'use strict'

  const projects = [
    {
      id: 'repo-unida-repository',
      title: 'Institutional Repository (REPO UNIDA)',
      category: 'Web',
      short: 'Repository institusi untuk publikasi ilmiah, built with Laravel + MySQL.',
      image: 'assets/img/portfolio/portfolio-1.jpg',
      tech: ['Laravel', 'MySQL', 'Bootstrap'],
      date: '2023-08-01',
      url: null,
      details: 'Merancang dan mengimplementasikan sistem repository institusi (publikasi, metadata, otentikasi, dan admin panel). Fokus pada ketersediaan data, backup, dan akses terbuka.'
    },
    {
      id: 'perpus-sisinfo',
      title: 'Sistem Informasi Perpustakaan',
      category: 'Web',
      short: 'Sistem untuk manajemen katalog, peminjaman, dan laporan perpustakaan.',
      image: 'assets/img/portfolio/portfolio-2.jpg',
      tech: ['PHP', 'jQuery', 'Bootstrap'],
      date: '2022-05-15',
      url: null,
      details: 'Mengembangkan modul peminjaman, notifikasi keterlambatan, dan laporan statistik penggunaan. Meningkatkan effisiensi sirkulasi koleksi.'
    },
    {
      id: 'mobile-attendance',
      title: 'Mobile Attendance (Prototype)',
      category: 'App',
      short: 'Prototype aplikasi mobile untuk absensi berbasis lokasi.',
      image: 'assets/img/portfolio/portfolio-6.jpg',
      tech: ['Flutter', 'Firebase'],
      date: '2021-11-20',
      url: null,
      details: 'Penerapan prototipe dengan autentikasi, geofencing sederhana, dan laporan harian. Fokus pada UX sederhana untuk pengguna non-teknis.'
    },
    {
      id: 'design-gontor-tv',
      title: 'Gontor TV - Desain Materi',
      category: 'Design',
      short: 'Materi desain grafis untuk kanal kampus (thumbnail, poster, dan banner).',
      image: 'assets/img/portfolio/portfolio-7.jpg',
      tech: ['Figma', 'Photoshop'],
      date: '2020-09-10',
      url: null,
      details: 'Kolaborasi dengan tim media untuk menghasilkan materi visual bernilai editorial, menjaga konsistensi brand dan aksesibilitas visual.'
    }
  ];

  function createProjectCard(p) {
    const col = document.createElement('div')
    col.className = 'col-lg-4 col-md-6 portfolio-item filter-' + p.category.toLowerCase();

    col.innerHTML = `
      <div class="portfolio-wrap">
        <img src="${p.image}" class="img-fluid" alt="${p.title}">
        <div class="portfolio-info">
          <h4>${p.title}</h4>
          <p>${p.category}</p>
          <div class="portfolio-links">
            <a href="${p.image}" data-gallery="portfolioGallery" class="portfolio-lightbox" title="${p.title}"><i class="bx bx-plus"></i></a>
            <a href="portfolio-details.html?id=${encodeURIComponent(p.id)}" class="portfolio-details-lightbox" data-glightbox="type: external" title="Portfolio Details"><i class="bx bx-link"></i></a>
          </div>
        </div>
      </div>
    `

    return col
  }

  function renderProjects() {
    const list = document.getElementById('portfolio-list')
    if (!list) return
    projects.forEach(p => {
      list.appendChild(createProjectCard(p))
    })
  }

  // Expose for detail page lookup
  window.__MY_PROJECTS = {
    list: projects,
    findById: (id) => projects.find(p => p.id === id)
  }

  document.addEventListener('DOMContentLoaded', renderProjects)

})();

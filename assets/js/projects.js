/*
  projects.js
  - Loads projects from data/projects.json and renders them into the portfolio
  - Implements filtering by technology stack
  - Supports modal detail view with comprehensive project information
*/
(function() {
  'use strict'

  let allProjects = [];
  let currentFilter = '*';

  // Load projects data from JSON
  async function loadProjectsData() {
    try {
      const response = await fetch('./data/projects.json');
      const data = await response.json();
      allProjects = data.projects;
      return data;
    } catch (error) {
      console.error('Error loading projects data:', error);
      // Fallback to embedded data if JSON fails to load
      return getFallbackProjects();
    }
  }

  // Fallback projects data
  function getFallbackProjects() {
    return {
      projects: [
        {
          id: 'repo-unida-repository',
          title: 'Institutional Repository (REPO UNIDA)',
          short: 'Repository institusi untuk publikasi ilmiah, built with Laravel + MySQL.',
          image: 'assets/img/portfolio/portfolio-1.jpg',
          tech: ['Laravel', 'MySQL', 'Bootstrap'],
          stack: 'laravel',
          date: '2023-08-01',
          role: 'Full Stack Developer',
          impact: { kpi: '15,000+ publikasi' }
        },
        {
          id: 'perpus-sisinfo',
          title: 'Sistem Informasi Perpustakaan',
          short: 'Sistem untuk manajemen katalog, peminjaman, dan laporan perpustakaan.',
          image: 'assets/img/portfolio/portfolio-2.jpg',
          tech: ['PHP', 'jQuery', 'Bootstrap'],
          stack: 'php',
          date: '2022-05-15',
          role: 'Web Developer',
          impact: { kpi: 'Efficiency improved by 40%' }
        }
      ]
    };
  }

  function createProjectCard(p) {
    const col = document.createElement('div');
    const filterClass = p.stack ? `filter-${p.stack}` : 'filter-default';
    col.className = `col-lg-4 col-md-6 portfolio-item ${filterClass}`;
    col.setAttribute('data-project-id', p.id);

    // Get icon based on project category or stack
    const projectIcon = getProjectIcon(p.stack, p.category);
    const stackIcon = getStackIcon(p.stack);

    const techTags = p.tech ? p.tech.map(tech =>
      `<span class="tech-tag">${tech}</span>`
    ).join('') : '';

    const impactKpi = p.impact && p.impact.kpi ?
      `<div class="project-kpi"><i class="fas fa-chart-line"></i> ${p.impact.kpi}</div>` : '';

    col.innerHTML = `
      <div class="portfolio-wrap modern-card">
        <div class="portfolio-header-icon">
          <i class="${projectIcon}"></i>
          <span class="stack-badge">
            <i class="${stackIcon}"></i> ${p.stack ? p.stack.toUpperCase() : 'WEB'}
          </span>
        </div>

        <div class="portfolio-content">
          <div class="portfolio-info">
            <h3 class="portfolio-title">${p.title}</h3>
            <p class="portfolio-short">${p.short}</p>
          </div>

          ${techTags ? `<div class="tech-tags">${techTags}</div>` : ''}

          ${impactKpi}

          <div class="portfolio-meta">
            <span class="project-role">
              <i class="fas fa-user-tie"></i> ${p.role || 'Developer'}
            </span>
            <span class="project-date">
              <i class="fas fa-calendar-alt"></i> ${formatDate(p.date)}
            </span>
          </div>

          <div class="portfolio-actions">
            <button class="btn btn-modern-primary btn-sm"
                    onclick="window.projectModal.show('${p.id}')"
                    aria-label="View ${p.title} details">
              <i class="fas fa-info-circle"></i> Details
            </button>

            ${p.url ? `<a href="${p.url}" class="btn btn-modern-demo btn-sm" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-external-link-alt"></i> Live Demo
            </a>` : ''}

            ${p.github ? `<a href="${p.github}" class="btn btn-modern-code btn-sm" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i> Code
            </a>` : ''}
          </div>
        </div>
      </div>
    `;

    return col;
  }

  // Get project icon based on category or stack
  function getProjectIcon(stack, category) {
    const iconMap = {
      // Laravel
      laravel: 'fab fa-laravel',

      // Next.js
      nextjs: 'fas fa-cube',

      // MERN
      mern: 'fab fa-react',

      // Go
      go: 'fab fa-golang',

      // Java
      java: 'fab fa-java',

      // Kotlin
      kotlin: 'fab fa-android',

      // PHP
      php: 'fab fa-php',

      // JavaScript/React
      javascript: 'fab fa-js-square',
      react: 'fab fa-react',

      // Default icons for other stacks
      default: 'fas fa-laptop-code',
      web: 'fas fa-globe',
      mobile: 'fas fa-mobile-alt',
      api: 'fas fa-plug',
      system: 'fas fa-server',
      database: 'fas fa-database',
      education: 'fas fa-graduation-cap',
      ecommerce: 'fas fa-shopping-cart',
      finance: 'fas fa-coins',
      management: 'fas fa-tasks',
      library: 'fas fa-book',
      corporate: 'fas fa-building'
    };

    // Try to find icon by stack first, then by category
    const stackLower = stack ? stack.toLowerCase() : '';
    const categoryLower = category ? category.toLowerCase() : '';

    return iconMap[stackLower] || iconMap[categoryLower] || iconMap.default;
  }

  // Get stack icon
  function getStackIcon(stack) {
    const stackIconMap = {
      laravel: 'fab fa-laravel',
      nextjs: 'fas fa-cube',
      mern: 'fab fa-react',
      go: 'fab fa-golang',
      java: 'fab fa-java',
      kotlin: 'fab fa-android',
      php: 'fab fa-php',
      javascript: 'fab fa-js'
    };

    return stackIconMap[stack] || 'fas fa-code';
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }

  function renderProjects(filter = '*') {
    const list = document.getElementById('portfolio-list');
    if (!list || allProjects.length === 0) return;

    // Clear existing projects
    list.innerHTML = '';

    // Filter projects
    const filteredProjects = filter === '*'
      ? allProjects
      : allProjects.filter(p => p.stack && p.stack === filter.replace('.', ''));

    // Render filtered projects
    if (filteredProjects.length === 0) {
      list.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bx bx-search" style="font-size: 3rem; color: var(--color-text-muted);"></i>
          <h4 class="mt-3">No projects found</h4>
          <p class="text-muted">Try selecting a different technology stack.</p>
        </div>
      `;
      return;
    }

    filteredProjects.forEach(project => {
      list.appendChild(createProjectCard(project));
    });
  }

  function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('#portfolio-flters .filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        // Update active state
        filterButtons.forEach(btn => {
          btn.classList.remove('filter-active');
          btn.setAttribute('aria-selected', 'false');
        });

        this.classList.add('filter-active');
        this.setAttribute('aria-selected', 'true');

        // Apply filter
        const filter = this.getAttribute('data-filter');
        currentFilter = filter;
        renderProjects(filter);
      });
    });
  }

  // Initialize projects on DOM content loaded
  async function initProjects() {
    try {
      const data = await loadProjectsData();
      allProjects = data.projects;

      // Set up filter buttons
      setupFilterButtons();

      // Render initial projects
      renderProjects('*');

      // Expose for detail page lookup
      window.__MY_PROJECTS = {
        list: allProjects,
        findById: (id) => allProjects.find(p => p.id === id)
      };

      console.log(`Loaded ${allProjects.length} projects`);
    } catch (error) {
      console.error('Error initializing projects:', error);
    }
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjects);
  } else {
    initProjects();
  }

})();

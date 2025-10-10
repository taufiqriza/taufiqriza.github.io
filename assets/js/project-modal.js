/*
  project-modal.js
  - Modal system for detailed project view
  - Supports keyboard navigation and accessibility
  - Loads project data from window.__MY_PROJECTS
*/
(function() {
  'use strict';

  let currentProject = null;
  let modalElement = null;
  let isModalOpen = false;

  // Create modal HTML structure
  function createModalElement() {
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'project-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
      <div class="modal-backdrop" onclick="window.projectModal.hide()"></div>
      <div class="modal-content" role="document">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title"></h2>
          <button type="button"
                  class="modal-close"
                  onclick="window.projectModal.hide()"
                  aria-label="Close modal">
            <i class="bx bx-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-icon-container">
            <div class="modal-icon">
              <i id="modal-icon" class=""></i>
            </div>
            <div class="modal-stack-badge">
              <i id="modal-stack-icon" class=""></i>
              <span id="modal-stack-name"></span>
            </div>
          </div>

          <div class="modal-info">
            <div class="project-description">
              <h3>Description</h3>
              <p id="modal-description"></p>
            </div>

            <div class="project-highlights">
              <h3>Key Features & Highlights</h3>
              <ul id="modal-highlights"></ul>
            </div>

            <div class="project-tech-stack">
              <h3>Technology Stack</h3>
              <div id="modal-tech" class="tech-tags"></div>
            </div>

            <div class="project-impact">
              <h3>Impact & Results</h3>
              <div id="modal-impact" class="impact-metrics"></div>
            </div>

            <div class="project-meta-info">
              <div class="meta-item">
                <span class="meta-label">Role:</span>
                <span id="modal-role"></span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Category:</span>
                <span id="modal-category"></span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Date:</span>
                <span id="modal-date"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button"
                  class="btn btn-outline-primary"
                  onclick="window.projectModal.hide()">
            Close
          </button>

          <div class="modal-actions">
            <a id="modal-demo-link"
               href="#"
               class="btn btn-primary"
               target="_blank"
               rel="noopener noreferrer"
               style="display: none;">
              <i class="bx bx-link-external"></i> Live Demo
            </a>

            <a id="modal-github-link"
               href="#"
               class="btn btn-outline-secondary"
               target="_blank"
               rel="noopener noreferrer"
               style="display: none;">
              <i class="bx bxl-github"></i> View Code
            </a>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Initialize modal
  function initModal() {
    if (modalElement) return;

    modalElement = createModalElement();
    document.body.appendChild(modalElement);

    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyDown);
  }

  // Keyboard navigation
  function handleKeyDown(event) {
    if (!isModalOpen) return;

    switch (event.key) {
      case 'Escape':
        hide();
        event.preventDefault();
        break;
      case 'Tab':
        // Trap focus within modal
        trapFocus(event);
        break;
    }
  }

  // Focus trapping for accessibility
  function trapFocus(event) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }

  // Load and display project data
  function loadProjectData(projectId) {
    if (!window.__MY_PROJECTS || !window.__MY_PROJECTS.findById) {
      console.error('Projects data not loaded');
      return null;
    }

    const project = window.__MY_PROJECTS.findById(projectId);
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return null;
    }

    currentProject = project;
    populateModalContent(project);
    return project;
  }

  // Populate modal with project data
  function populateModalContent(project) {
    // Get icons based on project stack and category
    const projectIcon = getProjectIcon(project.stack, project.category);
    const stackIcon = getStackIcon(project.stack);

    // Basic info
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.description || project.short;

    // Set icons instead of image
    document.getElementById('modal-icon').className = projectIcon;
    document.getElementById('modal-stack-icon').className = stackIcon;
    document.getElementById('modal-stack-name').textContent = project.stack ? project.stack.toUpperCase() : 'WEB';

    document.getElementById('modal-role').textContent = project.role || 'Developer';
    document.getElementById('modal-category').textContent = project.category || 'Web Development';
    document.getElementById('modal-date').textContent = formatDate(project.date);

    // Highlights
    const highlightsContainer = document.getElementById('modal-highlights');
    if (project.highlights && project.highlights.length > 0) {
      highlightsContainer.innerHTML = project.highlights
        .map(highlight => `<li>${highlight}</li>`)
        .join('');
    } else {
      highlightsContainer.parentElement.style.display = 'none';
    }

    // Tech stack
    const techContainer = document.getElementById('modal-tech');
    if (project.tech && project.tech.length > 0) {
      techContainer.innerHTML = project.tech
        .map(tech => `<span class="tech-tag">${tech}</span>`)
        .join('');
    } else {
      techContainer.parentElement.style.display = 'none';
    }

    // Impact metrics
    const impactContainer = document.getElementById('modal-impact');
    if (project.impact) {
      const impactHtml = Object.entries(project.impact)
        .map(([key, value]) => `
          <div class="impact-metric">
            <div class="metric-value">${value}</div>
            <div class="metric-label">${formatMetricLabel(key)}</div>
          </div>
        `)
        .join('');
      impactContainer.innerHTML = impactHtml;
    } else {
      impactContainer.parentElement.style.display = 'none';
    }

    // Action buttons
    const demoLink = document.getElementById('modal-demo-link');
    const githubLink = document.getElementById('modal-github-link');

    if (project.url) {
      demoLink.href = project.url;
      demoLink.style.display = 'inline-flex';
    } else {
      demoLink.style.display = 'none';
    }

    if (project.github) {
      githubLink.href = project.github;
      githubLink.style.display = 'inline-flex';
    } else {
      githubLink.style.display = 'none';
    }
  }

  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format metric labels
  function formatMetricLabel(key) {
    const labels = {
      kpi: 'Key Performance Indicator',
      users: 'Active Users',
      performance: 'Performance',
      conversion: 'Conversion Rate',
      productivity: 'Productivity Gain',
      collaboration: 'Daily Interactions',
      latency: 'Response Time',
      reliability: 'Uptime',
      transactions: 'Transactions Processed',
      compliance: 'Compliance Rate',
      efficiency: 'Efficiency Improvement',
      satisfaction: 'User Rating'
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  // Show modal
  function show(projectId) {
    if (!modalElement) {
      initModal();
    }

    const project = loadProjectData(projectId);
    if (!project) return;

    // Show modal
    modalElement.setAttribute('aria-hidden', 'false');
    modalElement.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    isModalOpen = true;

    // Focus management
    const closeButton = modalElement.querySelector('.modal-close');
    if (closeButton) {
      setTimeout(() => closeButton.focus(), 100);
    }
  }

  // Hide modal
  function hide() {
    if (!modalElement || !isModalOpen) return;

    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.classList.remove('modal-open');
    document.body.style.overflow = '';
    isModalOpen = false;
    currentProject = null;

    // Return focus to triggering element if available
    const projectElement = document.querySelector(`[data-project-id="${currentProject?.id}"]`);
    if (projectElement) {
      const detailsButton = projectElement.querySelector('[onclick*="projectModal.show"]');
      if (detailsButton) {
        detailsButton.focus();
      }
    }
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

  // Public API
  window.projectModal = {
    show: show,
    hide: hide,
    isOpen: () => isModalOpen,
    getCurrentProject: () => currentProject
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initModal();
  });

})();
/*
  project-detail.js
  - Reads ?id=<project-id> from the URL and populates elements in portfolio-details.html
  - Depends on assets/js/projects.js exposing window.__MY_PROJECTS
*/
(function(){
  'use strict'

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search)
    return params.get(name)
  }

  function renderDetail(project) {
    if (!project) return

    // Title & description
    const titleEl = document.querySelector('.portfolio-description h2')
    const descEl = document.querySelector('.portfolio-description p')
    if (titleEl) titleEl.textContent = project.title
    if (descEl) descEl.textContent = project.details

    // Info list
    const infoList = document.querySelector('.portfolio-info ul')
    if (infoList) {
      infoList.innerHTML = `
        <li><strong>Category</strong>: ${project.category}</li>
        <li><strong>Technologies</strong>: ${project.tech.join(', ')}</li>
        <li><strong>Project date</strong>: ${project.date}</li>
      `
    }

    // Slider images - replace existing slides with the project's image plus a fallback
    const sliderWrapper = document.querySelector('.portfolio-details-slider .swiper-wrapper')
    if (sliderWrapper) {
      sliderWrapper.innerHTML = ''
      const img = document.createElement('div')
      img.className = 'swiper-slide'
      img.innerHTML = `<img src="${project.image}" alt="${project.title}">`
      sliderWrapper.appendChild(img)
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    const id = getQueryParam('id')
    if (!id) return
    // Wait for projects to be available
    const tryRender = () => {
      if (window.__MY_PROJECTS && typeof window.__MY_PROJECTS.findById === 'function') {
        const p = window.__MY_PROJECTS.findById(id)
        renderDetail(p)
      } else {
        // retry shortly
        setTimeout(tryRender, 150)
      }
    }
    tryRender()
  })

})();

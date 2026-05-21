(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const els = {
    grid: $('#category-grid'),
    total: $('#project-total'),
    detail: $('#project-detail-content'),
    aboutModal: $('#about-modal'),
    projectModal: $('#project-modal'),
    aboutLink: $('[data-open-modal="about"]')
  };

  let projects = [];
  let lastFocusedElement = null;

  const text = (value, fallback = 'Not available') => (
    value === null || value === undefined || value === '' ? fallback : String(value)
  );

  const escapeHtml = value => text(value, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const isSafeUrl = value => {
    if (!value) return false;

    try {
      return ['https:', 'mailto:'].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };

  const setModalState = (modal, isOpen) => {
    if (!modal) return;

    modal.classList.toggle('is-open', isOpen);
    modal.setAttribute('aria-hidden', String(!isOpen));
  };

  const openModal = modal => {
    if (!modal) return;

    lastFocusedElement = document.activeElement;
    setModalState(modal, true);
    document.body.style.overflow = 'hidden';
    $('[data-close-modal]', modal)?.focus();
  };

  const closeModals = event => {
    event?.preventDefault();

    $$('.modal.is-open').forEach(modal => setModalState(modal, false));

    document.body.style.overflow = '';
    lastFocusedElement?.focus?.();
  };

  const projectActions = project => {
    const links = [
      ['project_url', 'fa-solid fa-up-right-from-square', 'Open Project'],
      ['github_url', 'fa-brands fa-github', 'GitHub']
    ]
      .filter(([key]) => isSafeUrl(project[key]))
      .map(([key, icon, label]) => `
        <a href="${escapeHtml(project[key])}" target="_blank" rel="noopener noreferrer">
          <i class="${icon}" aria-hidden="true"></i> ${label}
        </a>
      `);

    return links.length ? `<div class="project-actions">${links.join('')}</div>` : '';
  };

  const groupProjects = items => items.reduce((groups, project, index) => {
    const category = text(project.category, 'Other');

    groups[category] ??= [];
    groups[category].push({ project, index });

    return groups;
  }, {});

  const renderProjectDetails = project => {
    els.detail.innerHTML = `
      <h4>
        <i class="fa-solid fa-cube" aria-hidden="true"></i>
        ${escapeHtml(text(project.project_name, 'Unnamed project'))}
      </h4>

      <p>
        <strong>Category:</strong>
        ${escapeHtml(text(project.category, 'Other'))}
      </p>

      <p>
        <strong>Description:</strong>
        ${escapeHtml(text(project.short_description))}
      </p>

      ${projectActions(project)}
    `;

    openModal(els.projectModal);
  };

  const renderCategories = items => Object.entries(groupProjects(items)).map(([category, group]) => `
    <section class="category-card" aria-label="${escapeHtml(category)} projects">
      <div class="window-head">
        <span class="window-title-link">
          <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
          ${escapeHtml(category)}
        </span>

        <span class="window-open">
          <i class="fa-solid fa-hashtag" aria-hidden="true"></i>
          ${group.length}
        </span>
      </div>

      <ul class="project-links">
        ${group.map(({ project, index }) => `
          <li>
            <a
              class="project-link"
              href="#project-modal"
              data-project-id="${index}"
              aria-label="Open details for ${escapeHtml(text(project.project_name, 'Unnamed project'))}"
            >
              <i class="fa-solid fa-link" aria-hidden="true"></i>
              ${escapeHtml(text(project.project_name, 'Unnamed project'))}
            </a>
          </li>
        `).join('')}
      </ul>
    </section>
  `).join('');

  const renderOverview = items => {
    els.total.textContent = `${items.length} projects`;

    els.grid.innerHTML = items.length
      ? renderCategories(items)
      : `
        <div class="load-error">
          <i class="fa-solid fa-box-open" aria-hidden="true"></i>
          <span>No projects available.</span>
        </div>
      `;
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('static/projects.json', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Unable to load static/projects.json');
      }

      const data = await response.json();

      projects = Array.isArray(data.projects) ? data.projects : [];

      renderOverview(projects);
    } catch (error) {
      projects = [];

      els.total.textContent = 'Unable to load projects';

      els.grid.innerHTML = `
        <div class="load-error">
          <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <span>Unable to load project data. Please check static/projects.json.</span>
        </div>
      `;

      console.error(error);
    }
  };

  els.aboutLink?.addEventListener('click', event => {
    event.preventDefault();
    openModal(els.aboutModal);
  });

  els.grid?.addEventListener('click', event => {
    const link = event.target.closest('[data-project-id]');

    if (!link) return;

    event.preventDefault();

    const project = projects[Number(link.dataset.projectId)];

    if (project) {
      renderProjectDetails(project);
    }
  });

  $$('[data-close-modal]').forEach(button => {
    button.addEventListener('click', closeModals);
  });

  $$('.modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModals(event);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModals(event);
    }
  });

  loadProjects();
})();
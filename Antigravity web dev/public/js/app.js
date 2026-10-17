/**
 * COLLEGE YATRI - MAIN APPLICATION LOGIC
 * Manages theme toggling, 3D tilt physics, project filtering,
 * modal dialogs, fullstack API integration, and animated counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME ENGINE (Dark, Light, Cyber)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themes = ['dark', 'light', 'cyber'];

  // Retrieve saved theme or default to dark
  let currentTheme = localStorage.getItem('college_yatri_theme') || 'dark';
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      currentTheme = themes[nextIndex];
      applyTheme(currentTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('college_yatri_theme', theme);

    // Update icon & label
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
      } else if (theme === 'cyber') {
        themeIcon.className = 'fas fa-terminal';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }

    // Synchronize 3D Three.js scene colors if engine loaded
    if (typeof window.update3DTheme === 'function') {
      window.update3DTheme(theme);
    }
  }

  // ==========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // ==========================================================================
  // 3. PROJECTS SHOWCASE & DYNAMIC FILTERING
  // ==========================================================================
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Fallback project data in case server API is offline or opened via file://
  const fallbackProjects = [
    {
      id: "project-1",
      title: "CampusConnect: Academic Collab Hub",
      category: "fullstack",
      tagline: "Realtime peer-to-peer study rooms, notes repository & course forum.",
      tech: ["Next.js", "Node.js", "Socket.io", "PostgreSQL", "TailwindCSS"],
      badge: "Fullstack • Featured",
      highlights: ["Sub-50ms realtime chat synchronization", "Over 1,200 peer-uploaded resources"]
    },
    {
      id: "project-2",
      title: "YatriSense: AI Student Copilot",
      category: "ai",
      tagline: "Automated lecture summarizer, flashcard generator & smart revision schedule.",
      tech: ["Python", "FastAPI", "LangChain", "OpenAI API", "ChromaDB"],
      badge: "AI / ML • Hackathon Winner",
      highlights: ["Won 1st Place at Inter-College Hackathon", "RAG pipeline over 300+ pages of textbooks"]
    },
    {
      id: "project-3",
      title: "PolyVerse 3D: Virtual Campus Tour",
      category: "3d",
      tagline: "Interactive WebGL 3D architectural exploration of university landmarks.",
      tech: ["Three.js", "WebGL", "GSAP", "JavaScript (ES6+)"],
      badge: "3D WebGL • Interactive",
      highlights: ["60 FPS smooth rendering on mobile/desktop", "Interactive 3D audio guide hotspots"]
    },
    {
      id: "project-4",
      title: "DevSprint: Cloud Code Playground",
      category: "fullstack",
      tagline: "Sandboxed browser IDE supporting multiple languages with instant execution.",
      tech: ["React", "Express", "Docker", "Redis", "Monaco"],
      badge: "Systems • Cloud",
      highlights: ["Isolated container execution per session", "Monaco editor with IntelliSense"]
    },
    {
      id: "project-5",
      title: "HostelCart: Campus Marketplace",
      category: "fullstack",
      tagline: "Verified peer-to-peer buy, sell & rent platform exclusively for hostel residents.",
      tech: ["React Native", "Node.js", "MongoDB", "Express"],
      badge: "Mobile • Fullstack",
      highlights: ["500+ active student registrations", "Campus OTP verification"]
    },
    {
      id: "project-6",
      title: "AlgoVisualizer 3D",
      category: "3d",
      tagline: "Step-by-step spatial 3D visualization of Graph, Tree, and Sorting algorithms.",
      tech: ["Three.js", "HTML5 Canvas", "TailwindCSS", "TypeScript"],
      badge: "3D • DSA Visualizer",
      highlights: ["3D dynamic node camera rotation", "Used by 200+ batchmates"]
    }
  ];

  let loadedProjects = [];

  async function loadProjects() {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        loadedProjects = await response.json();
      } else {
        loadedProjects = fallbackProjects;
      }
    } catch (e) {
      // Offline / Local file protocol fallback
      loadedProjects = fallbackProjects;
    }
    renderProjects(loadedProjects, 'all');
  }

  function renderProjects(projects, filter = 'all') {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? projects 
      : projects.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'tilt-card';
      card.setAttribute('data-category', project.category);

      const techTags = project.tech
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <div class="card-glare"></div>
        <div class="card-top">
          <span class="card-badge">${project.badge}</span>
          <h3 class="card-title">${project.title}</h3>
          <p class="card-desc">${project.tagline}</p>
        </div>
        <div class="card-tech-stack">
          ${techTags}
        </div>
        <div class="card-footer">
          <div class="card-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="card-link-btn" title="Source Code">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="card-link-btn" title="Live Preview">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
          <button class="btn btn-secondary btn-sm preview-project-btn" data-id="${project.id}">
            Details <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;

      projectsGrid.appendChild(card);
      attachTiltPhysics(card);
    });

    // Attach modal preview listeners
    document.querySelectorAll('.preview-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        const proj = loadedProjects.find(p => p.id === id);
        if (proj) openProjectModal(proj);
      });
    });
  }

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(loadedProjects, category);
    });
  });

  loadProjects();

  // ==========================================================================
  // 4. 3D CARD TILT & GLARE PHYSICS
  // ==========================================================================
  function attachTiltPhysics(card) {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt angle: 12 degrees
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22), transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.25s ease, border-color 0.25s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // Snappy response during hover
    });
  }

  // ==========================================================================
  // 5. RESUME & PROJECT MODAL CONTROLS
  // ==========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const projectModal = document.getElementById('project-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openResumeBtn) {
    openResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  }

  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(resumeModal);
    });
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(resumeModal);
      closeModal(projectModal);
    });
  });

  // Close on backdrop click
  [resumeModal, projectModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(resumeModal);
      closeModal(projectModal);
    }
  });

  // Dynamic Project Modal Info
  function openProjectModal(project) {
    const titleEl = document.getElementById('modal-project-title');
    const badgeEl = document.getElementById('modal-project-badge');
    const descEl = document.getElementById('modal-project-desc');
    const techEl = document.getElementById('modal-project-tech');
    const highlightsEl = document.getElementById('modal-project-highlights');

    if (titleEl) titleEl.textContent = project.title;
    if (badgeEl) badgeEl.textContent = project.badge;
    if (descEl) descEl.textContent = project.description || project.tagline;

    if (techEl) {
      techEl.innerHTML = project.tech
        .map(t => `<span class="skill-pill font-mono">${t}</span>`)
        .join('');
    }

    if (highlightsEl && project.highlights) {
      highlightsEl.innerHTML = project.highlights
        .map(h => `<li><i class="fas fa-check-circle" style="color: var(--accent-cyan); margin-right: 0.5rem;"></i>${h}</li>`)
        .join('');
    }

    openModal(projectModal);
  }

  // ==========================================================================
  // 6. FULLSTACK CONTACT FORM INTEGRATION
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const role = document.getElementById('contact-role').value;
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Visual sending state
      const originalBtnText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Transmitting...`;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, role, subject, message })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showToast(`Success! Message logged for College Yatri.`, 'success');
          contactForm.reset();
        } else {
          showToast(result.error || 'Failed to deliver message.', 'error');
        }
      } catch (err) {
        // Fallback for static browser / offline demo: store in localStorage
        const offlineLogs = JSON.parse(localStorage.getItem('college_yatri_messages') || '[]');
        offlineLogs.unshift({ name, email, role, subject, message, date: new Date().toISOString() });
        localStorage.setItem('college_yatri_messages', JSON.stringify(offlineLogs));

        showToast(`Offline mode: Message stored locally in your browser!`, 'success');
        contactForm.reset();
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // ==========================================================================
  // 7. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // ==========================================================================
  // 8. ANIMATED NUMBER COUNTERS (INTERSECTION OBSERVER)
  // ==========================================================================
  const counterElements = document.querySelectorAll('.counter-val');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }
});


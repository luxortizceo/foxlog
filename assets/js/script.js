// Mobile nav toggle
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Any in-page link (nav, buttons, footer, etc.) closes the mobile menu
// before the browser jumps to its target section.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Hero: scroll-scrubbed fox-logo reveal (image-sequence on canvas).
// Scrolling through the tall #inicio wrapper scrubs a 145-frame render of the
// logo rotating in 3D, instead of just autoplaying a video.
(() => {
  const pin = document.getElementById('inicio');
  const canvas = document.getElementById('hero-canvas');
  if (!pin || !canvas) return;

  const ctx = canvas.getContext('2d');
  const FRAME_COUNT = 48;
  const framePath = (n) => `assets/img/hero-frames/frame-${String(n).padStart(3, '0')}.webp`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const frames = [];
  let loadedCount = 0;
  let currentFrame = -1;

  function drawFrame(index) {
    const img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0 || index === currentFrame) return;
    currentFrame = index;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  if (reduceMotion) {
    // Respect the user's preference: show one representative frame, no scrubbing.
    const still = new Image();
    still.onload = () => ctx.drawImage(still, 0, 0, canvas.width, canvas.height);
    still.src = framePath(6);
    return;
  }

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const img = new Image();
    img.onload = () => {
      loadedCount++;
      if (i === 1) drawFrame(0);
    };
    img.src = framePath(i);
    frames.push(img);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = pin.getBoundingClientRect();
      const scrollable = pin.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      const index = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
      drawFrame(index);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// CTA background video: autoplay only while the section is actually on
// screen, and skip it entirely if the visitor prefers reduced motion.
(() => {
  const video = document.getElementById('cta-video');
  const section = document.getElementById('contacto');
  if (!video || !section) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.15 });
    observer.observe(section);
  } else {
    video.play().catch(() => {});
  }
})();

// Animated stat counters
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('es-ES')) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && statNumbers.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => observer.observe(el));
} else {
  statNumbers.forEach((el) => {
    el.textContent = el.dataset.target + (el.dataset.suffix || '');
  });
}

// Quote modal: the CTA is a single floating button that opens a dialog
// with the request form and a short explainer of what to include.
const quoteModal = document.getElementById('quote-modal');
const quoteOpen = document.getElementById('quote-open');
const quoteClose = document.getElementById('quote-close');

function openQuoteModal() {
  quoteModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuoteModal() {
  quoteModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (quoteModal && quoteOpen && quoteClose) {
  quoteOpen.addEventListener('click', openQuoteModal);
  quoteClose.addEventListener('click', closeQuoteModal);
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal.classList.contains('open')) closeQuoteModal();
  });

  // Header "Cotizar envío" opens the same modal directly instead of
  // just scrolling to the CTA section.
  const headerQuoteBtn = document.getElementById('header-quote-btn');
  if (headerQuoteBtn) {
    headerQuoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuoteModal();
    });
  }
}

// Service cards: clicking one opens a shared modal with the fuller
// description instead of cramming everything onto the card.
const SERVICE_INFO = {
  terrestre: {
    icon: '🚛',
    title: 'Transporte terrestre',
    desc: 'Expertos en arrastre de contenedores de los principales puertos y fletes nacionales en las principales zonas industriales del país. Importaciones y exportaciones a Estados Unidos.',
  },
  aereo: {
    icon: '✈️',
    title: 'Transporte aéreo',
    desc: 'Para carga urgente o sensible al tiempo: tránsitos de 24 a 72 horas hacia los principales hubs aéreos del mundo, con seguimiento en tiempo real desde el despegue hasta la entrega.',
  },
  maritimo: {
    icon: '🚢',
    title: 'Transporte marítimo',
    desc: 'Operamos directamente en los puertos de Altamira, Veracruz, Manzanillo y Lázaro Cárdenas. Carga FCL y LCL con las navieras más confiables del mercado, ideal para grandes volúmenes.',
  },
  ferroviario: {
    icon: '🚆',
    title: 'Carga contenerizada',
    desc: 'Realizamos el arrastre de contenedores marítimos a nivel nacional para importaciones y exportaciones.',
  },
};

const serviceModal = document.getElementById('service-modal');
const serviceClose = document.getElementById('service-close');
const serviceModalIcon = document.getElementById('service-modal-icon');
const serviceModalTitle = document.getElementById('service-modal-title');
const serviceModalDesc = document.getElementById('service-modal-desc');

function openServiceModal(key) {
  const info = SERVICE_INFO[key];
  if (!info || !serviceModal) return;
  serviceModalIcon.textContent = info.icon;
  serviceModalTitle.textContent = info.title;
  serviceModalDesc.textContent = info.desc;
  serviceModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeServiceModal() {
  serviceModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (serviceModal && serviceClose) {
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', () => openServiceModal(card.dataset.service));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openServiceModal(card.dataset.service);
      }
    });
  });
  serviceClose.addEventListener('click', closeServiceModal);
  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('open')) closeServiceModal();
  });
}

// Quote form — submits to Formspree via fetch so the modal stays open
// and shows an inline confirmation instead of redirecting.
const quoteForm = document.getElementById('quote-form');
const formNote = document.getElementById('form-note');

if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formNote.style.color = '';
    formNote.textContent = 'Enviando...';

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        formNote.textContent = '¡Gracias! Un asesor de FoxLog te contactará pronto.';
        quoteForm.reset();
      } else {
        const data = await response.json().catch(() => null);
        const detail = data?.errors?.map((err) => err.message).join(', ');
        formNote.style.color = '#c0392b';
        formNote.textContent = detail || 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente.';
      }
    } catch {
      formNote.style.color = '#c0392b';
      formNote.textContent = 'Sin conexión. Intenta de nuevo en unos segundos.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

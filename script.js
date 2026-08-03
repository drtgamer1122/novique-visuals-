/**
 * Creative Studio - Interactive JavaScript Engine
 * WhatsApp target phone: +966 0557864359 -> 966557864359
 */

const WHATSAPP_PHONE = "966557864359";

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initPortfolioFilter();
  initLightbox();
  initQuoteGenerator();
  initWhatsAppWidget();
  initEasterEgg();
});

/* 1. Navbar Scroll & Active State */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 1.5 Mobile Navigation Toggle */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const icon = toggle ? toggle.querySelector('i') : null;

  function closeMenu() {
    navLinks.classList.remove('mobile-open');
    if (icon) {
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    }
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    navLinks.classList.add('mobile-open');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
    toggle.setAttribute('aria-expanded', 'true');
  }

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('mobile-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
}

/* 2. Portfolio Filter Tabs */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* 3. Lightbox Modal */
function initLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxWhatsappBtn = document.getElementById('lightboxWhatsappBtn');
  const closeBtn = document.querySelector('.lightbox-close');

  const portfolioItems = document.querySelectorAll('.portfolio-item');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img').src;
      const title = item.querySelector('.portfolio-title').innerText;
      const desc = item.querySelector('.portfolio-desc').innerText;
      const tag = item.querySelector('.portfolio-category-tag').innerText;

      lightboxImg.src = img;
      lightboxTitle.innerText = title;
      lightboxDesc.innerText = desc;
      lightboxTag.innerText = tag;

      // Custom WhatsApp message for specific portfolio item
      const msg = encodeURIComponent(`Hello! I saw your project "${title}" (${tag}) on your portfolio and I would like to inquire about a similar custom project.`);
      lightboxWhatsappBtn.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;

      lightbox.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  // Close on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

/* 4. Interactive WhatsApp Quote Generator */
function initQuoteGenerator() {
  const clientNameInput = document.getElementById('clientName');
  const serviceSelect = document.getElementById('serviceSelect');
  const timelineSelect = document.getElementById('timelineSelect');
  const projectNotesInput = document.getElementById('projectNotes');
  const quotePreviewDisplay = document.getElementById('quotePreviewDisplay');
  const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');

  function updateMessagePreview() {
    const name = clientNameInput.value.trim() || '[Your Name]';
    const service = serviceSelect.value || 'Custom Project';
    const timeline = timelineSelect.value || 'Flexible';
    const notes = projectNotesInput.value.trim() || 'No additional details provided.';

    const formattedMessage = `Hello! My name is ${name}.
I'm interested in requesting a quote for your services.

📌 Service Requested: ${service}
⏱️ Preferred Timeline: ${timeline}
📝 Project Brief & Details:
"${notes}"

Please let me know your availability and estimated pricing!`;

    quotePreviewDisplay.innerText = formattedMessage;
    return formattedMessage;
  }

  // Event Listeners for Live Preview
  [clientNameInput, serviceSelect, timelineSelect, projectNotesInput].forEach(el => {
    if (el) el.addEventListener('input', updateMessagePreview);
  });

  // Launch WhatsApp Link
  sendWhatsappBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const finalMsg = updateMessagePreview();
    const encoded = encodeURIComponent(finalMsg);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
  });
}

/* 5. Floating WhatsApp Quick Widget */
function initWhatsAppWidget() {
  const floatBtn = document.getElementById('whatsappFloatBtn');
  const chatPopup = document.getElementById('whatsappChatPopup');
  const closePopup = document.getElementById('closeChatPopup');
  const quickChatBtn = document.getElementById('popupQuickChatBtn');

  if (floatBtn && chatPopup) {
    floatBtn.addEventListener('click', () => {
      chatPopup.classList.toggle('active');
    });
  }

  if (closePopup) {
    closePopup.addEventListener('click', () => {
      chatPopup.classList.remove('active');
    });
  }

  if (quickChatBtn) {
    quickChatBtn.addEventListener('click', () => {
      const defaultMsg = encodeURIComponent("Hello! I came across your website and would like to chat about a potential project.");
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${defaultMsg}`, '_blank');
    });
  }
}

/* 6. Easter Egg Signature & Toast */
function initEasterEgg() {
  // Console Signature
  console.log(
    '%c ✦ CREATED BY DANISH REJI ✦ \n%c Videography | Graphic Design | Photography | Logo Identity & Custom Works\n%c Direct WhatsApp: +966 0557864359',
    'font-size: 14px; font-weight: bold; color: #22d3ee; background: #07090e; padding: 8px 16px; border-radius: 8px; border: 1px solid #22d3ee;',
    'font-size: 11px; color: #94a3b8; padding-top: 4px;',
    'font-size: 12px; color: #25d366; font-weight: bold;'
  );

  const trigger = document.getElementById('easterEggTrigger');
  if (trigger) {
    trigger.addEventListener('click', () => {
      showEasterEggToast();
    });
  }
}

function showEasterEggToast() {
  let toast = document.querySelector('.easter-egg-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'easter-egg-toast';
    toast.innerHTML = `<i class="fa-solid fa-sparkles" style="color: #22d3ee;"></i> <span>Crafted by <strong>Danish Reji</strong> ✨ Ready for your next creative project!</span>`;
    document.body.appendChild(toast);
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


/**
 * ZenZone Application Hub & Navigation Controller
 * Manages tab views, mobile navigation toggle, random affirmation generator,
 * and global event hooks.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- TAB NAVIGATION ---
  const tabButtons = document.querySelectorAll('.nav-tab-btn, .quick-tab-link');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const mobileToggle = document.getElementById('navMobileToggle');
  const navLinks = document.getElementById('navLinks');

  function switchTab(tabId) {
    // Hide all panels
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Show target panel
    const targetPanel = document.getElementById(tabId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav button
    tabButtons.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (navLinks) {
      navLinks.classList.remove('mobile-open');
    }

    // Trigger tab-specific refresh
    if (tabId === 'journalTab' && window.journalController) {
      window.journalController.loadData();
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = e.currentTarget.dataset.tab;
      if (tabId) switchTab(tabId);
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // --- AI EXAM AFFIRMATION GENERATOR ---
  const shuffleAffirmationBtn = document.getElementById('shuffleAffirmationBtn');
  const affirmationQuoteEl = document.getElementById('displayAffirmationQuote');
  const affirmationPromptEl = document.getElementById('displayAffirmationPrompt');
  const affirmationCategoryEl = document.getElementById('displayAffirmationCategory');

  async function loadRandomAffirmation() {
    if (!window.apiService) return;
    const aff = await window.apiService.getRandomAffirmation();
    if (aff) {
      if (affirmationQuoteEl) affirmationQuoteEl.textContent = `"${aff.quote}"`;
      if (affirmationPromptEl) affirmationPromptEl.textContent = aff.prompt;
      if (affirmationCategoryEl) affirmationCategoryEl.textContent = aff.category || 'Mindset';
    }
  }

  if (shuffleAffirmationBtn) {
    shuffleAffirmationBtn.addEventListener('click', () => {
      loadRandomAffirmation();
      if (window.zenAudio) {
        window.zenAudio.playSoftCue('hold');
      }
    });
  }

  // Load initial affirmation
  loadRandomAffirmation();
});

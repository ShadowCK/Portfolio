// Dark mode toggle and persistence
(function initTheme() {
  const storageKey = 'theme';
  const className = 'theme-dark';
  let isDarkCurrent = false;

  const updateWorkTagLabels = (isDark) => {
    try {
      const labels = document.querySelectorAll(
        '#portfolio-root .ui.card .meta .ui.labels .ui.label',
      );
      labels.forEach((el) => {
        if (isDark) el.classList.add('inverted');
        else el.classList.remove('inverted');
      });
    } catch (e) {
      // no-op
    }
  };

  const getPreferred = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    // Default to dark when no saved preference and no system hint
    return 'dark';
  };

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    const el = document.body || document.documentElement;
    el.classList.toggle(className, isDark);
    isDarkCurrent = isDark;
    updateWorkTagLabels(isDarkCurrent);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.checked = isDark;
  };

  const setTheme = (theme) => {
    localStorage.setItem(storageKey, theme);
    applyTheme(theme);
  };

  const init = () => {
    applyTheme(getPreferred());

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
      });
    }

    // Reflect system changes if user hasn't chosen explicitly
    if (!localStorage.getItem(storageKey) && window.matchMedia) {
      try {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', (ev) => applyTheme(ev.matches ? 'dark' : 'light'));
      } catch (_) {
        // Safari < 14 fallback
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addListener((ev) => applyTheme(ev.matches ? 'dark' : 'light'));
      }
    }

    // Observe portfolio content changes to re-apply inverted labels in dark mode
    const root = document.getElementById('portfolio-root');
    if (root && typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => updateWorkTagLabels(isDarkCurrent));
      mo.observe(root, { childList: true, subtree: true });
    }

    // Also re-apply on window load (React mounts after DOMContentLoaded)
    window.addEventListener('load', () => updateWorkTagLabels(isDarkCurrent));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

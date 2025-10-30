// Dark mode toggle and persistence
(function initTheme() {
  const storageKey = 'theme';
  const className = 'theme-dark';

  const getPreferred = () => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    const el = document.body || document.documentElement;
    el.classList.toggle(className, isDark);
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
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { useEffect, useState } from 'react';

// Keep storage key consistent with previous implementation
const STORAGE_KEY = 'lang';

// Initialize i18next with inline resources (can be moved to files/backends later)
i18next.use(LanguageDetector).init({
  fallbackLng: 'en',
  debug: false,
  interpolation: { escapeValue: false },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: STORAGE_KEY,
  },
  resources: {
    en: {
      translation: {
        filters: 'Filters',
        clear_all: 'Clear All',
        close: 'Close',
        meta: 'Meta',
        engine_language: 'Engine & Language',
        gameplay: 'Gameplay',
        tech: 'Tech',
        others: 'Others',
        all: 'All',
        open_filters: 'Open filters',
        open_work_details: 'Open work details',
        previous: 'Previous',
        next: 'Next',
        slides: 'Slides',
        selected_tags: 'Selected tags',
        social_linkedin: 'LinkedIn',
        social_github: 'GitHub',
        social_resume: 'Resume',
      },
    },
    zh: {
      translation: {
        filters: '筛选',
        clear_all: '清除全部',
        close: '关闭',
        meta: '类型',
        engine_language: '引擎与语言',
        gameplay: '玩法',
        tech: '技术',
        others: '其他',
        all: '全部',
        open_filters: '打开筛选',
        open_work_details: '打开作品详情',
        previous: '上一张',
        next: '下一张',
        slides: '幻灯片',
        selected_tags: '已选标签',
        social_linkedin: '领英',
        social_github: 'GitHub',
        social_resume: '简历',
      },
    },
  },
});

// Small helper to keep existing imports working
function t(key, opt) {
  return i18next.t(key, opt);
}

function setLang(lang) {
  const next = lang === 'zh' ? 'zh' : 'en';
  // Persist explicitly to match previous behavior (in addition to detector cache)
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (_) {
    /* no-op */
  }
  return i18next.changeLanguage(next);
}

function getLang() {
  const cur = i18next.language || 'en';
  return /zh/i.test(cur) ? 'zh' : 'en';
}

// Wire the static header toggle button that lives outside React
function wireLanguageToggle() {
  const updateToggleText = () => {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    const lang = getLang();
    btn.textContent = lang === 'zh' ? 'EN' : '中文';
    btn.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    btn.title = btn.getAttribute('aria-label');
  };

  const updateDomTranslations = () => {
    // Replace textContent of any element marked with data-i18n
    const nodes = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = t(key);
    }
  };

  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      setLang(getLang() === 'zh' ? 'en' : 'zh');
    });
  }
  updateToggleText();
  updateDomTranslations();

  // Update the toggle whenever language changes
  i18next.on('languageChanged', () => {
    updateToggleText();
    updateDomTranslations();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireLanguageToggle);
} else {
  wireLanguageToggle();
}

export { t, getLang, setLang };
// React hook to re-render components on language change
export function useI18n() {
  const [lang, setLangState] = useState(getLang());
  useEffect(() => {
    const onLang = () => setLangState(getLang());
    i18next.on('languageChanged', onLang);
    return () => i18next.off('languageChanged', onLang);
  }, []);
  return { lang };
}

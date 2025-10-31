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
        masthead_bio_html:
          'As an <b>INFP</b>, I embody responsibility, diligence, and altruism. My passion lies in programming, particularly in game development and web applications. I also do video editing and 3D modeling. Proficient in Java, JavaScript, C++, C#, and Lua.',
        masthead_subtitles_html:
          '<b>Looking for 2026 Fall new grad positions &ndash; Combat Designer / Technical Designer</b><br />MEng, Game Design, Development &amp; Innovation &ndash; Duke University (2024-2026)<br />BS, Game Design &amp; Development &ndash; Rochester Institute of Technology (2021-2024)',
        lang_toggle_to_en: 'Switch to English',
        lang_toggle_to_zh: 'Switch to Chinese',
        nav_dark: 'Dark',
        site_name: 'Zhao Jin',
        nav_works: 'Works',
        masthead_title: 'Zhao Jin',
        masthead_subtitle_1:
          'Looking for 2026 Fall new grad positions – Combat Designer / Technical Designer',
        masthead_subtitle_2:
          'MEng, Game Design, Development & Innovation – Duke University (2024-2026)',
        masthead_subtitle_3:
          'BS, Game Design & Development – Rochester Institute of Technology (2021-2024)',
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
        tools: 'Tools',
        role: 'Role',
        links: 'Links',
        time_range: 'Time Range',
        click_to_view_details: 'Click to view details',
        // Tag translations (English labels mirror original; used as keys)
        tag: {
          rhythm: 'Rhythm',
          puzzle: 'Puzzle',
          capstone: 'Capstone',
          tower_of_the_sorcerer_like: 'Tower of the Sorcerer like',
          storyline_branches: 'Storyline Branches',
          perlin_noise: 'Perlin Noise',
          circleci: 'CircleCI',
          open_trivia_database: 'Open Trivia Database',
          sfml: 'SFML',
          underscore: 'Underscore',
          howler_js: 'Howler.js',
          maya: 'Maya',
          dynamic_camera: 'Dynamic Camera',
          course_project: 'Course Project',
          personal_project: 'Personal Project',
          team_project: 'Team Project',
          team_of_5: 'Team of 5',
          team_of_6: 'Team of 6',
          web: 'Web',
          idle_game: 'Idle Game',
          clicker_game: 'Clicker Game',
          local_storage: 'Local Storage',
          html_css_js: 'HTML/CSS/JS',
          p5_js: 'P5.js',
          aseprite: 'Aseprite',
          node_js: 'Node.js',
          express: 'Express',
          react: 'React',
          socket_io: 'Socket.io',
          matter_js: 'Matter.js',
          phaser: 'Phaser',
          mongodb: 'MongoDB',
          redis: 'Redis',
          unity: 'Unity',
          c_sharp: 'C#',
          c_plus_plus: 'C++',
          shader: 'Shader',
          minimap: 'Minimap',
          vr: 'VR',
          ai: 'AI',
          tabletop_game: 'Tabletop Game',
          card_game: 'Card Game',
          game_design: 'Game Design',
          game_balance: 'Game Balance',
          tabletop_simulator: 'Tabletop Simulator',
          award_winning: 'Award Winning',
          best_sound_design: 'Best Sound Design',
          honorable_mention: 'Honorable Mention',
          triangle_game_jam: 'Triangle Game Jam',
          perforce: 'Perforce',
          roguelite: 'Roguelite',
          driving: 'Driving',
          skill_editor: 'Skill Editor',
          http_server: 'Http Server',
          web_audio: 'Web Audio',
          canvas: 'Canvas',
          eslint: 'ESLint',
          webpack: 'Webpack',
          archiver: 'Archiver',
          pinyin: 'Pinyin',
          cocos_creator: 'Cocos Creator',
          typescript: 'TypeScript',
          mobile_game: 'Mobile Game',
          internship: 'Internship',
          yoozoo_games: 'Yoozoo Games',
          roblox: 'Roblox',
          lua: 'Lua',
          roblox_studio: 'Roblox Studio',
          playdate_sdk: 'Playdate SDK',
          minecraft: 'Minecraft',
          rpg: 'RPG',
          rpg_maker_xp: 'RPG Maker XP',
          // Extra tools reusing tag translations for WorkDetail.tools
          box2d: 'Box2D',
          vegas_pro: 'Vegas Pro',
          trello_board: 'Trello Board',
          scrum: 'Scrum',
          spigot_api: 'Spigot API',
          forge_api: 'Forge API',
          es6_module: 'ES6 Module',
          audio_node: 'Audio Node',
          java: 'Java',
          unreal: 'Unreal',
          brain: 'Brain',
          heart: 'Heart',
          soul: 'Soul',
        },
        // Link text translations (common link button texts)
        link: {
          play: 'Play',
          repo: 'Repo',
          download_final_build: 'Download Final Build',
          download_latest_build: 'Download Latest Build',
          view_demo_video: 'View Demo Video',
          view_gameplay_video: 'View Gameplay Video',
          video_trailer: 'Video Trailer',
          view_floor_plan: 'View Floor Plan',
          view_mood_board: 'View Mood Board',
          download_written_plan: 'Download Written Plan',
          original_editor: 'Original Editor',
          itch_io: 'Itch.io',
          steam: 'Steam',
          design_doc: 'Design Doc',
          rule_sheet: 'Rule Sheet',
          you_are_already_here: 'You are already here!',
        },
        // Role name translations for detail sections
        role_name: {
          solo_developer: 'Solo Developer',
          programmer: 'Programmer',
          programmer_designer: 'Programmer, Designer',
          lead_programmer_lead_designer: 'Lead Programmer, Lead Designer',
          programmer_video_editor: 'Programmer, Video Editor',
          game_designer: 'Game Designer',
          programmer_ux_designer: 'Programmer, UX Designer',
        },
      },
    },
    zh: {
      translation: {
        masthead_bio_html:
          '作为一名<b>INFP</b>，我追求责任、勤奋与帮助他人。我的热情在编程，尤其是游戏开发与 Web 应用。我也做视频剪辑与 3D 建模。熟悉 Java、JavaScript、C++、C# 和 Lua。',
        masthead_subtitles_html:
          '<b>寻求 2026 秋季应届职位 —— 战斗策划 / 技术策划</b><br />硕士，游戏设计、开发与创新 —— 杜克大学（2024–2026）<br />学士，游戏设计与开发 —— 罗切斯特理工学院（2021–2024）',
        lang_toggle_to_en: '切换到英文',
        lang_toggle_to_zh: '切换到中文',
        nav_dark: '深色',
        site_name: '金钊',
        nav_works: '作品',
        masthead_title: '金钊',
        masthead_subtitle_1: '寻求 2026 秋季应届职位 —— 战斗策划 / 技术策划',
        masthead_subtitle_2: '硕士，游戏设计、开发与创新 —— 杜克大学（2024–2026）',
        masthead_subtitle_3: '学士，游戏设计与开发 —— 罗切斯特理工学院（2021–2024）',
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
        tools: '工具',
        role: '角色',
        links: '链接',
        time_range: '时间范围',
        click_to_view_details: '点击查看详情',
        tag: {
          rhythm: '节奏',
          puzzle: '解谜',
          capstone: '毕业设计',
          tower_of_the_sorcerer_like: '魔塔',
          storyline_branches: '剧情分支',
          perlin_noise: '柏林',
          circleci: 'CircleCI',
          open_trivia_database: 'Open Trivia 数据库',
          sfml: 'SFML',
          underscore: 'Underscore',
          howler_js: 'Howler.js',
          maya: 'Maya',
          dynamic_camera: '动态相机',
          course_project: '课程项目',
          personal_project: '个人项目',
          team_project: '团队项目',
          team_of_5: '五人团队',
          team_of_6: '六人团队',
          web: '网页',
          idle_game: '放置游戏',
          clicker_game: '点击游戏',
          local_storage: '本地存储',
          html_css_js: 'HTML/CSS/JS',
          p5_js: 'P5.js',
          aseprite: 'Aseprite',
          node_js: 'Node.js',
          express: 'Express',
          react: 'React',
          socket_io: 'Socket.io',
          matter_js: 'Matter.js',
          phaser: 'Phaser',
          mongodb: 'MongoDB',
          redis: 'Redis',
          unity: 'Unity',
          c_sharp: 'C#',
          c_plus_plus: 'C++',
          shader: '着色器',
          minimap: '小地图',
          vr: 'VR',
          ai: 'AI',
          tabletop_game: '桌游',
          card_game: '卡牌游戏',
          game_design: '游戏设计',
          game_balance: '游戏平衡',
          tabletop_simulator: '桌游模拟器',
          award_winning: '获奖作品',
          best_sound_design: '最佳音效设计',
          honorable_mention: '荣誉提名',
          triangle_game_jam: 'Triangle Game Jam',
          perforce: 'Perforce',
          roguelite: 'Roguelite',
          driving: '驾驶',
          skill_editor: '技能编辑器',
          http_server: 'HTTP 服务器',
          web_audio: 'Web 音频',
          canvas: 'Canvas',
          eslint: 'ESLint',
          webpack: 'Webpack',
          archiver: 'Archiver',
          pinyin: '拼音排序',
          cocos_creator: 'Cocos Creator',
          typescript: 'TypeScript',
          mobile_game: '手游',
          internship: '实习',
          yoozoo_games: '游族网络',
          roblox: 'Roblox',
          lua: 'Lua',
          roblox_studio: 'Roblox Studio',
          playdate_sdk: 'Playdate SDK',
          minecraft: 'Minecraft',
          rpg: 'RPG',
          rpg_maker_xp: 'RPG Maker XP',
          // Extra tools used in WorkDetail.tools
          box2d: 'Box2D',
          vegas_pro: 'Vegas Pro',
          trello_board: 'Trello 看板',
          scrum: 'Scrum',
          spigot_api: 'Spigot API',
          forge_api: 'Forge API',
          es6_module: 'ES6 模块',
          audio_node: '音频节点',
          java: 'Java',
          unreal: 'Unreal',
          brain: '大脑',
          heart: '心脏',
          soul: '灵魂',
        },
        link: {
          play: '游玩',
          repo: '仓库',
          download_final_build: '下载最终版本',
          download_latest_build: '下载最新版本',
          view_demo_video: '查看演示视频',
          view_gameplay_video: '查看实机视频',
          video_trailer: '预告片',
          view_floor_plan: '查看平面图',
          view_mood_board: '查看情绪板',
          download_written_plan: '下载文字方案',
          original_editor: '原版编辑器',
          itch_io: 'Itch.io',
          steam: 'Steam',
          design_doc: '设定文档',
          rule_sheet: '规则表',
          you_are_already_here: '你已经在这里啦！',
        },
        role_name: {
          solo_developer: '独立开发',
          programmer: '程序',
          programmer_designer: '程序、策划',
          lead_programmer_lead_designer: '主程序、主策划',
          programmer_video_editor: '程序、视频剪辑',
          game_designer: '策划',
          programmer_ux_designer: '程序、UX设计师',
        },
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
    const titleText = lang === 'zh' ? t('lang_toggle_to_en') : t('lang_toggle_to_zh');
    btn.setAttribute('aria-label', titleText);
    btn.title = titleText;
  };

  const updateDomTranslations = () => {
    // Replace textContent of any element marked with data-i18n
    const nodes = document.querySelectorAll('[data-i18n]');
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const key = node.getAttribute('data-i18n');
      if (key) node.textContent = t(key);
    }
    // Replace innerHTML of any element marked with data-i18n-html (trusted static content)
    const htmlNodes = document.querySelectorAll('[data-i18n-html]');
    for (let i = 0; i < htmlNodes.length; i += 1) {
      const node = htmlNodes[i];
      const key = node.getAttribute('data-i18n-html');
      if (key) node.innerHTML = t(key);
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
// Translate a role display name with fallback to original
export function tRole(raw) {
  const s = String(raw || '').trim();
  if (!s) return s;
  // Normalize common combinations
  const key = s
    .toLowerCase()
    .replace(/\s*&\s*|\s*，\s*|\s*\/\s*|\s*\+\s*|\s*and\s*/g, '_')
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const translated = i18next.t(`role_name.${key}`, { defaultValue: s });
  return translated;
}

// Translate a link text with fallback
export function tLink(raw) {
  const s = String(raw || '').trim();
  if (!s) return s;
  const key = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return i18next.t(`link.${key}`, { defaultValue: s });
}

// Localize time range by replacing month names and common tokens when zh
export function localizeTimeRange(raw) {
  const s = String(raw || '');
  if (getLang() !== 'zh') return s;
  let out = s;
  // Normalize common token "Now" -> "至今"
  out = out.replace(/\bNow\b/gi, '至今');

  // Month mapping (full and abbreviated) -> month number
  const monthToNum = {
    january: 1,
    jan: 1,
    february: 2,
    feb: 2,
    march: 3,
    mar: 3,
    april: 4,
    apr: 4,
    may: 5,
    june: 6,
    jun: 6,
    july: 7,
    jul: 7,
    august: 8,
    aug: 8,
    september: 9,
    sept: 9,
    sep: 9,
    october: 10,
    oct: 10,
    november: 11,
    nov: 11,
    december: 12,
    dec: 12,
  };
  const monthAlt = Object.keys(monthToNum).join('|');

  // 1) Replace patterns like "Month Day" (e.g., Nov 30, November 7)
  const monthDayRe = new RegExp(`\\b(${monthAlt})\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b`, 'gi');
  out = out.replace(
    monthDayRe,
    (_, mon, d) => `${monthToNum[mon.toLowerCase()]}月${parseInt(d, 10)}日`,
  );

  // 2) Replace patterns like "Day Month" (e.g., 30 Nov, 7 September)
  const dayMonthRe = new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthAlt})\\b`, 'gi');
  out = out.replace(
    dayMonthRe,
    (_, d, mon) => `${monthToNum[mon.toLowerCase()]}月${parseInt(d, 10)}日`,
  );

  // 3) Replace standalone months that remain with "n月"
  const monthOnlyRe = new RegExp(`\\b(${monthAlt})\\b`, 'gi');
  out = out.replace(monthOnlyRe, (_, mon) => `${monthToNum[mon.toLowerCase()]}月`);

  // 4) Append 年 to 4-digit years (19xx/20xx) when not already followed by 年
  out = out.replace(/\b(19|20)\d{2}\b(?!年)/g, '$&年');

  return out;
}
// Normalize a tag string into a key (e.g., 'C++' -> 'c_plus_plus')
function tagKey(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/c\+\+/g, 'c_plus_plus')
    .replace(/c#/g, 'c_sharp')
    .replace(/node\.js/g, 'node_js')
    .replace(/html\/?css\/?js/g, 'html_css_js')
    .replace(/p5\.js/g, 'p5_js')
    .replace(/matter\.js/g, 'matter_js')
    .replace(/playdate\s*sdk/g, 'playdate_sdk')
    .replace(/rpg\s*maker\s*xp/g, 'rpg_maker_xp')
    .replace(/\s*&\s*/g, '_and_')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Translate a tag; fall back to original label when missing
export function tTag(raw) {
  const key = tagKey(raw);
  return i18next.t(`tag.${key}`, { defaultValue: String(raw) });
}
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

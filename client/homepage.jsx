import { useEffect, useMemo, useRef, useState } from 'react';
import Clarity from '@microsoft/clarity';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { PortfolioWork, WorkDetail, YouTubeVideo, Carousel } from './components.jsx';
import './theme.js';
import { t, useI18n, tTag } from './i18n.js';

// Initialize Microsoft Clarity (project id provided via meta tag)
(() => {
  try {
    const meta = document.querySelector('meta[name="clarity-project-id"]');
    const pid = meta && meta.getAttribute('content');
    if (pid) {
      Clarity.init(pid);
    }
  } catch (e) {
    // no-op if Clarity not available or project id missing
  }
})();

// Tag ordering and grouping (multi-row filters):
// 1) Meta tags (project type)
// 2) Engine & Language (combined)
// 3) Gameplay (e.g., Driving, Clicker Game)
// 4) Tech (e.g., AI, Shader, VR, Socket.io)
// 5) Others (uncategorized, not excluded)

// 1) Meta tags (highest priority, fixed order)
const META_PRIORITY = [
  'Award Winning',
  'Capstone',
  'Internship',
  'Personal Project',
  'Team Project',
  'Course Project',
];

// Engines/platforms priority (used in Engine & Language group)
const ENGINE_PRIORITY = [
  'Unreal',
  'Unity',
  'Cocos Creator',
  'Roblox Studio',
  'Web',
  'Playdate SDK',
  'RPG Maker XP',
  'Tabletop Simulator',
  'Minecraft',
];

// Languages priority (used in Engine & Language group)
const LANGUAGE_PRIORITY = ['C++', 'C#', 'TypeScript', 'Lua', 'Java', 'JavaScript'];

// Gameplay tags (order here defines priority within the Gameplay group)
const GAMEPLAY_PRIORITY = [
  'Skill Editor',
  'Mobile Game',
  'Driving',
  'Roguelite',
  'RPG',
  'Puzzle',
  'Shooting',
  'Escape Room',
  'Tabletop Game',
  'Card Game',
  'Rhythm',
  'MMORPG',
  'Clicker Game',
  'Idle Game',
  'Tower of the Sorcerer like',
];

// Tech tags (order here defines priority within the Tech group)
const TECH_PRIORITY = [
  'AI',
  'Shader',
  'VR',
  'Socket.io',
  'MongoDB',
  'HTML/CSS/JS',
  'Redis',
  'Web Audio',
  'Local Storage',
  'Http Server',
  'React',
  'Express',
  'Phaser',
  'Matter.js',
  'Canvas',
  'Webpack',
  'ESLint',
  'Perforce',
];

// Exclude any tag that contains one of these substrings (case-insensitive).
// Tags containing these substrings will not be shown in the tag filter menu.
const EXCLUDE_CONTAINS = ['Team of'];

// Exclude any tag that exactly equals one of these strings.
// Exact match; case-sensitive.
const EXCLUDE_MATCH = [
  'Archiver',
  'Aseprite',
  'Audio Node',
  'Best Sound Design',
  'Box2D',
  'Bulma',
  'CircleCI',
  'Dynamic Camera',
  'Node.js',
  'Open Trivia Database',
  'p5.js',
  'Perlin Noise',
  'pinyin',
  'Roblox',
  'SFML',
  'Storyline Branches',
  'Substance Painter',
  'Triangle Game Jam',
  'Underscore',
  'F84 Studio',
  'Yoozoo Games',
  'Game Balance',
  'Game Design',
  'Honorable Mention',
  'Howler.js',
  'Maya',
  'Minimap',
];

const portfolioWorksData = [
  {
    id: 1,
    order: 13,
    title: 'RIT Idle',
    cardDesc_en: 'An idle game where you play as an RIT student.',
    cardDesc_zh: '一款让你扮演 RIT 学生的放置游戏。',
    detailDescription_en:
      'This was originally a course project for IGME-235, "Intro to Game Web Tech" - essentailly a web development course. I decided to continue working on it after the course ended, but only for a couple of weeks. I was quite a beginner at web development so my skills limited my ability to implement more features. I might come back to this project in the future.',
    detailDescription_zh:
      '最初这是 IGME-235《Intro to Game Web Tech》（本质上是 Web 开发课程）的课程项目。课程结束后我又继续做了几周。当时我还是 Web 开发的新手，能力所限，很多功能没能实现。未来可能会回头继续完善。',
    tools: ['HTML', 'CSS', 'JavaScript', 'Howler.js'],
    roleName: 'Solo Developer',
    links: [
      { text: 'Play', href: 'https://shadowck.github.io/RIT-Idle/' },
      { text: 'Repo', href: 'https://github.com/ShadowCK/RIT-Idle' },
    ],
    timeRange: '2022 December - 2023 January',
    image: '/assets/images/rit-idle-cover.png',
    tags: ['Course Project', 'Web', 'Idle Game', 'Local Storage', 'HTML/CSS/JS'],
  },
  {
    id: 2,
    order: 6,
    title: 'Lazy Garden',
    cardDesc_en: `A clicker/idle game. Grow flowers in your grandpa's garden and earn money.`,
    cardDesc_zh: '一款点击/放置游戏。在爷爷的花园里种花赚钱。',
    detailDescription_en: (
      <>
        A course project made during my first semester at RIT. Fun fact: I wasn't accepted into the
        Game Design and Development program in the first place, because I applied too late. I was
        redirected to the New Media Interactive Development program instead. I was able to transfer
        to the Game Design and Development program after my first semester. And this project was
        made during that semester for the course IGME.101 - "Interact Des & Alg Prob Solv I", one of
        the 3-course sequence that the NMID students have to take. I enjoyed{' '}
        <a
          href="https://www.rit.edu/directory/wmhics-w-michelle-harris"
          target="_blank"
          rel="noopener noreferrer"
        >
          Prof. Harris
        </a>
        ' lecture and had fun with p5.js. For the final project, we were asked to make "Targets" and
        "Influencers" in a p5.js scene. I played a lot of idle games over the past 6, 7 years so I
        decided to make such a game, in which you can technically idle it (however the idle gameplay
        wasn't the focus) or manually command your workers. My biggest accomplishment was the
        waypoint system. Hold shift to place waypoints and view the path. The workers will follow
        the path and do the work.
      </>
    ),
    detailDescription_zh: (
      <>
        这是我在 RIT 的第一学期做的课程项目。有个小插曲：一开始我并没有被游戏设计与开发专业录取，
        因为申请太晚，被转到了新媒体交互开发（NMID）。第一学期结束后我成功转入 GDD。本项目就是那学期
        IGME.101《Interact Des & Alg Prob Solv I》的期末作业，这是 NMID 必修的三门课之一。 我很喜欢{' '}
        <a
          href="https://www.rit.edu/directory/wmhics-w-michelle-harris"
          target="_blank"
          rel="noopener noreferrer"
        >
          Harris 教授
        </a>
        的课，也在 p5.js 上玩得很开心。期末要求是在 p5.js 场景里实现“Targets”和“Influencers”。过去
        六七年我玩了很多放置类游戏，于是决定做一款类似的作品，既可以挂机（不过挂机并不是本作的重点），
        也可以手动指挥工人。我最大的成果是路径点系统：按住 Shift 放置路径点并查看路径，工人会沿路径
        行动并完成工作。
      </>
    ),
    tools: ['P5.js', 'Aseprite'],
    roleName: 'Solo Developer',
    links: [
      { text: 'Play', href: 'https://shadowck.github.io/Lazy-Garden/' },
      { text: 'Repo', href: 'https://github.com/ShadowCK/Lazy-Garden' },
    ],
    timeRange: '2021 November',
    image: '/assets/images/lazy-garden-cover.png',
    tags: ['Course Project', 'Web', 'Clicker Game', 'Idle Game', 'p5.js', 'Aseprite'],
  },
  {
    id: 3,
    order: 11,
    title: 'Pong Hub',
    cardDesc_en: 'Multiplayer Pong game with fun mechanics.',
    cardDesc_zh: '一款具有趣味机制的多人乒乓游戏。',
    detailDescription_en: (
      <>
        This was the final project for the advanced elective course, IGME-430, 'Rich Media Web App
        Development II.' My passion for this project was so immense that I worked on it continuously
        for ten days, dedicating any spare time I had. The commit history in the Git repo can attest
        to this. I felt endlessly energized as the project was incredibly fascinating, employing
        different engines for the frontend and backend: Phaser and Matter.js. It featured numerous
        updates and edge case handling to enhance user experience. Crucially, the basic gameplay of
        Pong is simple, which allowed me to continuously add and refine new gameplay elements
        without getting bogged down in complex implementations. The app uses MongoDB for user data
        storage and Redis for session storage. For gameplay, it employs Socket.io to synchronize the
        game state between clients and the server. I also implemented a chat system that retains
        recent messages across server restarts when players join. Moreover, the app features an item
        store to showcase the profit model.
        <br />
        In the future, I plan to make the following improvements to the app:
        <ol className="ml-4">
          <li>
            Add more gameplay mechanics, like player levels and in-game currency earned through
            scoring. Players can rotate their paddles to strike the ball, but this might be less
            convenient for mobile users.
          </li>
          <li>
            Implement a spectator mode to avoid unbalanced player numbers on each team. This would
            ensure that players join the game simultaneously rather than one at a time.
          </li>
          <li>Create user info pages.</li>
          <li>Add a leaderboard with pagination and a search function.</li>
          <li>
            Make player names in the chat window clickable, opening their user info page. These
            pages should also be accessible through the leaderboard. Introduce an inventory system
            and item drops when players score. The items would have a Diablo-like feel, with more
            stats added to increase the variety of items.
          </li>
        </ol>
      </>
    ),
    detailDescription_zh: (
      <>
        这是高级选修课 IGME-430《Rich Media Web App Development
        II》的期末项目。我对它充满热情，连续十天 抓住一切空档投入开发，Git
        提交记录可以作证。这个项目非常有趣：前端与后端分别采用了不同的引擎——Phaser 与
        Matter.js。为提升用户体验，我做了大量更新与边界情况处理。关键在于，Pong
        的基础玩法足够简单，使我能 不断添加并打磨新机制，而不被复杂实现拖累。应用使用 MongoDB
        存储用户数据、Redis 存储会话；玩法层面通过 Socket.io
        同步客户端与服务器的游戏状态。我还实现了聊天系统，能在玩家加入时保留服务器重启前的近期消息；
        同时提供道具商店，用于展示商业化模型。
        <br />
        未来我计划做的改进：
        <ol className="ml-4">
          <li>
            增加更多玩法机制，例如玩家等级与通过得分获取的游戏内货币。玩家可以旋转球拍击球，但这可能对移动端不太
            友好。
          </li>
          <li>增加旁观者模式，避免每队人数不均衡；并让玩家成批加入，而非一个个进入。</li>
          <li>用户信息页。</li>
          <li>带分页与搜索的排行榜。</li>
          <li>
            聊天窗中的玩家名可点击以打开其信息页；排行榜亦可跳转。加入背包系统与得分掉落，道具趋向
            Diablo 风格， 随更多属性的加入提升多样性。
          </li>
        </ol>
      </>
    ),
    tools: ['Node.js', 'Express', 'React', 'Socket.io', 'Matter.js', 'Phaser', 'MongoDB', 'Redis'],
    roleName: 'Solo Developer',
    links: [
      { text: 'Play', href: 'https://pong-hub-afa594aad9a7.herokuapp.com/' },
      { text: 'Repo', href: 'https://github.com/ShadowCK/Pong-Hub' },
    ],
    timeRange: '2023 Nov 30 - Dec 11',
    image: '/assets/images/pong-hub-cover.png',
    tags: [
      'Course Project',
      'Web',
      'Node.js',
      'Http Server',
      'Express',
      'React',
      'Socket.io',
      'Matter.js',
      'Phaser',
      'MongoDB',
      'Redis',
    ],
  },
  {
    id: 4,
    order: 10,
    title: 'SkillAPI Editor Returns',
    cardDesc_en: 'A refactored, more robust version of the SkillAPI Editor.',
    cardDesc_zh: '对 SkillAPI Editor 的重构与增强版本，更现代、更稳健。',
    detailDescription_en: (
      <>
        This is a passion project I had been dreaming of for years. SkillAPI is the cornerstone
        plugin of my Minecraft RPG servers, New World and Top Land. The developer, an alumnus of
        RIT, inspired my college choice. I discovered his RIT connection through the plugin’s
        license, which listed his real name, leading me to his LinkedIn page. At the time, I was
        deciding between computer science and game design & development for my college major.
        Learning that he graduated from RIT's game design & development program thrilled me. His
        work with SkillAPI, once the premier RPG plugin, its well-structured code, and his active
        role in the community, offering help and accepting suggestions, have earned my deepest
        respect. Though we've never met, I consider him a mentor of sorts, and I'm now following in
        his footsteps, hoping to meet him one day.
        <br />
        As for the project, I made 196 commits in 18 days, which was intense! I recall working
        non-stop for 12 hours a day during the Thanksgiving break. The experience was exhilarating,
        and the payoff was worth it. I transformed the outdated editor, parts of which predated ES6,
        into a modern, robust, and extensible web application. I added features and enhanced the
        UI/UX with innovations like Zen Mode, Compact Mode, and component comments and tags. The
        original design required clicking into each component to edit or view details; functional,
        yet cumbersome for quick checks. I prototyped a preview window that was quite effective, but
        the tags and comments system proved to be even better—more lightweight and intuitive.
        <br />I also introduced Pinyin Sort to accommodate the plugin's popularity within the
        Chinese Minecraft community, a nod to my own heritage. But the crowning achievement was the
        save system overhaul. The original editor relied on DOM-related functions to update skill
        data, an approach that was overkill for saving purposes since the DOM is merely for data
        display. My no-DOM version of these functions delivered astounding results! The 'Backup All
        Data' button used to be a pain point. Years ago, while actively updating the New World
        server with over 200 skills, saving them in bulk after a single edit was time-consuming. It
        meant waiting up to 30 seconds for 80 skills or even 5 minutes for all, on my old PC with a
        7700k CPU. I used to take breaks during this time. Now, even with a 12700, 80 skills take
        only 4 seconds—and just 15 seconds during garbage collection. Still, I aimed for better. The
        performance is now consistently fast, clocking in at only 30ms for those same 80 skills!
        That's incredibly satisfying!
        <br />
        Other exciting features include the ability to copy paste the active component across
        skills, simply using Ctrl+C and Ctrl+V. The active component is highlighted in the builder
        form (via the "Edit Effects" button). In addition, I wrote a pack.js script using Archiver
        to pack only necessary files as a dist build. That way I can easily send the editor to my
        friends.
      </>
    ),
    detailDescription_zh: (
      <>
        这是我多年念念不忘的热爱项目。SkillAPI 是我运营的 Minecraft RPG 服务器（New World 与 Top
        Land）的 核心插件。其作者毕业于
        RIT，这也影响了我的大学选择。我在插件许可证里看到他的真名，顺藤摸瓜找到了 他的
        LinkedIn。当时我还在计算机科学与游戏设计开发两个专业间犹豫，得知他出自 RIT
        游戏设计开发，内心非常激动。SkillAPI 曾是最强的 RPG
        插件之一，代码结构优秀；作者也十分活跃，乐于帮助、采纳建议，这些都让我非常敬佩。虽未
        谋面，但我一直把他当作亦师亦友的榜样，如今也在追随他的道路，希望有一天能与他相见。
        <br />
        说回项目本身：18 天写了 196 次提交，节假日每天 12
        小时不间断开发，非常“上头”，但也非常值得。我把远古 的编辑器（部分代码甚至早于
        ES6）升级成现代、稳健、可扩展的 Web 应用；并带来 Zen 模式、紧凑模式、组件 标签与评论等一系列
        UI/UX 创新。旧版需要点进每个组件才能查看或编辑，功能上可用，但不利于快速查看。我曾
        做了一个预览窗原型，效果不错，但最终“标签+评论”的方案更轻量直观。
        <br />
        我还加入了“拼音排序”，致敬插件在中文社区的流行与我的文化背景。最满意的成果是存档系统重构：旧版依赖
        DOM 相关函数更新技能数据，而保存并不需要 DOM（DOM 只是用来展示），因此我做了“无
        DOM”实现，性能炸裂！ 过去“备份全部数据”是痛点。那时我在维护 New World，技能
        200+，一次小改后批量保存要等很久：80 个技能 30 秒、全部甚至 5 分钟（7700K
        的老电脑）。现在即使用 12700，80 个技能也只需 4 秒——垃圾回收时 15 秒。
        但我还不满足，如今性能稳定在 30ms 处理同样的 80 个技能，爽到起飞！
        <br />
        其他亮点：可以用 Ctrl+C/Ctrl+V 跨技能复制当前组件；当前组件在表单（“Edit
        Effects”按钮）中有高亮； 另外写了基于 Archiver 的 pack.js，只打包必要文件成
        dist，便于分享给朋友。
      </>
    ),
    tools: ['Node.js', 'Archiver', 'pinyin'],
    roleName: 'Solo Developer',
    links: [
      {
        text: 'Editor v0.2.9',
        href: 'https://people.rit.edu/~zj5148/skillapi-editor-returns-0.2.9/',
      },
      { text: 'Original Editor', href: 'https://eniripsa96.github.io/SkillAPI/' },
      { text: 'Repo', href: 'https://github.com/ShadowCK/SkillAPIEditorReturns' },
    ],
    timeRange: '2023 Nov 13 - Nov 30. To be continued...',
    image: '/assets/images/skillapi-editor-cover.png',
    tags: ['Personal Project', 'Web', 'Node.js', 'Archiver', 'pinyin', 'Skill Editor'],
  },
  {
    id: 5,
    order: 102,
    title: 'myQuizzes',
    cardDesc_en: 'A web app for taking quizzes from the Open Trivia Database.',
    cardDesc_zh: '一款基于 Open Trivia Database 的答题 Web 应用。',
    detailDescription_en:
      "A course project for IGME-235, 'Intro to Game Web Tech' - essentially a web development course. This was the first web app I ever made, and it remains one of my proudest works. I dedicated a considerable amount of time to refining its user experience and learned a great deal about web development in the process. The app features a sound manager that supports sound variants, leveraging the basic functionality of Howler.js. The UI is smooth and dynamic, with almost every action accompanied by visual transitions and sound feedback. It boasts a leaderboard using the Local Storage API, featuring a well-thought-out scoring system, a sidebar for question navigation, and a settings panel that appears when you hover over its exposed edge (when taking a quiz). At that time, I didn’t know any CSS frameworks, so I wrote all the CSS rules myself - a whopping 700 lines! The main.js file was extensive too, with 1150 lines, mainly because I consolidated most functions into one script. This course marked the beginning of my web development journey and my first serious foray into JavaScript. However, my passion for these projects was stronger than ever. I knew nothing and was eager to try everything. If you ask me to write 700 lines of CSS now, I'd probably kill myself. It's fascinating, isn't it? Looking back at our childhood, we were thrilled by any simple game, even things that can hardly be called games. But now, we've become so selective, so experienced, so mature, and perhaps, a bit more jaded.",
    detailDescription_zh:
      '这是 IGME-235《Intro to Game Web Tech》（本质上是 Web 开发课程）的课程项目。它是我做的第一个 Web 应用，也是我至今最自豪的作品之一。我花了很多时间打磨用户体验，并在过程中学到了大量 Web 开发知识。应用实现了一个声音管理器，支持音效变体，基于 Howler.js 的基础能力。整体 UI 流畅且富有动效，几乎每个操作都有动态过渡与声音反馈。它还用 Local Storage API 做了排行榜，包含一套认真设计的计分系统、题目导航侧栏，以及在做题时可以从边缘浮出的设置面板。那会儿我不懂任何 CSS 框架，于是全靠自己写了 700 行 CSS！main.js 也很大，有 1150 行，主要因为我把大部分函数都塞在一个脚本里。这门课开启了我的 Web 开发之路，也是我第一次认真投入 JavaScript。虽然当时什么都不懂，却格外有热情，什么都想尝试。要我现在再写 700 行 CSS，我可能会抓狂。回想小时候，我们对任何简单的小玩意都兴奋不已；而如今，我们变得挑剔、经验更足、更成熟，也或许多了一点倦怠。',
    tools: ['HTML/CSS/JS', 'Howler.js', 'Open Trivia Database'],
    roleName: 'Solo Developer',
    links: [{ text: 'Play', href: 'https://people.rit.edu/~zj5148/235/project2/' }],
    timeRange: '2022 Nov 9 - Dec 15',
    image: '/assets/images/my-quizzes-cover.png',
    tags: ['Course Project', 'Web', 'HTML/CSS/JS', 'Howler.js', 'Open Trivia Database'],
  },
  {
    id: 6,
    order: 7,
    title: 'Lost Castle',
    cardDesc_en:
      'A 3D scene of a lost castle in the void, replicating the first dungeon of my Minecraft MMORPG server, "New World".',
    cardDesc_zh:
      '虚空中遗失城堡的 3D 场景，复刻了我 Minecraft MMORPG 服务器 “New World” 的第一座副本。',
    detailDescription_en:
      'The final project for IGME-219, "3D Animation and Asset Production". The goal was to build a 3D scene with original assets. I decided to recreate the first dungeon of my Minecraft MMORPG server, "New World". I used Maya to make models for the castle and props, and Substance Painter to texture them. I added post processing in Unity so that the scene looks more appealing. I also made a script for the floating rocks so they move up and down, and pause when the player stands on them. However, the castle\'s model was not cleaned up (was a headache to me), causing its UV map to be messed up.',
    detailDescription_zh:
      'IGME-219《3D Animation and Asset Production》的期末项目。目标是用原创资源搭建一个 3D 场景。我选择复刻自己 Minecraft MMORPG 服务器 “New World” 的第一座副本。我用 Maya 制作城堡与道具模型，并用 Substance Painter 贴图；在 Unity 中加入后期处理以增强观感。还为漂浮岩编写了脚本，让其上下起伏，并在玩家站上去时暂停。不过城堡模型没有做好清理（让我头疼），导致 UV 出了问题。',
    tools: ['Maya', 'Substance Painter', 'Unity', 'C#'],
    roleName: 'Solo Developer',
    links: [
      {
        text: 'Download Final Build',
        href: 'https://drive.google.com/file/d/14w7MyWAlPjDO5PeJgKMpqAOkNCymaKxs/view?usp=sharing',
      },
      { text: 'View Floor Plan', href: '/assets/images/lost-castle-floor-plan.png' },
      { text: 'View Mood Board', href: '/assets/images/lost-castle-mood-board.png' },
      { text: 'Download Written Plan', href: '/assets/lost-castle-written-plan.docx' },
    ],
    timeRange: '2023 Nov 1 - Dec 10',
    image: '/assets/images/lost-castle-cover.png',
    tags: ['Course Project', 'Maya', 'Substance Painter', 'Unity', 'C#'],
  },
  {
    id: 7,
    order: 4,
    title: 'Mecha Angel',
    cardDesc_en: "A shoot'em up game. Fight against the evil forces with your aircraft.",
    cardDesc_zh: '纵版射击游戏，驾驶战机对抗邪恶势力。',
    detailDescription_en:
      "A course project for IGME-202, 'Interactive Media Development.' We were tasked with creating a shmup (shoot 'em up) game. My original concept was ambitious: a side-scrolling shooter featuring two distinct modes – a gunner mode (reminiscent of Contra) and an aircraft mode, inspired by the Viking unit from StarCraft II. In this design, players would collect energy cores to temporarily switch to the more powerful and score-heavy aircraft mode. The final showdown was planned to be an intense battle in aircraft mode (without the need for energy cores at this point). The two modes were designed to offer varied gameplay experiences – one focusing on survival and collection, the other on destruction and scoring, with one mode featuring auto-fire and the other allowing for manual, free-directional shooting. However, due to time constraints and other course commitments, the project's scope was significantly reduced. The final version featured only the aircraft mode and omitted the boss fight. Nonetheless, I successfully implemented several key features: five enemy types, a dynamic health bar, a seamlessly scrolling background, two difficulty levels, enemy waves, a scoring system, and level-up enhancements triggered at specific score milestones. Additionally, I introduced a unique mechanic where bullets can destroy each other, enhancing the gameplay strategy. Meteors were also added as an obstacle, offering a tactical element by blocking enemy bullets.",
    detailDescription_zh:
      'IGME-202《Interactive Media Development》的课程项目，要求做一款纵版射击（shmup）游戏。我的最初设想比较宏大：做一款横版射击，包含“枪手模式”（类似魂斗罗）与“战机模式”（灵感来自星际争霸 II 的维京战机）两种形态。玩家可收集能量核心，临时切换到更强、得分更高的战机形态。最终 BOSS 战也计划在战机形态进行（此时不再需要能量）。两种形态带来不同体验——一个偏生存与收集，另一个偏输出与得分，并分别对应自动开火与手动、自由方向射击。受限于时间与其他课程负担，最终范围缩减，仅保留战机形态且没有 BOSS。但我仍实现了不少要点：5 种敌人、动态血条、无缝滚动背景、两档难度、敌人波次、计分系统、到特定分数自动升级等。另外还做了“子弹互毁”的机制，提升博弈性；并加入陨石作为障碍，可阻挡敌方子弹。',
    tools: ['Unity', 'C#'],
    roleName: 'Solo Developer',
    links: [
      { text: 'Play', href: 'https://igme-202-2221.github.io/project-1-ShadowCK/build/' },
      { text: 'Repo', href: 'https://github.com/IGME-202-2221/project-1-ShadowCK' },
    ],
    timeRange: '2022 Sept 8 - Oct 16',
    image: '/assets/images/mecha-angel-cover.png',
    tags: ['Course Project', 'Unity', 'C#'],
  },
  {
    id: 8,
    order: 12,
    title: 'Zhao Drift',
    cardDesc_en: 'Send and receive messages in the form of drifting bottles.',
    cardDesc_zh: '以“漂流瓶”的形式收发消息。',
    detailDescription_en:
      'A course project for the advanced elective course, IGME-430, "Rich Media Web App Development II." Initially, I aimed to create an app for private chats with my friends, featuring customizable options, and thus named it "Zhao Chat." However, I later pivoted to a more intriguing concept of chatting with random people in an aesthetically appealing experience. My professor commented, "This project almost feels like an art piece. The ability to either destroy the bottle or send it back into the pool is really cool and interesting." And I wholeheartedly agree. The concept is engaging, and the UI design is beautiful. I\'m proud of this project. Given more time, I would refactor it to use Express, React, and Socket.io, and add additional features like user authentication, the ability to add comments to bottles, and user-generated pools (in contrast to the public one).',
    detailDescription_zh:
      '高级选修课 IGME-430《Rich Media Web App Development II》的课程项目。最初我想做一个与朋友私聊、可自定义的应用，取名 “Zhao Chat”。后来转向更有趣的方向：与陌生人交流，同时追求更美的审美体验。老师评价：“这几乎像一件艺术作品。能把瓶子摧毁或送回池子，非常酷也很有意思。”我非常认同。这个概念足够抓人，UI 也很漂亮，我很喜欢这个项目。若有更多时间，我会用 Express、React、Socket.io 重构，并加入用户登录、瓶子评论、以及用户自建“池子”（区别于公共池）等功能。',
    tools: ['Node.js', 'Bulma', 'Webpack', 'CircleCI', 'ESLint', 'Underscore'],
    roleName: 'Solo Developer',
    links: [
      { text: 'Play', href: 'https://zhao-chat-06a0fdd7b35c.herokuapp.com/' },
      { text: 'Repo', href: 'https://github.com/ShadowCK/Zhao-Chat' },
    ],
    timeRange: '2023 Oct 8 - Oct 30',
    image: '/assets/images/zhao-drift-cover.png',
    tags: [
      'Course Project',
      'Web',
      'Node.js',
      'Http Server',
      'Bulma',
      'Webpack',
      'CircleCI',
      'ESLint',
      'Underscore',
    ],
  },
  {
    id: 9,
    order: 103,
    title: 'Balldio Visualizer',
    cardDesc_en: 'An audio visualizer with balls and Perlin noise.',
    cardDesc_zh: '一个带有小球与柏林噪声的音频可视化。',
    detailDescription_en: `Human auditory perception of frequency is based on a logarithmic function. In this visualization, the columns representing frequency within the central circular ring are arranged in accordance with this phenomenon. Additionally, the width of the columns for lower frequencies is larger, reflecting the human ear's increased sensitivity to these frequencies. The color of the ring is determined by Perlin noise, creating a smooth gradient. The balls are another representation of volumes on the frequency spectrum. Unlike the ring, they are aligned linearly, with colors ranging from hue 0 to 360. The application also implements a beat detection algorithm. The ring and balls react to the beat, creating a dynamic and interesting visual effect that you will notice when you try it out. The app includes audio nodes and toggleable visual effects (by modifying the pixels of the canvas' imageData), enhancing the experience. Unfortunately, due to time constraints, I wasn't able to implement a file upload system to support playing local music. I had also originally planned to support the Spotify API.`,
    detailDescription_zh:
      '人耳对频率的感知符合对数分布。可视化中，圆环里的频谱柱按这一现象排布；低频柱更宽，以体现人耳对低频更敏感。圆环的颜色由柏林噪声驱动，形成平滑渐变。小球则是频谱音量的另一种表达：不同于圆环的环形布局，小球沿直线排列，色相从 0 到 360 渐变。应用实现了节拍检测，圆环与小球会随节拍动态响应，带来鲜活的视觉效果。还包含多种 Audio Node，并可切换视觉特效（通过修改画布 imageData 像素）。由于时间限制，未支持本地文件上传播放；原计划对接 Spotify API，也暂搁置。',
    tools: ['Canvas', 'Web Audio', 'HTML/CSS/JS', 'ES6 Module'],
    roleName: 'Solo Developer',
    links: [{ text: 'Play', href: 'https://people.rit.edu/~zj5148/330/jin-z-hw2/' }],
    timeRange: '2023 Feb 17 & Mar 22 (two days)',
    image: '/assets/images/balldio-visualizer-cover.png',
    tags: ['Course Project', 'Web', 'Canvas', 'Web Audio', 'Perlin Noise', 'Audio Node'],
  },
  {
    id: 10,
    order: 5,
    title: `Illostath's Legacy`,
    cardDesc_en: 'Casual game. Explore the Ethshar world as an alchemist.',
    cardDesc_zh: '休闲游戏。化身炼金术士，探索 Ethshar 世界。',
    detailDescription_en: (
      <>
        This is a course project for IGME-320, "Game Design and Development II". We used Scrum and
        Trello Board to manage the project. It proved to be very useful and motivating. I was one of
        the two programmers in the team, responsible for the item management system, sound system,
        debugging and QoL improvements. I also made a video trailer for the game. I enjoyed working
        with the team and learned that Unity sucks. It's just too heavy for a tiny game. Next time
        I'll try Godot or Unreal Engine. I wish I had more contribution to this game, but I
        decitated most of my time to Zhao Drift and Pong Hub.
        <br />
        Note: as this is a team project, I am not able to share the source code.
        <br />
        <YouTubeVideo link="P4Q6Swxffjw?si=0HZHOoZQzoy1m6fz" />
      </>
    ),
    detailDescription_zh: (
      <>
        IGME-320《Game Design and Development II》的课程项目。团队使用 Scrum 与 Trello
        进行管理，实践证明这
        很高效也很激励人。我是队里两名程序之一，负责物品系统、音频系统、调试与易用性改进；同时剪辑了游戏的预告
        片。与团队协作很愉快，也让我认识到 Unity 对小体量项目过于臃肿——下次会考虑 Godot 或 Unreal。
        老实说，这学期我把大量精力投入到了 Zhao Drift 与 Pong
        Hub，上述项目贡献更多，所以这款游戏我自评还有上升 空间。
        <br />
        注：由于是团队项目，源码不便公开。
        <br />
        <YouTubeVideo link="P4Q6Swxffjw?si=0HZHOoZQzoy1m6fz" />
      </>
    ),
    tools: ['Unity', 'C#', 'Vegas Pro', 'Trello Board', 'Scrum'],
    roleName: 'Programmer, Video Editor',
    links: [
      {
        text: 'Download Final Build',
        href: 'https://drive.google.com/file/d/1KGOtN-KP6sgRM9KLqqYRqIFWcsf5vKVO/view?usp=sharing',
      },
      {
        text: 'Video Trailer',
        href: 'https://www.youtube.com/watch?v=P4Q6Swxffjw&ab_channel=ZhaoJin',
      },
    ],
    timeRange: '2023 September - 2023 December',
    image: '/assets/images/illostath-legacy-cover.png',
    tags: ['Course Project', 'Team Project', 'Team of 5', 'Unity', 'C#'],
  },
  {
    id: 11,
    order: 10001,
    title: 'Cat Calamity',
    cardDesc_en:
      'A tabletop card game. Play as a cat after the human apocalypse. The world collapses each turn. Survive and be the last cat standing.',
    cardDesc_zh: '桌面卡牌游戏。人类末日后化身猫咪，在每回合都在崩塌的世界中求生，成为最后的赢家。',
    detailDescription_en: (
      <>
        All of us were actively involved in the design process, engaging in intense discussions
        about the theme, gameplay, and mechanics, with regular weekly meetings for iteration.
        However, the sections in the design document listing responsible members for each part are
        not entirely accurate. This is because, as new content was added, the listed names weren't
        updated. In essence, every team member significantly contributed to most aspects of the
        project, except for the art. The lovely art was done by{' '}
        <a
          href="https://www.linkedin.com/in/liamarmitage/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Liam
        </a>
        ,{' '}
        <a
          href="https://www.linkedin.com/in/conrad-chaffee/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conrad
        </a>{' '}
        and{' '}
        <a href="https://www.linkedin.com/in/petercat/" target="_blank" rel="noopener noreferrer">
          Peter
        </a>
        . My main focus was on the game balance, items and events ("calamities"). If you are
        interested, the design document includes everything about the game except the rules in
        detail.
        <br />
        The game is now transplanted to Tabletop Simulator as a workshop mod on{' '}
        <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=3139751234&searchtext=cat+calamity"
          target="_blank"
          rel="noopener noreferrer"
        >
          Steam
        </a>
        . You can play it by subscribing to the link below.
      </>
    ),
    detailDescription_zh: (
      <>
        团队所有成员都深度参与了设计过程，围绕主题、玩法与机制展开了大量讨论，并进行每周迭代。但设计文档中“各
        模块负责人”的表格并不完全准确，因为后续新增内容时没有实时更新。实际上，除美术外，大家几乎都在大多数组
        件上投入甚多。精美的美术来自{' '}
        <a
          href="https://www.linkedin.com/in/liamarmitage/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Liam
        </a>
        、{' '}
        <a
          href="https://www.linkedin.com/in/conrad-chaffee/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Conrad
        </a>{' '}
        与{' '}
        <a href="https://www.linkedin.com/in/petercat/" target="_blank" rel="noopener noreferrer">
          Peter
        </a>
        。我个人的主要工作在数值平衡、道具与事件（“灾厄”）设计。如果你感兴趣，设计文档包含了除详细规则外的几
        乎所有信息。
        <br />
        目前已将本作移植为 Tabletop Simulator 的创意工坊模组，发布在{' '}
        <a
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=3139751234&searchtext=cat+calamity"
          target="_blank"
          rel="noopener noreferrer"
        >
          Steam
        </a>
        上，你可以通过订阅下方链接来游玩。
      </>
    ),
    tools: ['Brain', 'Heart', 'Soul'],
    roleName: 'Game Designer',
    links: [
      {
        text: 'Steam',
        href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3139751234&searchtext=cat+calamity',
      },
      {
        text: 'Design Doc',
        href: 'https://drive.google.com/file/d/1g8srxiX-jmlTNrfoVh4U_sAFnrzP5xqZ/view?usp=sharing',
      },
      {
        text: 'Rule Sheet',
        href: 'https://drive.google.com/file/d/123sTj5ULfvzGiISluFtuGWOLBQjtTMB1/view?usp=sharing',
      },
    ],
    timeRange: '2023 January - May',
    image: '/assets/images/cat-calamity-cover.png',
    tags: [
      'Course Project',
      'Team Project',
      'Team of 5',
      'Tabletop Game',
      'Card Game',
      'Game Design',
      'Game Balance',
      'Tabletop Simulator',
    ],
  },
  {
    id: 12,
    order: 10000,
    title: 'Graphical Snake',
    cardDesc_en:
      'Conquer gravity and collect gems in two difficulties. Accuracy is the key to a high score.',
    cardDesc_zh: '克服重力，在两种难度下收集宝石。准确度是高分的关键。',
    detailDescription_en: (
      <>
        As a course project, this mini game was developed in C++ using SFML and Box2D, with a
        dynamic camera, custom font, text display in typing fashion, BGMs and sound effects. The
        game itself is a simple snake game with a twist: the snake is affected by gravity (and will
        not grow). The game features game options such as two difficulty levels and gem count, where
        in hell mode the player cannot see their snake when close to the gem. The game also has a
        score system mainly based on key presses, time elapsed and accuracy; the accuracy decreases
        when the snake moves away from the gem.
        <br />
        Note: There is no executable for this mini game. Neither is the source code available due to
        course policy. However, a demo video is provided to get a better understanding of the game.
        <br />
        <YouTubeVideo link="XSzfin-ZCqM?si=4HNPptaetnpVAkcW" />
      </>
    ),
    detailDescription_zh: (
      <>
        作为课程项目，本作用 C++ 开发，采用 SFML 与
        Box2D，包含动态相机、自定义字体、打字式文本呈现、BGM 与
        音效。玩法是“变体贪吃蛇”：蛇会受到重力影响（且不会变长）。游戏提供两档难度与可调宝石数量；在地狱模式
        下，当蛇接近宝石时玩家看不到蛇。计分系统主要基于按键次数、用时与准确度，蛇远离宝石时准确度会下降。
        <br />
        注：本作没有可执行文件；依据课程政策，源码也不公开。但可观看演示视频来了解玩法：
        <br />
        <YouTubeVideo link="XSzfin-ZCqM?si=4HNPptaetnpVAkcW" />
      </>
    ),
    tools: ['C++', 'SFML', 'Box2D'],
    roleName: 'Solo Developer',
    links: [{ text: 'View Demo Video', href: 'https://youtu.be/XSzfin-ZCqM' }],
    timeRange: '2023 December',
    image: '/assets/images/graphical-snake-cover.png',
    tags: ['Course Project', 'C++', 'SFML', 'Box2D', 'Dynamic Camera'],
  },
  {
    id: 13,
    order: -300,
    title: 'Play Cats: Tag!',
    cardDesc_en: 'A Roblox game where you play as a cat and play tag with other players.',
    cardDesc_zh: '一款 Roblox 游戏：化身猫咪，与其他玩家进行躲猫猫（追逐）对战。',
    detailDescription_en: (
      <>
        Refactored the movement system and buff system to allow stack-able effects such as slow and
        speed-up at the same time. Cooperated with our UI designer to implement various UIs such as
        a 3D nameplate. The biggest challenge was using coroutines to implement the tagging/tagged
        visuals as it has various moving components that relies on delays. Also added VFX and SFX
        for many cats. The gameplay video includes the nameplate and tagging / tagged transition UI.
        <br />
        One week after adding the tagging / tagged transition UI, VFX and SFX to each cat, the{' '}
        <b>DAU increased from 3200 to 5600</b>.
        <br />
        The game amassed over <b>1 million visits</b> within two months without any promotions.
        <br />
        <YouTubeVideo link="7CXE7jriAP4?si=SxQGPa4W00hdc1IT" />
      </>
    ),
    detailDescription_zh: (
      <>
        重构了移动与增益系统，使减速与加速等效果可叠加同时生效。与 UI 设计师协作实现多种界面元素，如
        3D 名牌。
        最大挑战是用协程实现“追逐中/被追逐”的过场与视觉：涉及多个依赖延迟的动态组件。还为多只猫添加了
        VFX/SFX。 演示视频中可见名牌与追逐过场 UI。
        <br />
        在为每只猫加上追逐过场、VFX 与 SFX 后的第 1 周，<b>DAU 从 3200 提升到 5600</b>。
        <br />
        游戏在两个月内 <b>自然获 100 万+ 访问</b>（无推广）。
        <br />
        <YouTubeVideo link="7CXE7jriAP4?si=SxQGPa4W00hdc1IT" />
      </>
    ),
    tools: ['Lua', 'Roblox Studio'],
    roleName: 'Programmer',
    links: [
      { text: 'Play', href: 'https://www.roblox.com/games/13875652550/Play-Cats-Tag' },
      {
        text: 'View Gameplay Video',
        href: 'https://www.youtube.com/watch?v=7CXE7jriAP4&ab_channel=OwletteKenz',
      },
    ],
    timeRange: '2024 May - August',
    image: '/assets/images/play-cats-tag-cover.png',
    tags: ['Team Project', 'Roblox', 'Lua', 'Roblox Studio', 'Internship', 'F84 Studio'],
  },
  {
    id: 14,
    order: -99,
    title: 'Into the Darkness',
    cardDesc_en:
      'A puzzle game where everything in the scene is hidden. Find your path to gems using light orbs.',
    cardDesc_zh: '解谜游戏：场景中的一切都被隐藏。召唤光球照亮道路，寻找宝石。',
    detailDescription_en: (
      <>
        A puzzle game where everything in the scene is hidden (transparent) by a self-made shader.
        The player can summon orbiting / kinematic / huge / static light orbs to illuminate the
        environment and interact with traps and mechanics, in pursue of mythical gems. Features a
        check-point system, jump-pads, using render targets as data storage for shaders, etc. All
        light orbs’ time left and effect radii will change the transparency of objects in the scene.
        <br />
        <YouTubeVideo link="YgVD6fI7ZWg?si=5GPqE2LPRZjY9y3S" />
      </>
    ),
    detailDescription_zh: (
      <>
        解谜游戏，场景中的一切由自制着色器隐藏（透明）。玩家可召唤环绕/受控（运动学）/巨型/静态光球来照亮环
        境、触发陷阱与机制，追寻神秘宝石。包含存档点系统、跳板、使用渲染目标作为着色器“数据容器”等特性。所有光
        球的剩余时间与作用半径都会影响场景中物体的透明度。
        <br />
        <YouTubeVideo link="YgVD6fI7ZWg?si=5GPqE2LPRZjY9y3S" />
      </>
    ),
    tools: ['Unreal', 'C++'],
    roleName: 'Solo Developer',
    links: [
      {
        text: 'Download Latest Build',
        href: 'https://drive.google.com/file/d/1voZyGl23TeeQa6uCyFwWBjam18u2Ec_x/view?usp=sharing',
      },
      { text: 'View Demo Video', href: 'https://youtu.be/YgVD6fI7ZWg' },
    ],
    timeRange: '2024 Feb - Now',
    image: '/assets/images/into-the-darkness-cover.png',
    tags: ['Personal Project', 'Unreal', 'C++', 'Shader', 'Minimap', 'Puzzle'],
  },
  {
    id: 15,
    order: -97,
    title: 'Crank Cannon',
    cardDesc_en:
      'A rogue-lite shooting game inspired by Vampire Survivor for the handheld console Playdate.',
    cardDesc_zh: 'Playdate 掌机上的类 Rogue 射击游戏，灵感来自 Vampire Survivor。',
    detailDescription_en: (
      <>
        The game features progressive difficulty and a simple level-up system. The upgrades include
        damage, shoot speed, bullet bounce, bullet penetration, knock-back power, extra exp, etc.
        The biggest challenge was the performance limitation. Playdate isn't a console for CPU heavy
        games—well, "CPU heavy" even though it's nothing in any modern PC. So I had to make best use
        of optimization techniques like pre-rendered images, object pooling, batch rendering, etc. I
        was a bit of a fool because it's best to make the game in C++, which is 10X faster than Lua.
        In the future, I might get back and continue working on the game, because it has a fun
        concept I'm passionate about.
        <br />
        Be aware that the build of the game is used for Playdate. You can sideload it if you have
        one, or download Playdate SDK and run the pdx folder in the Playdate Simulator.
        <br />
        <YouTubeVideo link="yRxvTdIcHKs?si=4aJu6fKMqUJzduG7" />
      </>
    ),
    detailDescription_zh: (
      <>
        游戏具有逐步提升的难度与简洁的升级系统。升级项包括伤害、射速、子弹弹跳、子弹穿透、击退强度、额外经验
        等。最大的挑战是性能限制：Playdate 并非为重 CPU 游戏而生——当然所谓“重”，放在现代 PC
        上不值一提。因此 我尽可能使用优化策略，如预渲染图像、对象池、批量渲染等。说实话，用 C++
        开发会更好（比 Lua 快 10 倍）， 日后我可能会回归继续开发，因为这个玩法我很喜欢。
        <br />
        注意：该构建用于 Playdate。你可以在真机上侧载，或安装 Playdate SDK 并在模拟器里运行 pdx
        文件夹。
        <br />
        <YouTubeVideo link="yRxvTdIcHKs?si=4aJu6fKMqUJzduG7" />
      </>
    ),
    tools: ['Playdate SDK', 'Lua'],
    roleName: 'Solo Developer',
    links: [
      {
        text: 'Download Latest Build',
        href: 'https://drive.google.com/file/d/1ozyU-hb8KPSZcywwGYdEbtaTO10mNZrp/view?usp=sharing',
      },
      { text: 'View Demo Video', href: 'https://youtu.be/yRxvTdIcHKs' },
    ],
    timeRange: '2024 Oct - Nov',
    image: '/assets/images/crank-cannon-cover.png',
    tags: ['Personal Project', 'Playdate SDK', 'Lua', 'Roguelite', 'Shooting'],
  },
  {
    id: 16,
    order: -98,
    title: 'Escape from Shawshank',
    cardDesc_en: 'A VR escape room game inspired by the movie "The Shawshank Redemption".',
    cardDesc_zh: '受电影《肖申克的救赎》启发的 VR 密室逃脱游戏。',
    detailDescription_en: (
      <>
        Has simple enemy AI (behavior tree). In the first level, the player (Andy) needs find their
        cell in the prison and avoid getting caught by the guards. In the second level, the player
        needs to hide from guards and use the lightning to see through darkness.
        <br />
        Please forgive me for the poor SFX uses. The guards are actually "monsters" so I picked some
        creepy sounds... Also, no build is currently available for download.
        <br />
        <YouTubeVideo link="LAg7x_IE-HM?si=8s5AUZkNlq0K_6mT" />
      </>
    ),
    detailDescription_zh: (
      <>
        具备简单的敌人
        AI（行为树）。第一关中，玩家（安迪）需要在监狱里找到自己的牢房，并避免被守卫抓住；第
        二关需要躲避守卫并利用闪电照亮黑暗。
        <br />
        请原谅音效的“惊悚”使用：守卫其实相当于“怪物”，所以我选了偏诡异的声音……目前暂无可下载的可执行构建。
        <br />
        <YouTubeVideo link="LAg7x_IE-HM?si=8s5AUZkNlq0K_6mT" />
      </>
    ),
    tools: ['Unreal'],
    roleName: 'Solo Developer',
    links: [{ text: 'View Demo Video', href: 'https://www.youtube.com/watch?v=LAg7x_IE-HM' }],
    timeRange: '2024 March - May',
    image: '/assets/images/escape-from-shawshank-cover.png',
    tags: ['Course Project', 'Unreal', 'VR', 'Escape Room', 'AI'],
  },
  {
    id: 16,
    order: 100,
    title: 'TopLand Web (in Chinese)',
    description: 'A web idle game inspired by my Minecraft MMORPG server, TopLand.',
    details: (
      <WorkDetail
        description={<>To be added...</>}
        tools={['Node.js']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: 'https://shadowck.github.io/TopLandWeb/',
          },
          {
            text: 'Repo',
            href: 'https://github.com/ShadowCK/TopLandWeb',
          },
        ]}
        timeRange="2024 April - May"
      />
    ),
    image: '/assets/images/topland-web-cover.png',
    tags: ['Personal Project', 'Web', 'Idle Game'],
  },
  {
    id: 17,
    order: -100000,
    title: 'Interstellar Drive',
    description: 'TBA',
    details: (
      <WorkDetail
        description={<>To be added...</>}
        tools={['Unreal']}
        roleName="Programmer, UX Designer"
        links={[
          {
            text: 'Play',
            href: '/',
          },
        ]}
        timeRange="2024 April - May"
      />
    ),
    image: 'https://placehold.co/600x450',
    tags: ['Capstone', 'Team Project', 'Unreal', 'Driving', 'Rhythm', 'Puzzle', 'Perforce'],
  },
  {
    id: 18,
    order: 100000,
    title: 'Save the Crush',
    description: 'TBA',
    details: (
      <WorkDetail
        description={<>To be added...</>}
        tools={['RPG Maker']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: '/',
          },
        ]}
        timeRange="2016"
      />
    ),
    image: 'https://placehold.co/600x450',
    tags: [
      'Personal Project',
      'RPG Maker XP',
      'RPG',
      'Storyline Branches',
      'Tower of the Sorcerer like',
    ],
  },
  {
    id: 19,
    order: 100000,
    title: 'New World',
    description: 'TBA',
    details: (
      <WorkDetail
        description={<>To be added...</>}
        tools={['Minecraft', 'Java', 'Spigot API', 'Forge API']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: '/',
          },
        ]}
        timeRange="2017 - 2021"
      />
    ),
    image: 'https://placehold.co/600x450',
    tags: ['Personal Project', 'MMORPG', 'Minecraft', 'Java'],
  },
  {
    id: 20,
    order: 100000,
    title: 'My Portfolio',
    description: 'Yes, this website.',
    details: (
      <WorkDetail
        description={<>To be added...</>}
        tools={['Node.js', 'Express']}
        roleName="Solo Developer"
        links={[
          {
            text: 'You are already here!',
            href: '/',
          },
        ]}
        timeRange="2023 Dec - Now"
      />
    ),
    image: 'https://placehold.co/600x450',
    tags: ['Personal Project', 'Web', 'Node.js', 'Express'],
  },
  {
    id: 21,
    order: -100,
    title: 'Backpack Go',
    cardDesc_en: 'A Backpack Hero like mobile game.',
    cardDesc_zh: '一款玩法类似 Backpack Hero 的手游。',
    detailDescription_en: (
      <>
        Contributed to designing and implementing items for combat. Implemented an indicator showing
        next stages. Implemented an on-rails (linear) tutorial system, featuring dynamic environment
        (mist and buildings), NPCs, dialogue, quests and smooth animation, boosting{' '}
        <b>Day 1 Retention from 29% to 35%</b>. Implemented a WeChat Game Club activity reward
        system, which made the game club posts rocket from less than <b>5 posts to 300 posts</b> a
        day when it released.
        <br />
        Note: The game is only available in China (Wechat, Douyin) and Canada (Google Play, App
        Store).
        <br />
        <YouTubeVideo link="NlaD7aWs3lA?si=Mu9znF9QR_BTYkle" />
      </>
    ),
    detailDescription_zh: (
      <>
        参与战斗物品的设计与实现；实现“下一关指示器”；构建“单轨（线性）教程系统”，包含动态环境（雾气、建筑）、
        NPC、对话、任务与顺滑动画，使 <b>次日留存从 29% 提升到 35%</b>
        。上线了“微信游戏圈”活动奖励系统，发帖量 从每日不足 <b>5 条激增至 300 条</b>。
        <br />
        注：游戏目前仅在中国（微信、抖音）与加拿大（Google Play、App Store）上架。
        <br />
        <YouTubeVideo link="NlaD7aWs3lA?si=Mu9znF9QR_BTYkle" />
      </>
    ),
    tools: ['Cocos Creator', 'TypeScript'],
    roleName: 'Programmer, Designer',
    links: [{ text: 'View Gameplay Video', href: 'https://www.youtube.com/watch?v=NlaD7aWs3lA' }],
    timeRange: '2024 May - August',
    image: '/assets/images/backpack-go-cover.jpg',
    tags: [
      'Team Project',
      'Cocos Creator',
      'TypeScript',
      'Mobile Game',
      'Internship',
      'Yoozoo Games',
    ],
  },
  {
    id: 22,
    order: -200,
    title: 'Grid Master',
    cardDesc_en: 'Local 1V1 shooting game for Triangle Game Jam.',
    cardDesc_zh: 'Triangle Game Jam 的本地 1V1 射击游戏。',
    detailDescription_en: (
      <>
        Local PVP shooting game for the one-week{' '}
        <a
          href="https://entrepreneurship.ncsu.edu/trianglegamejam/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Triangle Game Jam
        </a>{' '}
        (Epic x Duke x UNC x NC State), twisting tic-tac-toe into capturing 9 dimensions. As Lead
        Programmer and Designer, implemented shooting, auto aim, portals, power-ups, game overlay,
        crosshair and mini-map. Made initial game design and sound choices. Devoted passionate 115
        hours. The game won Best Sound Design Award and Honorable Mention for Best Game Award.
        <br />
        <YouTubeVideo link="NSNpAHGLr-o?si=DLGEfppAmb9IgZsp" />
      </>
    ),
    detailDescription_zh: (
      <>
        为期一周的{' '}
        <a
          href="https://entrepreneurship.ncsu.edu/trianglegamejam/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Triangle Game Jam
        </a>
        （Epic × Duke × UNC × NC
        State）参赛作品：把“三连”规则扭转为“九宫格维度争夺”。作为主程兼主设，实
        现了射击、自瞄、传送门、增益道具、比赛叠加层、准星与小地图；完成了初版玩法与声音方案。热情投入
        115 小时。 本作获得“最佳音效设计”与“最佳游戏”提名（荣誉提名）。
        <br />
        <YouTubeVideo link="NSNpAHGLr-o?si=DLGEfppAmb9IgZsp" />
      </>
    ),
    tools: ['Unreal', 'Perforce'],
    roleName: 'Lead Programmer, Lead Designer',
    links: [
      { text: 'Itch.io', href: 'https://kerrylu.itch.io/gridmaster' },
      { text: 'View Gameplay Video', href: 'https://www.youtube.com/watch?v=NSNpAHGLr-o' },
    ],
    timeRange: '2025 Feb 23 - March 1',
    image: '/assets/images/grid-master-cover.png',
    tags: [
      'Award Winning',
      'Best Sound Design',
      'Honorable Mention',
      'Triangle Game Jam',
      'Team Project',
      'Team of 6',
      'Unreal',
      'Perforce',
    ],
  },
  // More works...
];

function PortfolioApp() {
  const [selected, setSelected] = useState(() => new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Subscribe to language changes so texts re-render on toggle
  const { lang } = useI18n();

  const groupedTags = useMemo(() => {
    const tagSet = new Set();
    portfolioWorksData.forEach((work) =>
      (work.tags || []).forEach((tag) => tagSet.add(String(tag))),
    );
    // Exclude tags by contains (ci) and exact (cs)
    const all = Array.from(tagSet).filter((tag) => {
      const lower = String(tag).toLowerCase();
      const byContains = EXCLUDE_CONTAINS.some(
        (substr) => substr && lower.includes(substr.toLowerCase()),
      );
      const byExact = EXCLUDE_MATCH.includes(String(tag));
      return !(byContains || byExact);
    });

    // Build groups with fixed priority order, then alphabetical for the rest
    const takeInOrder = (priorityList, pool) => {
      const taken = [];
      const restSet = new Set(pool);
      priorityList.forEach((p) => {
        if (restSet.has(p)) {
          taken.push(p);
          restSet.delete(p);
        }
      });
      const remaining = Array.from(restSet).sort((a, b) => a.localeCompare(b));
      return { list: taken.concat(remaining), remainingSet: restSet };
    };

    // Meta
    const metaPool = all.filter((tag) => META_PRIORITY.includes(tag));
    const meta = takeInOrder(META_PRIORITY, metaPool).list;

    // Engine & Language (combined)
    const ENGINE_LANG_PRIORITY = [...ENGINE_PRIORITY, ...LANGUAGE_PRIORITY];
    const engineLangPool = all.filter((tag) => ENGINE_LANG_PRIORITY.includes(tag));
    const engineLang = takeInOrder(ENGINE_LANG_PRIORITY, engineLangPool).list;

    // Gameplay
    const gameplayPool = all.filter((tag) => GAMEPLAY_PRIORITY.includes(tag));
    const gameplay = takeInOrder(GAMEPLAY_PRIORITY, gameplayPool).list;

    // Tech
    const techPool = all.filter((tag) => TECH_PRIORITY.includes(tag));
    const tech = takeInOrder(TECH_PRIORITY, techPool).list;

    // Others = not in any of the above
    const known = new Set([...meta, ...engineLang, ...gameplay, ...tech]);
    const others = all.filter((tag) => !known.has(tag)).sort((a, b) => a.localeCompare(b));

    return { meta, engineLang, gameplay, tech, others };
  }, []);

  const toggleTag = (tag) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setSelected(next);
  };

  const clearAll = () => setSelected(new Set());

  const filtered = useMemo(() => {
    if (!selected.size) return portfolioWorksData;
    return portfolioWorksData.filter((w) =>
      (w.tags || []).some((tag) => selected.has(String(tag))),
    );
  }, [selected]);

  // Manage global pusher dim state and click-to-close
  useEffect(() => {
    const pusher = document.getElementById('global-pusher');
    if (!pusher) return undefined;
    if (sidebarOpen) pusher.classList.add('dimmed');
    else pusher.classList.remove('dimmed');
    const onPusherClick = () => {
      if (sidebarOpen) setSidebarOpen(false);
    };
    pusher.addEventListener('click', onPusherClick);
    return () => {
      pusher.removeEventListener('click', onPusherClick);
    };
  }, [sidebarOpen]);

  // Toggle 'visible' class on the real sidebar element (#sidebar-root)
  useEffect(() => {
    const sidebarEl = document.getElementById('sidebar-root');
    if (!sidebarEl) return;
    if (sidebarOpen) sidebarEl.classList.add('visible');
    else sidebarEl.classList.remove('visible');
  }, [sidebarOpen]);

  // Show left-edge handle only when the inline Filters button has fully scrolled above the viewport
  // Dual guard: require (1) fully above (bottom <= 0), and (2) not intersecting by both IO and math checks
  const inlineFiltersRef = useRef(null);
  const [showHandle, setShowHandle] = useState(false);
  useEffect(() => {
    const el = inlineFiltersRef.current;
    if (!el) return undefined;
    const lastIntersectingRef = { current: true };
    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      // Any overlap with viewport (math fallback): true if any part is visible
      const intersectsMath = !(
        rect.bottom <= 0 ||
        rect.top >= vh ||
        rect.right <= 0 ||
        rect.left >= vw
      );
      // Only when element's bottom crosses the top edge (fully above)
      const fullyAbove = rect.bottom <= 0;
      const shouldShow = fullyAbove && !lastIntersectingRef.current && !intersectsMath;
      setShowHandle(shouldShow);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]) return;
        lastIntersectingRef.current = entries[0].isIntersecting; // true if any part is visible
        compute();
      },
      { root: null, threshold: 0 },
    );
    io.observe(el);

    window.addEventListener('resize', compute, { passive: true });
    window.addEventListener('scroll', compute, { passive: true });
    compute();

    return () => {
      io.disconnect();
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute);
    };
  }, []);

  return (
    <>
      {(() => {
        const rows = [
          { key: 'meta', title: t('meta'), list: groupedTags.meta },
          { key: 'engineLang', title: t('engine_language'), list: groupedTags.engineLang },
          { key: 'gameplay', title: t('gameplay'), list: groupedTags.gameplay },
          { key: 'tech', title: t('tech'), list: groupedTags.tech },
          { key: 'others', title: t('others'), list: groupedTags.others },
        ];
        const visibleRows = rows.filter((r) => r.list && r.list.length > 0);
        const sidebarMount = document.getElementById('sidebar-root') || document.body;
        if (!sidebarMount) return null;
        return createPortal(
          <>
            <div className="item">
              <div className="header">{t('filters')}</div>
              <div className="menu">
                <button
                  type="button"
                  className="ui basic fluid button"
                  onClick={() => setSidebarOpen(false)}
                >
                  {t('close')}
                </button>
              </div>
            </div>
            {visibleRows.map((r, idx) => (
              <div className="item" key={r.key}>
                <div className="header">{r.title}</div>
                <div className="menu" title={`${r.title} tags`}>
                  {idx === 0 && (
                    <div
                      className={`item ${selected.size === 0 ? 'active' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={clearAll}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? clearAll() : null)}
                      title="Show all works"
                    >
                      {t('all')}
                    </div>
                  )}
                  {r.list.map((tag) => (
                    <div
                      key={tag}
                      className={`item ${selected.has(tag) ? 'active' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleTag(tag)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' || e.key === ' ' ? toggleTag(tag) : null
                      }
                      title={`Filter: ${tTag(tag)}`}
                    >
                      {tTag(tag)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>,
          sidebarMount,
        );
      })()}

      {!sidebarOpen && showHandle && (
        <button
          type="button"
          className={`ui circular icon button filters-handle ${showHandle ? 'visible' : ''}`}
          aria-label="Open filters"
          title={t('open_filters')}
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(true);
          }}
        >
          <i className="filter icon" />
        </button>
      )}

      <div className="ui basic segment filters-row">
        <div className="left">
          <button
            type="button"
            className="ui icon button filters-inline"
            ref={inlineFiltersRef}
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(true);
            }}
            title={t('open_filters')}
          >
            <i className="filter icon" /> {t('filters')}
          </button>
        </div>
        <div className="middle">
          {selected.size > 0 && (
            <div
              className="selected-tags-scroll ui labels"
              role="list"
              aria-label={t('selected_tags')}
            >
              {Array.from(selected).map((tag) => (
                <div
                  key={tag}
                  className="ui label"
                  role="button"
                  tabIndex={0}
                  title={`Selected: ${tTag(tag)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTag(tag);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleTag(tag);
                    }
                  }}
                >
                  {tTag(tag)}
                  <i className="delete icon" aria-hidden="true" />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="right">
          {selected.size > 0 && (
            <button
              type="button"
              className="ui basic button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              title={t('clear_all')}
            >
              {t('clear_all')}
            </button>
          )}
        </div>
      </div>

      <div className="ui three stackable cards" aria-live="polite">
        {filtered
          .slice()
          .sort((a, b) => a.order - b.order || 0)
          .map((work) =>
            (() => {
              const cardDesc =
                lang === 'zh'
                  ? work.cardDesc_zh || work.description
                  : work.cardDesc_en || work.description;
              const detailsNode =
                work.detailDescription_en || work.detailDescription_zh ? (
                  <WorkDetail
                    description={
                      lang === 'zh' ? work.detailDescription_zh : work.detailDescription_en
                    }
                    tools={work.tools}
                    roleName={work.roleName}
                    links={work.links}
                    timeRange={work.timeRange}
                  />
                ) : (
                  work.details
                );
              return (
                <PortfolioWork
                  key={`${work.id}-${work.title}`}
                  id={work.id}
                  title={work.title}
                  description={cardDesc}
                  details={detailsNode}
                  image={work.image}
                  tags={work.tags}
                />
              );
            })(),
          )}
      </div>
    </>
  );
}

window.onload = () => {
  const container = document.getElementById('portfolio-root');
  const root = createRoot(container);
  root.render(<PortfolioApp />);
  // Mount profile carousel in masthead
  const carouselNode = document.getElementById('profile-carousel-root');
  if (carouselNode) {
    const images = [
      { src: '/assets/images/me-1.jpg', alt: 'Photo of me' },
      { src: '/assets/images/me-2.jpg', alt: 'Photo of me' },
      { src: '/assets/images/me-3.jpg', alt: 'Photo of me' },
    ];
    const carouselRoot = createRoot(carouselNode);
    carouselRoot.render(
      <Carousel images={images} autoPlay interval={4000} circular showIndicators size="large" />,
    );
  }
};

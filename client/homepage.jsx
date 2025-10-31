import { useEffect, useMemo, useRef, useState } from 'react';
import Clarity from '@microsoft/clarity';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { PortfolioWork, WorkDetail, YouTubeVideo, Carousel } from './components.jsx';
import './theme.js';

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
  'SMFL',
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
    description: 'An idle game where you play as an RIT student.',
    details: (
      <WorkDetail
        description={`This was originally a course project for IGME-235, "Intro to Game Web Tech" - essentailly a web development course. I decided to continue working on it after the course ended, but only for a couple of weeks. I was quite a beginner at web development so my skills limited my ability to implement more features. I might come back to this project in the future.`}
        tools={['HTML', 'CSS', 'JavaScript', 'Howler.js']}
        roleName="Solo Developer"
        links={[
          { text: 'Play', href: 'https://shadowck.github.io/RIT-Idle/' },
          { text: 'Repo', href: 'https://github.com/ShadowCK/RIT-Idle' },
        ]}
        timeRange="2022 December - 2023 January"
      />
    ),
    image: '/assets/images/rit-idle-cover.png',
    tags: ['Course Project', 'Web', 'Idle Game', 'Local Storage', 'HTML/CSS/JS'],
  },
  {
    id: 2,
    order: 6,
    title: 'Lazy Garden',
    description: `A clicker/idle game. Grow flowers in your grandpa's garden and earn money.`,
    details: (
      <WorkDetail
        description={
          <>
            A course project made during my first semester at RIT. Fun fact: I wasn't accepted into
            the Game Design and Development program in the first place, because I applied too late.
            I was redirected to the New Media Interactive Development program instead. I was able to
            transfer to the Game Design and Development program after my first semester. And this
            project was made during that semester for the course IGME.101 - "Interact Des & Alg Prob
            Solv I", one of the 3-course sequence that the NMID students have to take. I enjoyed{' '}
            <a
              href="https://www.rit.edu/directory/wmhics-w-michelle-harris"
              target="_blank"
              rel="noopener noreferrer"
            >
              Prof. Harris
            </a>
            ' lecture and had fun with p5.js. For the final project, we were asked to make "Targets"
            and "Influencers" in a p5.js scene. I played a lot of idle games over the past 6, 7
            years so I decided to make such a game, in which you can technically idle it (however
            the idle gameplay wasn't the focus) or manually command your workers. My biggest
            accomplishment was the waypoint system. Hold shift to place waypoints and view the path.
            The workers will follow the path and do the work.
          </>
        }
        tools={['P5.js', 'Aseprite']}
        roleName="Solo Developer"
        links={[
          { text: 'Play', href: 'https://shadowck.github.io/Lazy-Garden/' },
          { text: 'Repo', href: 'https://github.com/ShadowCK/Lazy-Garden' },
        ]}
        timeRange="2021 November"
      />
    ),
    image: '/assets/images/lazy-garden-cover.png',
    tags: ['Course Project', 'Web', 'Clicker Game', 'Idle Game', 'p5.js', 'Aseprite'],
  },
  {
    id: 3,
    order: 11,
    title: 'Pong Hub',
    description: `Multiplayer Pong game with fun mechanics.`,
    details: (
      <WorkDetail
        description={
          <>
            This was the final project for the advanced elective course, IGME-430, 'Rich Media Web
            App Development II.' My passion for this project was so immense that I worked on it
            continuously for ten days, dedicating any spare time I had. The commit history in the
            Git repo can attest to this. I felt endlessly energized as the project was incredibly
            fascinating, employing different engines for the frontend and backend: Phaser and
            Matter.js. It featured numerous updates and edge case handling to enhance user
            experience. Crucially, the basic gameplay of Pong is simple, which allowed me to
            continuously add and refine new gameplay elements without getting bogged down in complex
            implementations. The app uses MongoDB for user data storage and Redis for session
            storage. For gameplay, it employs Socket.io to synchronize the game state between
            clients and the server. I also implemented a chat system that retains recent messages
            across server restarts when players join. Moreover, the app features an item store to
            showcase the profit model.
            <br />
            In the future, I plan to make the following improvements to the app:
            <ol className="ml-4">
              <li>
                Add more gameplay mechanics, like player levels and in-game currency earned through
                scoring. Players can rotate their paddles to strike the ball, but this might be less
                convenient for mobile users.
              </li>
              <li>
                Implement a spectator mode to avoid unbalanced player numbers on each team. This
                would ensure that players join the game simultaneously rather than one at a time.
              </li>
              <li>Create user info pages.</li>
              <li>Add a leaderboard with pagination and a search function.</li>
              <li>
                Make player names in the chat window clickable, opening their user info page. These
                pages should also be accessible through the leaderboard. Introduce an inventory
                system and item drops when players score. The items would have a Diablo-like feel,
                with more stats added to increase the variety of items.
              </li>
            </ol>
          </>
        }
        tools={[
          'Node.js',
          'Express',
          'React',
          'Socket.io',
          'Matter.js',
          'Phaser',
          'MongoDB',
          'Redis',
        ]}
        roleName="Solo Developer"
        links={[
          { text: 'Play', href: 'https://pong-hub-afa594aad9a7.herokuapp.com/' },
          { text: 'Repo', href: 'https://github.com/ShadowCK/Pong-Hub' },
        ]}
        timeRange="2023 Nov 30 - Dec 11"
      />
    ),
    image: '/assets/images/pong-hub-cover.png',
    tags: [
      'Course Project',
      'Web',
      'Node.js',
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
    description: 'A refactored, more robust version of the SkillAPI Editor.',
    details: (
      <WorkDetail
        description={
          <>
            This is a passion project I had been dreaming of for years. SkillAPI is the cornerstone
            plugin of my Minecraft RPG servers, New World and Top Land. The developer, an alumnus of
            RIT, inspired my college choice. I discovered his RIT connection through the plugin’s
            license, which listed his real name, leading me to his LinkedIn page. At the time, I was
            deciding between computer science and game design & development for my college major.
            Learning that he graduated from RIT's game design & development program thrilled me. His
            work with SkillAPI, once the premier RPG plugin, its well-structured code, and his
            active role in the community, offering help and accepting suggestions, have earned my
            deepest respect. Though we've never met, I consider him a mentor of sorts, and I'm now
            following in his footsteps, hoping to meet him one day.
            <br />
            As for the project, I made 196 commits in 18 days, which was intense! I recall working
            non-stop for 12 hours a day during the Thanksgiving break. The experience was
            exhilarating, and the payoff was worth it. I transformed the outdated editor, parts of
            which predated ES6, into a modern, robust, and extensible web application. I added
            features and enhanced the UI/UX with innovations like Zen Mode, Compact Mode, and
            component comments and tags. The original design required clicking into each component
            to edit or view details; functional, yet cumbersome for quick checks. I prototyped a
            preview window that was quite effective, but the tags and comments system proved to be
            even better—more lightweight and intuitive.
            <br />I also introduced Pinyin Sort to accommodate the plugin's popularity within the
            Chinese Minecraft community, a nod to my own heritage. But the crowning achievement was
            the save system overhaul. The original editor relied on DOM-related functions to update
            skill data, an approach that was overkill for saving purposes since the DOM is merely
            for data display. My no-DOM version of these functions delivered astounding results! The
            'Backup All Data' button used to be a pain point. Years ago, while actively updating the
            New World server with over 200 skills, saving them in bulk after a single edit was
            time-consuming. It meant waiting up to 30 seconds for 80 skills or even 5 minutes for
            all, on my old PC with a 7700k CPU. I used to take breaks during this time. Now, even
            with a 12700, 80 skills take only 4 seconds—and just 15 seconds during garbage
            collection. Still, I aimed for better. The performance is now consistently fast,
            clocking in at only 30ms for those same 80 skills! That's incredibly satisfying!
            <br />
            Other exciting features include the ability to copy paste the active component across
            skills, simply using Ctrl+C and Ctrl+V. The active component is highlighted in the
            builder form (via the "Edit Effects" button). In addition, I wrote a pack.js script
            using Archiver to pack only necessary files as a dist build. That way I can easily send
            the editor to my friends.
          </>
        }
        tools={['Node.js', 'Archiver', 'pinyin']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Editor v0.2.9',
            href: 'https://people.rit.edu/~zj5148/skillapi-editor-returns-0.2.9/',
          },
          {
            text: 'Original Editor',
            href: 'https://eniripsa96.github.io/SkillAPI/',
          },
          {
            text: 'Repo',
            href: 'https://github.com/ShadowCK/SkillAPIEditorReturns',
          },
        ]}
        timeRange="2023 Nov 13 - Nov 30. To be continued..."
      />
    ),
    image: '/assets/images/skillapi-editor-cover.png',
    tags: ['Personal Project', 'Web', 'Node.js', 'Archiver', 'pinyin', 'Skill Editor'],
  },
  {
    id: 5,
    order: 102,
    title: 'myQuizzes',
    description: 'A web app for taking quizzes from the Open Trivia Database.',
    details: (
      <WorkDetail
        description={`A course project for IGME-235, 'Intro to Game Web Tech' - essentially a web development course. This was the first web app I ever made, and it remains one of my proudest works. I dedicated a considerable amount of time to refining its user experience and learned a great deal about web development in the process. The app features a sound manager that supports sound variants, leveraging the basic functionality of Howler.js. The UI is smooth and dynamic, with almost every action accompanied by visual transitions and sound feedback. It boasts a leaderboard using the Local Storage API, featuring a well-thought-out scoring system, a sidebar for question navigation, and a settings panel that appears when you hover over its exposed edge (when taking a quiz). At that time, I didn’t know any CSS frameworks, so I wrote all the CSS rules myself - a whopping 700 lines! The main.js file was extensive too, with 1150 lines, mainly because I consolidated most functions into one script. This course marked the beginning of my web development journey and my first serious foray into JavaScript. However, my passion for these projects was stronger than ever. I knew nothing and was eager to try everything. If you ask me to write 700 lines of CSS now, I'd probably kill myself. It's fascinating, isn't it? Looking back at our childhood, we were thrilled by any simple game, even things that can hardly be called games. But now, we've become so selective, so experienced, so mature, and perhaps, a bit more jaded.`}
        tools={['HTML/CSS/JS', 'Howler.js', 'Open Trivia Database']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: 'https://people.rit.edu/~zj5148/235/project2/',
          },
        ]}
        timeRange="2022 Nov 9 - Dec 15"
      />
    ),
    image: '/assets/images/my-quizzes-cover.png',
    tags: ['Course Project', 'Web', 'HTML/CSS/JS', 'Howler.js', 'Open Trivia Database'],
  },
  {
    id: 6,
    order: 7,
    title: 'Lost Castle',
    description: `A 3D scene of a lost castle in the void, replicating the first dungeon of my Minecraft MMORPG server, "New World".`,
    details: (
      <WorkDetail
        description={`The final project for IGME-219, "3D Animation and Asset Production". The goal was to build a 3D scene with original assets. I decided to recreate the first dungeon of my Minecraft MMORPG server, "New World". I used Maya to make models for the castle and props, and Substance Painter to texture them. I added post processing in Unity so that the scene looks more appealing. I also made a script for the floating rocks so they move up and down, and pause when the player stands on them. However, the castle's model was not cleaned up (was a headache to me), causing its UV map to be messed up.`}
        tools={['Maya', 'Substance Painter', 'Unity', 'C#']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Download Final Build',
            href: 'https://drive.google.com/file/d/14w7MyWAlPjDO5PeJgKMpqAOkNCymaKxs/view?usp=sharing',
          },
          {
            text: 'View Floor Plan',
            href: '/assets/images/lost-castle-floor-plan.png',
          },
          {
            text: 'View Mood Board',
            href: '/assets/images/lost-castle-mood-board.png',
          },
          {
            text: 'Download Written Plan',
            href: '/assets/lost-castle-written-plan.docx',
          },
        ]}
        timeRange="2023 Nov 1 - Dec 10"
      />
    ),
    image: '/assets/images/lost-castle-cover.png',
    tags: ['Course Project', 'Maya', 'Substance Painter', 'Unity', 'C#'],
  },
  {
    id: 7,
    order: 4,
    title: 'Mecha Angel',
    description: `A shoot'em up game. Fight against the evil forces with your aircraft.`,
    details: (
      <WorkDetail
        description={`A course project for IGME-202, "Interactive Media Development." We were tasked with creating a shmup (shoot 'em up) game. My original concept was ambitious: a side-scrolling shooter featuring two distinct modes – a gunner mode (reminiscent of Contra) and an aircraft mode, inspired by the Viking unit from StarCraft II. In this design, players would collect energy cores to temporarily switch to the more powerful and score-heavy aircraft mode. The final showdown was planned to be an intense battle in aircraft mode (without the need for energy cores at this point). The two modes were designed to offer varied gameplay experiences – one focusing on survival and collection, the other on destruction and scoring, with one mode featuring auto-fire and the other allowing for manual, free-directional shooting. However, due to time constraints and other course commitments, the project's scope was significantly reduced. The final version featured only the aircraft mode and omitted the boss fight. Nonetheless, I successfully implemented several key features: five enemy types, a dynamic health bar, a seamlessly scrolling background, two difficulty levels, enemy waves, a scoring system, and level-up enhancements triggered at specific score milestones. Additionally, I introduced a unique mechanic where bullets can destroy each other, enhancing the gameplay strategy. Meteors were also added as an obstacle, offering a tactical element by blocking enemy bullets.`}
        tools={['Unity', 'C#']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: 'https://igme-202-2221.github.io/project-1-ShadowCK/build/',
          },
          {
            text: 'Repo',
            href: 'https://github.com/IGME-202-2221/project-1-ShadowCK',
          },
        ]}
        timeRange="2022 Sept 8 - Oct 16"
      />
    ),
    image: '/assets/images/mecha-angel-cover.png',
    tags: ['Course Project', 'Unity', 'C#'],
  },
  {
    id: 8,
    order: 12,
    title: 'Zhao Drift',
    description: `Send and receive messages in the form of drifting bottles.`,
    details: (
      <WorkDetail
        description={`A course project for the advanced elective course, IGME-430, "Rich Media Web App Development II." Initially, I aimed to create an app for private chats with my friends, featuring customizable options, and thus named it 'Zhao Chat.' However, I later pivoted to a more intriguing concept of chatting with random people in an aesthetically appealing experience. My professor commented, 'This project almost feels like an art piece. The ability to either destroy the bottle or send it back into the pool is really cool and interesting.' And I wholeheartedly agree. The concept is engaging, and the UI design is beautiful. I'm proud of this project. Given more time, I would refactor it to use Express, React, and Socket.io, and add additional features like user authentication, the ability to add comments to bottles, and user-generated pools (in contrast to the public one).`}
        tools={['Node.js', 'Bulma', 'Webpack', 'CircleCI', 'ESLint', 'Underscore']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: 'https://zhao-chat-06a0fdd7b35c.herokuapp.com/',
          },
          {
            text: 'Repo',
            href: 'https://github.com/ShadowCK/Zhao-Chat',
          },
        ]}
        timeRange="2023 Oct 8 - Oct 30"
      />
    ),
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
    description: `An audio visualizer with balls and perlin noise.`,
    details: (
      <WorkDetail
        description={`Human auditory perception of frequency is based on a logarithmic function. In this visualization, the columns representing frequency within the central circular ring are arranged in accordance with this phenomenon. Additionally, the width of the columns for lower frequencies is larger, reflecting the human ear's increased sensitivity to these frequencies. The color of the ring is determined by Perlin noise, creating a smooth gradient. The balls are another representation of volumes on the frequency spectrum. Unlike the ring, they are aligned linearly, with colors ranging from hue 0 to 360. The application also implements a beat detection algorithm. The ring and balls react to the beat, creating a dynamic and interesting visual effect that you will notice when you try it out. The app includes audio nodes and toggleable visual effects (by modifying the pixels of the canvas' imageData), enhancing the experience. Unfortunately, due to time constraints, I wasn't able to implement a file upload system to support playing local music. I had also originally planned to support the Spotify API.`}
        tools={['Canvas', 'Web Audio', 'HTML/CSS/JS', 'ES6 Module']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Play',
            href: 'https://people.rit.edu/~zj5148/330/jin-z-hw2/',
          },
        ]}
        timeRange="2023 Feb 17 & Mar 22 (two days)"
      />
    ),
    image: '/assets/images/balldio-visualizer-cover.png',
    tags: ['Course Project', 'Web', 'Canvas', 'Web Audio', 'Perlin Noise', 'Audio Node'],
  },
  {
    id: 10,
    order: 5,
    title: `Illostath's Legacy`,
    description: `Casual game. Explore the Ethshar world as an alchemist.`,
    details: (
      <WorkDetail
        description={
          <>
            This is a course project for IGME-320, "Game Design and Development II". We used Scrum
            and Trello Board to manage the project. It proved to be very useful and motivating. I
            was one of the two programmers in the team, responsible for the item management system,
            sound system, debugging and QoL improvements. I also made a video trailer for the game.
            I enjoyed working with the team and learned that Unity sucks. It's just too heavy for a
            tiny game. Next time I'll try Godot or Unreal Engine. I wish I had more contribution to
            this game, but I decitated most of my time to Zhao Drift and Pong Hub.
            <br />
            Note: as this is a team project, I am not able to share the source code.
            <br />
            <YouTubeVideo link="P4Q6Swxffjw?si=0HZHOoZQzoy1m6fz" />
          </>
        }
        tools={['Unity', 'C#', 'Vegas Pro', 'Trello Board', 'Scrum']}
        roleName="Programmer, Video Editor"
        links={[
          {
            text: 'Download Final Build',
            href: 'https://drive.google.com/file/d/1KGOtN-KP6sgRM9KLqqYRqIFWcsf5vKVO/view?usp=sharing',
          },
          {
            text: 'Video Trailer',
            href: 'https://www.youtube.com/watch?v=P4Q6Swxffjw&ab_channel=ZhaoJin',
          },
        ]}
        timeRange="2023 September - 2023 December"
      />
    ),
    image: '/assets/images/illostath-legacy-cover.png',
    tags: ['Course Project', 'Team Project', 'Team of 5', 'Unity', 'C#'],
  },
  {
    id: 11,
    order: 10001,
    title: 'Cat Calamity',
    description: `A tabletop card game. Play as a cat after the human apocalypse. The world collapses each turn. Survive and be the last cat standing.`,
    details: (
      <WorkDetail
        description={
          <>
            All of us were actively involved in the design process, engaging in intense discussions
            about the theme, gameplay, and mechanics, with regular weekly meetings for iteration.
            However, the sections in the design document listing responsible members for each part
            are not entirely accurate. This is because, as new content was added, the listed names
            weren't updated. In essence, every team member significantly contributed to most aspects
            of the project, except for the art. The lovely art was done by{' '}
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
            <a
              href="https://www.linkedin.com/in/petercat/"
              target="_blank"
              rel="noopener noreferrer"
            >
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
        }
        tools={['Brain', 'Heart', 'Soul']}
        roleName="Game Designer"
        links={[
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
        ]}
        timeRange="2023 January - May"
      />
    ),
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
    description:
      'Conquer the gravity and collect gems in two difficulties. Accuracy is a key to high score.',
    details: (
      <WorkDetail
        description={
          <>
            As a course project, this mini game was developed in C++ using SMFL and Box2D, with a
            dynamic camera, custom font, text display in typing fashion, BGMs and sound effects. The
            game itself is a simple snake game with a twist: the snake is affected by gravity (and
            will not grow). The game features game options such as two difficulty levels and gem
            count, where in hell mode the player cannot see their snake when close to the gem. The
            game also has a score system mainly based on key presses, time elapsed and accuracy, the
            accuracy decreases when the snake moves away from the gem.
            <br />
            Note: There is no executable for this mini game. Neither is the source code available
            due to course policy. However, a demo video is provided to get a better understanding of
            the game.
            <br />
            <YouTubeVideo link="XSzfin-ZCqM?si=4HNPptaetnpVAkcW" />
          </>
        }
        tools={['C++', 'SMFL', 'Box2D']}
        roleName="Solo Developer"
        links={[
          {
            text: 'View Demo Video',
            href: 'https://youtu.be/XSzfin-ZCqM',
          },
        ]}
        timeRange="2023 December"
      />
    ),
    image: '/assets/images/graphical-snake-cover.png',
    tags: ['Course Project', 'C++', 'SMFL', 'Box2D', 'Dynamic Camera'],
  },
  {
    id: 13,
    order: -300,
    title: 'Play Cats: Tag!',
    description: 'A Roblox game where you play as a cat and play tag with other players.',
    details: (
      <WorkDetail
        description={
          <>
            Refactored the movement system and buff system to allow stack-able effects such as slow
            and speed-up at the same time. Cooperated with our UI designer to implement various UIs
            such as a 3D nameplate. The biggest challenge was using coroutines to implement the
            tagging/tagged visuals as it has various moving components that relies on delays. Also
            added VFX and SFX for many cats. The gameplay video includes the nameplate and tagging /
            tagged transition UI.
            <br />
            One week after adding the tagging / tagged transition UI, VFX and SFX to each cat, the{' '}
            <b>DAU increased from 3200 to 5600</b>.
            <br />
            The game amassed over <b>1 million visits</b> within two months without any promotions.
            <br />
            <YouTubeVideo link="7CXE7jriAP4?si=SxQGPa4W00hdc1IT" />
          </>
        }
        tools={['Lua', 'Roblox Studio']}
        roleName="Programmer"
        links={[
          {
            text: 'Play',
            href: 'https://www.roblox.com/games/13875652550/Play-Cats-Tag',
          },
          {
            text: 'View Gameplay Video',
            href: 'https://www.youtube.com/watch?v=7CXE7jriAP4&ab_channel=OwletteKenz',
          },
        ]}
        timeRange="2024 May - August"
      />
    ),
    image: '/assets/images/play-cats-tag-cover.png',
    tags: ['Team Project', 'Roblox', 'Lua', 'Roblox Studio', 'Internship', 'F84 Studio'],
  },
  {
    id: 14,
    order: -99,
    title: 'Into the Darkness',
    description:
      'A puzzle game where everything in the scene is hidden. Find your path to gems using light orbs.',
    details: (
      <WorkDetail
        description={
          <>
            A puzzle game where everything in the scene is hidden (transparent) by a self-made
            shader. The player can summon orbiting / kinematic / huge / static light orbs to
            illuminate the environment and interact with traps and mechanics, in pursue of mythical
            gems. Features a check-point system, jump-pads, using render targets as data storage for
            shaders, etc. All light orb’s time left and effect radii will change the transparency of
            objects in the scene.
            <br />
            <YouTubeVideo link="YgVD6fI7ZWg?si=5GPqE2LPRZjY9y3S" />
          </>
        }
        tools={['Unreal', 'C++']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Download Latest Build',
            href: 'https://drive.google.com/file/d/1voZyGl23TeeQa6uCyFwWBjam18u2Ec_x/view?usp=sharing',
          },
          {
            text: 'View Demo Video',
            href: 'https://youtu.be/YgVD6fI7ZWg',
          },
        ]}
        timeRange="2024 Feb - Now"
      />
    ),
    image: '/assets/images/into-the-darkness-cover.png',
    tags: ['Personal Project', 'Unreal', 'C++', 'Shader', 'Minimap', 'Puzzle'],
  },
  {
    id: 15,
    order: -97,
    title: 'Crank Cannon',
    description:
      'A rogue-lite shooting game inspired by Vampire Survivor for the handheld console Playdate.',
    details: (
      <WorkDetail
        description={
          <>
            The game features progressive difficulty and a simple level-up system. The upgrades
            include damage, shoot speed, bullet bounce, bullet penetration, knock-back power, extra
            exp, etc. The biggest challenge was the performance limitation. Playdate isn't a console
            for CPU heavy games - well, "CPU heavy" even though it's nothing in any modern PC. So I
            had to make best use of optimization techniques like pre-rendered images, object
            pooling, batch rendering, etc. I was a bit of a fool because it's best to make the game
            in C++, which is 10X faster than Lua. In the future, I might get back and continue
            working on the game, because it has a fun concept I'm passionate about.
            <br />
            Be aware that the build of the game is used for Playdate. You can sideload it if you
            have one, or download Playdate SDK and run the pdx folder in the Playdate Simulator.
            <br />
            <YouTubeVideo link="yRxvTdIcHKs?si=4aJu6fKMqUJzduG7" />
          </>
        }
        tools={['Playdate SDK', 'Lua']}
        roleName="Solo Developer"
        links={[
          {
            text: 'Download Latest Build',
            href: 'https://drive.google.com/file/d/1ozyU-hb8KPSZcywwGYdEbtaTO10mNZrp/view?usp=sharing',
          },
          {
            text: 'View Demo Video',
            href: 'https://youtu.be/yRxvTdIcHKs',
          },
        ]}
        timeRange="2024 Oct - Nov"
      />
    ),
    image: '/assets/images/crank-cannon-cover.png',
    tags: ['Personal Project', 'Playdate SDK', 'Lua', 'Roguelite', 'Shooting'],
  },
  {
    id: 16,
    order: -98,
    title: 'Escape from Shawshank',
    description: 'A VR escape room game inspired by the movie "The Shawshank Redemption".',
    details: (
      <WorkDetail
        description={
          <>
            Has simple enemy AI (behavior tree). In the first level, the player (Andy) needs find
            their cell in the prison and avoid getting caught by the guards. In the second level,
            the player needs to hide from guards and use the lightning to see through darkness.
            <br />
            Please forgive me for the poor SFX uses. The guards are actually "monsters" so I picked
            some creepy sounds... Also, no build is currently available for download.
            <br />
            <YouTubeVideo link="LAg7x_IE-HM?si=8s5AUZkNlq0K_6mT" />
          </>
        }
        tools={['Unreal']}
        roleName="Solo Developer"
        links={[
          {
            text: 'View Demo Video',
            href: 'https://www.youtube.com/watch?v=LAg7x_IE-HM',
          },
        ]}
        timeRange="2024 March - May"
      />
    ),
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
    description: 'A Backpack Hero like mobile game.',
    details: (
      <WorkDetail
        description={
          <>
            Contributed to designing and implementing items for combat. Implemented an indicator
            showing next stages. Implemented an on-rails (linear) tutorial system, featuring dynamic
            environment (mist and buildings), NPCs, dialogue, quests and smooth animation, boosting
            <b>Day 1 Retention from 29% to 35%</b>. Implemented a WeChat Game Club activity reward
            system, which made the game club posts rocket from less than <b>5 posts to 300 posts</b>{' '}
            a day when it released.
            <br />
            Note: The game is only available in China (Wechat, Douyin) and Canada (Google Play, App
            Store).
            <br />
            <YouTubeVideo link="NlaD7aWs3lA?si=Mu9znF9QR_BTYkle" />
          </>
        }
        tools={['Cocos Creator', 'TypeScript']}
        roleName="Programmer, Designer"
        links={[
          {
            text: 'View Gameplay Video',
            href: 'https://www.youtube.com/watch?v=NlaD7aWs3lA',
          },
        ]}
        timeRange="2024 May - August"
      />
    ),
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
    description: 'Local 1V1 shooting game for Triangle Game Jam.',
    details: (
      <WorkDetail
        description={
          <>
            Local PVP shooting game for the one-week{' '}
            <a
              href="https://entrepreneurship.ncsu.edu/trianglegamejam/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Triangle Game Jam
            </a>{' '}
            (Epic x Duke x UNC x NC State), twisting tic-tac-toe into capturing 9 dimensions. As
            Lead Programmer and Designer, implemented shooting, auto aim, portals, power-ups, game
            overlay, crosshair and mini-map. Made initial game design and sound choices. Devoted
            passionate 115 hours. The game won Best Sound Design Award and Honorable Mention for
            Best Game Award.
            <br />
            <YouTubeVideo link="NSNpAHGLr-o?si=DLGEfppAmb9IgZsp" />
          </>
        }
        tools={['Unreal', 'Perforce']}
        roleName="Lead Programmer, Lead Designer"
        links={[
          {
            text: 'Itch.io',
            href: 'https://kerrylu.itch.io/gridmaster',
          },
          {
            text: 'View Gameplay Video',
            href: 'https://www.youtube.com/watch?v=NSNpAHGLr-o',
          },
        ]}
        timeRange="2025 Feb 23 - March 1"
      />
    ),
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

  const groupedTags = useMemo(() => {
    const tagSet = new Set();
    portfolioWorksData.forEach((work) =>
      (work.tags || []).forEach((tag) => tagSet.add(String(tag))),
    );
    // Exclude tags by contains (ci) and exact (cs)
    const all = Array.from(tagSet).filter((t) => {
      const lower = String(t).toLowerCase();
      const byContains = EXCLUDE_CONTAINS.some(
        (substr) => substr && lower.includes(substr.toLowerCase()),
      );
      const byExact = EXCLUDE_MATCH.includes(String(t));
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
    const metaPool = all.filter((t) => META_PRIORITY.includes(t));
    const meta = takeInOrder(META_PRIORITY, metaPool).list;

    // Engine & Language (combined)
    const ENGINE_LANG_PRIORITY = [...ENGINE_PRIORITY, ...LANGUAGE_PRIORITY];
    const engineLangPool = all.filter((t) => ENGINE_LANG_PRIORITY.includes(t));
    const engineLang = takeInOrder(ENGINE_LANG_PRIORITY, engineLangPool).list;

    // Gameplay
    const gameplayPool = all.filter((t) => GAMEPLAY_PRIORITY.includes(t));
    const gameplay = takeInOrder(GAMEPLAY_PRIORITY, gameplayPool).list;

    // Tech
    const techPool = all.filter((t) => TECH_PRIORITY.includes(t));
    const tech = takeInOrder(TECH_PRIORITY, techPool).list;

    // Others = not in any of the above
    const known = new Set([...meta, ...engineLang, ...gameplay, ...tech]);
    const others = all.filter((t) => !known.has(t)).sort((a, b) => a.localeCompare(b));

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
    return portfolioWorksData.filter((w) => (w.tags || []).some((t) => selected.has(String(t))));
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
          { key: 'meta', title: 'Meta', list: groupedTags.meta },
          { key: 'engineLang', title: 'Engine & Language', list: groupedTags.engineLang },
          { key: 'gameplay', title: 'Gameplay', list: groupedTags.gameplay },
          { key: 'tech', title: 'Tech', list: groupedTags.tech },
          { key: 'others', title: 'Others', list: groupedTags.others },
        ];
        const visibleRows = rows.filter((r) => r.list && r.list.length > 0);
        const sidebarMount = document.getElementById('sidebar-root') || document.body;
        if (!sidebarMount) return null;
        return createPortal(
          <>
            <div className="item">
              <div className="header">Filters</div>
              <div className="menu">
                <button
                  type="button"
                  className="ui basic fluid button"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
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
                      All
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
                      title={`Filter by ${tag}`}
                    >
                      {tag}
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
          title="Open filters"
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
            title="Open filters"
          >
            <i className="filter icon" /> Filters
          </button>
        </div>
        <div className="middle">
          {selected.size > 0 && (
            <div className="selected-tags-scroll ui labels" role="list" aria-label="Selected tags">
              {Array.from(selected).map((tag) => (
                <div
                  key={tag}
                  className="ui label"
                  role="button"
                  tabIndex={0}
                  title={`Selected: ${tag}`}
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
                  {tag}
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
              title="Clear all filters"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="ui three stackable cards" aria-live="polite">
        {filtered
          .slice()
          .sort((a, b) => a.order - b.order || 0)
          .map((work) => (
            <PortfolioWork
              key={`${work.id}-${work.title}`}
              id={work.id}
              title={work.title}
              description={work.description}
              details={work.details}
              image={work.image}
              tags={work.tags}
            />
          ))}
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

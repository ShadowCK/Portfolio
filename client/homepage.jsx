const React = require('react');
const ReactDOM = require('react-dom');

const { PortfolioWork, WorkDetail } = require('./components.jsx');

const portfolioWorksData = [
  {
    id: 1,
    order: 1,
    title: 'RIT Idle',
    description: 'An idle game where you play as an RIT student.',
    details: (
      <WorkDetail
        description={`This was originally a course project for IGME-235, "Intro to Game Web Tech" - essentailly a web development course. I decided to continue working on it after the course ended, but only for a couple of weeks. I was quite a beginner at web development so my skills limited my ability to implement more features. I might come back to this project in the future.`}
        tools={['HTML', 'CSS', 'JavaScript', 'Howler.js']}
        role="Solo Developer"
        links={[
          { text: 'Play', href: 'https://shadowck.github.io/RIT-Idle/' },
          { text: 'Repo', href: 'https://github.com/ShadowCK/RIT-Idle' },
        ]}
        timeRange="2022 December - 2023 January"
      />
    ),
    image: '/assets/images/rit-idle-cover.png',
    tags: ['Course Project', 'Web', 'Idle Game', 'Local Storage', 'HTML/CSS/JS', 'Audio'],
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
            <a href="https://www.rit.edu/directory/wmhics-w-michelle-harris" target="_blank">
              Prof. Harris
            </a>
            {"'"} lecture and had fun with p5.js. For the final project, we were asked to make
            "Targets" and "Influencers" in a p5.js scene. I played a lot of idle games over the past
            6, 7 years so I decided to make such a game, in which you can technically idle it
            (however the idle gameplay wasn't the focus) or manually command your workers. My
            biggest accomplishment was the waypoint system. Hold shift to place waypoints and view
            the path. The workers will follow the path and do the work.
          </>
        }
        tools={['P5.js', 'Aseprite']}
        role="Solo Developer"
        links={[
          { text: 'Play', href: 'https://shadowck.github.io/Lazy-Garden/' },
          { text: 'Repo', href: 'https://github.com/ShadowCK/Lazy-Garden' },
        ]}
        timeRange="2021 November"
      />
    ),
    image: '/assets/images/lazy-garden-cover.png',
    tags: ['Course Project', 'Web', 'Clicker/Idle Game', 'p5.js', 'Aseprite'],
  },
  {
    id: 3,
    order: 2,
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
        role="Solo Developer"
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
    order: 101,
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
        role="Solo Developer"
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
    tags: ['Personal Project', 'Web', 'Node.js', 'Archiver', 'pinyin'],
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
        role="Solo Developer"
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
    order: 5,
    title: 'Lost Castle',
    description: `A 3D scene of a lost castle in the void, replicating the first dungeon of my Minecraft MMORPG server, "New World".`,
    details: (
      <WorkDetail
        description={`The final project for IGME-219, "3D Animation and Asset Production". The goal was to build a 3D scene with original assets. I decided to recreate the first dungeon of my Minecraft MMORPG server, "New World". I used Maya to make models for the castle and props, and Substance Painter to texture them. I added post processing in Unity so that the scene looks more appealing. I also made a script for the floating rocks so they move up and down, and pause when the player stands on them. However, the castle's model was not cleaned up (was a headache to me), causing its UV map to be messed up.`}
        tools={['Maya', 'Substance Painter', 'Unity', 'C#']}
        role="Solo Developer"
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
        role="Solo Developer"
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
    order: 3,
    title: 'Zhao Drift',
    description: `Send and receive messages in the form of drifting bottles.`,
    details: (
      <WorkDetail
        description={`A course project for the advanced elective course, IGME-430, "Rich Media Web App Development II." Initially, I aimed to create an app for private chats with my friends, featuring customizable options, and thus named it 'Zhao Chat.' However, I later pivoted to a more intriguing concept of chatting with random people in an aesthetically appealing experience. My professor commented, 'This project almost feels like an art piece. The ability to either destroy the bottle or send it back into the pool is really cool and interesting.' And I wholeheartedly agree. The concept is engaging, and the UI design is beautiful. I'm proud of this project. Given more time, I would refactor it to use Express, React, and Socket.io, and add additional features like user authentication, the ability to add comments to bottles, and user-generated pools (in contrast to the public one).`}
        tools={['Node.js', 'Bulma', 'Webpack', 'CircleCI', 'ESLint', 'Underscore']}
        role="Solo Developer"
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
        role="Solo Developer"
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
    order: 7,
    title: `Illostath's Legacy`,
    description: `Casual game. Explore the Ethshar world as an alchemist.`,
    details: (
      <WorkDetail
        description={`This is a course project for IGME-320, "Game Design and Development II". We used Scrum and Trello Board to manage the project. It proved to be very useful and motivating. I was one of the two programmers in the team, responsible for the item management system, sound system, debugging and QoL improvements. I also made a video trailer for the game. I enjoyed working with the team and learned that Unity sucks. It's just too heavy for a tiny game. Next time I'll try Godot or Unreal Engine. I wish I had more contribution to this game, but I decitated most of my time to Zhao Drift and Pong Hub. Note: as this is a team project, I may not be able to share the source code.`}
        tools={['Unity', 'C#', 'Vegas Pro', 'Trello Board', 'Scrum']}
        role="Programmer, Video Editor"
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
    tags: [
      'Course Project',
      '5-Person Team',
      'Unity',
      'C#',
      'Trello Board',
      'Scrum',
      'Video Trailer',
    ],
  },
  {
    id: 11,
    order: 8,
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
            <a href="https://www.linkedin.com/in/liamarmitage/" target="_blank">
              Liam
            </a>
            ,{' '}
            <a href="https://www.linkedin.com/in/conrad-chaffee/" target="_blank">
              Conrad
            </a>{' '}
            and{' '}
            <a href="https://www.linkedin.com/in/petercat/" target="_blank">
              Peter
            </a>
            . My main focus was on the game balance, items and events ("calamities"). If you are
            interested, the design document includes everything about the game except the rules in
            detail.
          </>
        }
        tools={['Brain', 'Heart', 'Soul']}
        role="Game Designer"
        links={[
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
      '5-Person Team',
      'Tabletop Game',
      'Card Game',
      'Game Design',
      'Game Balance',
    ],
  },
  {
    id: 12,
    order: 10000,
    title: 'Graphical Snake',
    description: 'To be added',
    details: (
      <WorkDetail
        description="To be added"
        tools={['C++', 'SMFL', 'Box2D']}
        role="Solo Developer"
        links={[
          {
            text: 'TBA',
            href: '/',
          },
        ]}
        timeRange="TBA"
      />
    ),
    image: '/assets/images/graphical-snake-cover.png',
    tags: ['Course Project', 'C++', 'SMFL', 'Box2D'],
  },
  {
    id: 13,
    order: -100,
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
          </>
        }
        tools={['Lua', 'Roblox Studio']}
        role="Programmer"
        links={[
          {
            text: 'Play',
            href: 'https://www.roblox.com/games/13875652550/Play-Cats-Tag',
          },
          {
            text: 'Gameplay Video',
            href: 'https://www.youtube.com/watch?v=7CXE7jriAP4&ab_channel=OwletteKenz',
          },
        ]}
        timeRange="2024 May - August"
      />
    ),
    image: '/assets/images/play-cats-tag-cover.png',
    tags: ['Team Project', 'Internship Work', 'Roblox', 'Lua', 'Roblox Studio'],
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
          </>
        }
        tools={['Unreal Engine', 'C++']}
        role="Programmer"
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
    tags: ['Personal Project', 'Unreal Engine', 'C++', 'Shader', 'Minimap', 'Puzzle'],
  },
  // More works...
];

window.onload = () => {
  ReactDOM.render(
    portfolioWorksData
      .sort((a, b) => a.order - b.order || 0)
      .map((work) => (
        <div class="column is-4">
          <PortfolioWork
            key={work.id}
            id={work.id}
            title={work.title}
            description={work.description}
            details={work.details}
            image={work.image}
            tags={work.tags}
          />
        </div>
      )),
    document.getElementById('works'),
  );
};

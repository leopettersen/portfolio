import { pt } from './pt';
import imgProfile from '../../assets/Perfil.jpeg';
import imgPortoesDoCeu from '../../assets/PortoesDoCeu.webp';
import imgPortfolio from '../../assets/Portfolio.webp';
import imgOpm from '../../assets/OPM.webp';

export const en: typeof pt = {
  terminal: {
    role: 'Software Engineering Student',
    university: 'PUC Minas',
    typeMessage: 'type',
    typeCommand: 'help',
    toSeeCommands: 'to see available commands',
    openingSection: 'Opening section: {{title}}',
    closingSection: 'Closing current section.',
    clearingHistory: 'Clearing history.',
    availableCommands: 'Available commands: {{commands}}',
    commandNotFound: 'Command not found: "{{command}}"',
    inputLabel: 'Terminal command',
  },
  window: {
    back: 'Back',
    close: 'Close',
    minimize: 'Minimize',
    maximize: 'Maximize',
    restore: 'Restore',
    pageNotFound: 'Page not found.',
    closeHint: 'type <1>{{command}}</1> to close'
  },
    about: {
    sections: {
      education: 'Education',
      interests: 'Interests',
      goals: 'Goals'
    },
    profilePicture: imgProfile,
    overviewTitle: 'Leonardo Federici Pettersen',
    overviewParagraph: 'Software Engineering student at PUC Minas, starting my journey in technology and software development. Passionate about tech, programming, and innovation.',
    education: {
      title: 'Software Engineering',
      period: 'Jan 2026 - Dec 2029',
      college: 'PUC Minas',
      description: 'The course covers subjects such as computer programming, programming languages, statistics, mathematical logic applied to software specifications, technical aspects of software engineering like analysis, modeling, design, construction, and software testing. It also covers managerial aspects such as software project management, configuration and evolution management, software quality assurance, and production management. It includes teamwork, people management, communication with stakeholders, and human-computer interaction. It also addresses modern technologies needed for software construction like databases, computer networks, operating systems, distributed systems, security, and cloud/mobile technologies.',
      tags: ['Software Architecture', 'Cloud & Mobile', 'Construction & Testing', 'Project Management', 'Software Quality']
    },
    interestsDescription: 'Besides my interest in tech and software development, I am passionate about soccer and sports in general, a massive Cruzeiro fan! I follow Brazilian and international soccer, and I also enjoy swimming, basketball, and american football.',
    interestsTags: ['Sports', 'Soccer', 'Innovation', 'Programming', 'Technology'],
    goals: [
      {
        title: 'Participate in a WeMakeSoftware',
        description: 'Participate in a WeMakeSoftware event with my group to experience presenting a software project to an evaluation panel and receive valuable feedback.'
      },
      {
        title: 'Contribute to open-source projects',
        description: 'Contribute to open-source projects with code, documentation, or tests, to learn from the community and help improve software used by many people, as I am an avid user myself.'
      },
      {
        title: 'Establish a solid career in software development',
        description: 'Become a highly qualified software developer, contributing to innovative and impactful projects.'
      }
    ]
  },
  workModels: {
    onsite: 'On-site',
    hybrid: 'Hybrid',
    remote: 'Remote',
  },
  experiences: [
    {
      organization: 'dti digital',
      period: 'Oct 2026 - Present',
      experiencePosition: 'Software Development Intern',
      workModel: 'hybrid',
      description: 'I work as a systems development intern at Enterprise Aurora, in a team that follows agile methodologies. I develop software solutions using C# on the back-end and React with TypeScript on the front-end, participating in team activities and contributing to the evolution of the products.',
      skills: ['C#', '.NET', 'React', 'TypeScript']
    },
    {
      organization: 'PUC Minas',
      period: 'Aug 2026 - Present',
      experiencePosition: 'Introduction to Algorithms Teaching Assistant',
      workModel: 'onsite',
      description: 'I work as a teaching assistant for the discipline, aiming to mitigate individual difficulties and the historical retention rate of the subject.',
      skills: ['Teaching', 'Leadership', 'Python']
    }
  ],
  projectUI: {
    imageComingSoon: 'Image coming soon'
  },
  projects: [
    {
      name: 'Hospital System - "Portões do Céu"',
      date: 'Dec 2026',
      description: 'Web hospital management system developed in Java with Spring Boot, using a REST API and a relational database for managing patients, professionals, appointments, and hospitalizations. The application organizes essential processes, such as scheduling, room control, and medical records.',
      technologies: ['Java', 'SpringBoot', 'Thymeleaf', 'MySQL'],
      repoLink: 'https://github.com/leopettersen/TP-sistema-hospitalar',
      image: imgPortoesDoCeu,
    },
    {
      name: 'Professional Portfolio',
      date: 'Oct 2026',
      description: 'The system showcases my journey, projects, experiences, and contact methods in an interface inspired by a desktop with a terminal. Navigation can be done via commands or interface icons, with support for Portuguese and English, light and dark themes, and responsive design for computers and mobile devices. The goal is to present my work quickly, clearly, and interactively, without requiring registration or login.',
      technologies: ['TypeScript', 'React', 'Supabase', 'Docker'],
      repoLink: 'https://github.com/leopettersen/portfolio',
      image: imgPortfolio,
    },
    {
      name: '"Opera Máquinas" (OPM)',
      date: 'Jul 2026',
      description: 'Web interface aimed at optimizing and managing production in industrial environments, centralizing essential tools for the operational routine. The system seeks to organize critical processes, such as login control and role-based user registration.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      repoLink: 'https://github.com/leopettersen/trabalho-intedisciplinar1-opm',
      image: imgOpm,
    }
  ],
  contact: {
    title: 'Send a message',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Type your message...',
    sendButton: 'Send message',
    sendingButton: 'Sending...',
    successMsg: 'Message sent! Thank you for reaching out.',
    errorMsg: 'Could not send. Please try again or use one of the contacts above.',
    errors: {
      nameRequired: 'Please enter your name.',
      emailRequired: 'Please enter your email.',
      emailInvalid: 'Invalid email format.',
      messageRequired: 'Please enter a message.',
      messageMinLength: 'Message must be at least 10 characters long.'
    }
  },
  guestbook: {
    loading: 'Loading...',
    loadingMore: 'Loading...',
    error: 'Could not load the messages.',
    empty: 'Be the first to leave a message!',
    loadMore: 'Load more',

    form: {
        title: 'Leave a message',
        name: 'Name',
        namePlaceholder: 'Your name',
        nameError: 'Please enter your name.',
        message: 'Message',
        messagePlaceholder: 'Write a message...',
        messageError: 'Please enter your message.',
        privacy: 'Your message will be public.',
        submit: 'Send message',
        sending: 'Sending...',
        success: 'Message sent! Thank you for reaching out.',
        error: 'Could not send your message. Please try again.',
        wait: 'Please wait a few seconds before sending another message.',
    },
  },
  agent: {
    title: 'Ask Leonardo',
    status: 'answers generated by Gemini',
    typing: 'typing...',
    reset: 'New chat',
    welcome: "Hi! I'm Leonardo, a Software Engineering student at PUC Minas. Ask me anything about my education, experience and projects.",
    suggestions: [
        'Which technologies do you use?',
        'Tell me about your projects',
        'Where do you work now?',
        'How can I reach you?',
    ],
    placeholder: 'Type your question...',
    inputLabel: 'Your question',
    send: 'Send',
    stop: 'Stop',
    stopped: 'Answer interrupted.',
    disclaimer: 'AI can make mistakes. Answers are based only on the information in this portfolio.',
    errors: {
        missing_key: 'The agent is not configured yet (missing GEMINI_API_KEY).',
        invalid_key: 'The Gemini key is invalid.',
        model_not_found: 'The configured Gemini model does not exist.',
        rate_limited: 'Too many questions in a row. Try again in {{seconds}} s.',
        quota: 'The Gemini quota ran out for now. Please try again later.',
        too_long: 'Questions can be up to 1000 characters long.',
        timeout: 'Gemini took too long to answer.',
        network: 'No connection to the server.',
        no_api: 'The agent is not available in this environment.',
        generic: 'Could not reach Gemini right now. Please try again.',
    },
  },
  boot: {
    lines: [
        '[kernel] Initializing system...',
        '[modules] Loading modules...',
        '[filesystem] Mounting /home/guest...',
        '[network] Connecting to guestbook...',
        '[session] Preparing environment...',
        '[ui] Loading interface...',
        'System ready. Welcome, guest.',
    ],
    skip: 'press any key or tap to skip',
  },
  landingInfo: {
    title: 'Hello, welcome to my portfolio!',
    info: 'My portfolio simulates an Operating System. You can drag, maximize, minimize and close windows, and drag icons on the desktop. In the taskbar, it is also possible to translate from English to Portuguese.'
  },
  taskbar: {
    start: 'Start',
    apps: 'Apps',
    switchMode: 'Switch mode',
    searchPlaceholder: 'Search apps and commands',
    askAgent: 'Ask the agent:',
    power: 'Power',
    restart: 'Restart',
    shutdown: 'Shut down',
  },
  tray: {
    online: 'Connected to the internet',
    offline: 'No internet connection',
    battery: 'Battery: {{percent}}%',
    batteryCharging: 'Battery: {{percent}}%, charging',
    fullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
  },
  power: {
    restarting: 'Restarting...',
    shuttingDown: 'Shutting down...',
    safe: "It's now safe to turn off your computer.",
    turnOn: 'Turn on',
  },
  commands: {
    help: 'Lists the available commands',
    clear: 'Clears the terminal history',
    close: 'Closes the focused window',
    logout: 'Goes back to the mode choice',
  },
  login: {
    question: 'How would you like to see the portfolio?',
    system: {
      title: 'System',
      description: 'Explore it like an operating system, with a terminal, windows and icons.',
    },
    standard: {
      title: 'Standard',
      description: 'Browse a traditional page, scrolling through the sections.',
    },
  },
  standard: {
    menu: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      agent: 'AI agent',
      contact: 'Contact',
      guestbook: 'Guestbook',
      resume: 'Resume',
    },
    resume: {
      title: 'Resume',
      pages_one: '{{count}} page',
      pages_other: '{{count}} pages',
      zoomOut: 'Zoom out',
      zoomIn: 'Zoom in',
      zoomFit: 'Fit to width',
      download: 'Download PDF (in Portuguese)',
      downloadResume: 'Download resume (in Portuguese)',
      open: 'Open in new tab',
      loading: 'Loading the PDF...',
      error: 'Could not display the PDF here. Download it or open it in a new tab using the buttons above.',
    },
    systemMode: 'System mode',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    lightTheme: 'Switch to light theme',
    darkTheme: 'Switch to dark theme',
    home: {
      stats: {
        projects: 'Academic and personal projects',
        experiences: 'Professional and academic experiences',
        technologies: 'Technologies used in projects and experiences',
        graduation: 'Expected graduation in Software Engineering',
      },
    },
    about: {
      tag: 'Profile',
      title: 'About',
      role: 'ROLE',
      education: 'EDUCATION',
      educationTag: 'ACADEMIC BACKGROUND',
      goals: 'GOALS',
      reachOut: "Let's talk?",
    },
    experience: {
      tag: 'Journey',
      title1: 'Professional',
      title2: 'Experience',
      text: 'My journey so far, from a software development internship to being a teaching assistant for Introduction to Algorithms at PUC Minas.',
    },
    projects: {
      title1: 'Featured',
      title2: 'Projects',
    },
    agent: {
      tag: 'Artificial intelligence',
      title1: 'Ask',
      title2: 'Leonardo',
      text: 'An AI agent that answers, in first person, questions about my education, experience and projects, using only the information in this portfolio.',
      you: 'You',
    },
    guestbook: {
      tag: 'Guestbook',
      title1: 'Leave a',
      title2: 'message',
      text: 'Stopped by? Leave a public note for me and the next visitors.',
    },
    contact: {
      title: "Let's Build Something",
      text: "If you're interested in software development, web applications or technology projects, I'd be happy to talk about ideas, opportunities and collaborations.",
      formText: "Tell me about the role, the project or the idea, and I'll reply as soon as possible.",
      available: 'Open to talking about technology, projects and opportunities',
      privacy: 'Your message will be sent to my email, and your address will only be used to reply.',
    },
    footer: {
      text: 'Software Engineering student at PUC Minas, open to talking about technology, projects and opportunities.',
      copy: '© 2026 Leonardo Pettersen · Built with React, Vite and Tailwind CSS.',
    },
  }
};
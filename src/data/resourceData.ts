import { Recommendation } from "@/api/searchAPI";

/**
 * Curated high-quality learning resources
 * Each resource is marked as Free, Paid, or Free (with paid certificate)
 * Priority given to comprehensive, well-maintained, and highly-rated resources
 */
export const resourceData: Record<string, Recommendation[]> = {
  "machine learning": [
    // Courses - High Quality
    {
      type: "course",
      title: "Machine Learning Specialization",
      provider: "Coursera, Stanford (Andrew Ng)",
      description: "The definitive ML course updated for 2024. Covers supervised/unsupervised learning, neural networks, and best practices. Free to audit, paid certificate.",
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      rating: 4.9
    },
    {
      type: "course",
      title: "Fast.ai Practical Deep Learning for Coders",
      provider: "Fast.ai",
      description: "Top-down approach to deep learning. Build real models from day one using PyTorch. Completely free with notebooks.",
      url: "https://course.fast.ai/",
      rating: 4.9
    },
    {
      type: "course",
      title: "CS229: Machine Learning",
      provider: "Stanford University",
      description: "Full Stanford ML course with video lectures, notes, and problem sets. Free.",
      url: "https://cs229.stanford.edu/",
      rating: 4.8
    },
    {
      type: "course",
      title: "Google Machine Learning Crash Course",
      provider: "Google",
      description: "Fast-paced intro to ML with TensorFlow. Includes exercises and real-world case studies. Free.",
      url: "https://developers.google.com/machine-learning/crash-course",
      rating: 4.7
    },
    // Books - Essential
    {
      type: "book",
      title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
      author: "Aurélien Géron",
      description: "The most practical ML book. Covers end-to-end projects with code. Paid, but essential.",
      url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/",
      rating: 4.9
    },
    {
      type: "book",
      title: "Neural Networks and Deep Learning",
      author: "Michael Nielsen",
      description: "Free online book explaining neural networks intuitively with interactive visualizations. Free.",
      url: "http://neuralnetworksanddeeplearning.com/",
      rating: 4.8
    },
    {
      type: "book",
      title: "The Hundred-Page Machine Learning Book",
      author: "Andriy Burkov",
      description: "Concise yet comprehensive ML overview. Perfect for busy learners. Paid (read-first, pay-later model).",
      url: "http://themlbook.com/",
      rating: 4.7
    },
    {
      type: "book",
      title: "Machine Learning Yearning",
      author: "Andrew Ng",
      description: "Strategic guide to structuring ML projects. Focus on practical decision-making. Free PDF.",
      url: "https://www.deeplearning.ai/resources/machine-learning-yearning/",
      rating: 4.8
    },
    // YouTube - Best Channels
    {
      type: "youtube",
      title: "3Blue1Brown - Neural Networks Series",
      description: "Stunning visual explanations of neural networks and deep learning fundamentals. Free.",
      url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
      rating: 5.0
    },
    {
      type: "youtube",
      title: "StatQuest with Josh Starmer",
      description: "Statistics and ML concepts explained clearly with humor. Essential for understanding fundamentals. Free.",
      url: "https://www.youtube.com/c/joshstarmer",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Sentdex",
      description: "Practical Python ML tutorials with real projects. Great for hands-on learners. Free.",
      url: "https://www.youtube.com/c/sentdex",
      rating: 4.7
    },
    // Websites & Tools
    {
      type: "website",
      title: "Kaggle Learn",
      description: "Free micro-courses on ML, deep learning, and data science with hands-on notebooks. Free.",
      url: "https://www.kaggle.com/learn",
      rating: 4.8
    },
    {
      type: "website",
      title: "Papers With Code",
      description: "Latest ML research papers with implementation code. Essential for staying current. Free.",
      url: "https://paperswithcode.com/",
      rating: 4.9
    },
    {
      type: "website",
      title: "ML Glossary",
      description: "Clear definitions and explanations of ML terms with code examples. Free.",
      url: "https://ml-cheatsheet.readthedocs.io/",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/MachineLearning",
      description: "Active community for ML research, papers, and discussions. 2M+ members. Free.",
      url: "https://www.reddit.com/r/MachineLearning/",
      rating: 4.7
    },
    {
      type: "reddit",
      title: "r/learnmachinelearning",
      description: "Supportive community for ML beginners with learning resources and advice. Free.",
      url: "https://www.reddit.com/r/learnmachinelearning/",
      rating: 4.6
    }
  ],

  "data science": [
    // Courses
    {
      type: "course",
      title: "IBM Data Science Professional Certificate",
      provider: "Coursera",
      description: "Complete data science curriculum from IBM. Covers Python, SQL, ML, and visualization. Free to audit, paid certificate.",
      url: "https://www.coursera.org/professional-certificates/ibm-data-science",
      rating: 4.6
    },
    {
      type: "course",
      title: "Google Data Analytics Professional Certificate",
      provider: "Coursera",
      description: "Job-ready data analytics skills from Google. Beginner-friendly with real projects. Free to audit, paid certificate.",
      url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      rating: 4.8
    },
    {
      type: "course",
      title: "Data Science Fundamentals with Python and SQL",
      provider: "IBM via edX",
      description: "Core data science skills using Python and SQL. Hands-on labs included. Free to audit.",
      url: "https://www.edx.org/professional-certificate/ibm-data-science",
      rating: 4.5
    },
    {
      type: "course",
      title: "Introduction to Data Science",
      provider: "Harvard via edX (CS50)",
      description: "Harvard's introduction to data science. Rigorous but accessible. Free to audit.",
      url: "https://www.edx.org/course/introduction-to-data-science-with-python",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "Python for Data Analysis",
      author: "Wes McKinney (pandas creator)",
      description: "The definitive guide to data analysis with pandas. Written by the library's creator. Paid.",
      url: "https://wesmckinney.com/book/",
      rating: 4.8
    },
    {
      type: "book",
      title: "Storytelling with Data",
      author: "Cole Nussbaumer Knaflic",
      description: "Master data visualization and communication. Essential for presenting insights. Paid.",
      url: "https://www.storytellingwithdata.com/book",
      rating: 4.9
    },
    {
      type: "book",
      title: "The Data Science Handbook",
      author: "Field Cady",
      description: "Practical guide covering the full data science workflow. Free chapters available.",
      url: "https://www.thedatasciencehandbook.com/",
      rating: 4.5
    },
    {
      type: "book",
      title: "Think Stats",
      author: "Allen B. Downey",
      description: "Statistics for programmers using Python examples. Free online, paid print.",
      url: "https://greenteapress.com/thinkstats2/",
      rating: 4.6
    },
    // YouTube
    {
      type: "youtube",
      title: "StatQuest with Josh Starmer",
      description: "Statistics and ML fundamentals explained simply. Essential for data scientists. Free.",
      url: "https://www.youtube.com/c/joshstarmer",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Ken Jee",
      description: "Data science projects, career advice, and portfolio building tips. Free.",
      url: "https://www.youtube.com/c/KenJee1",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "Alex The Analyst",
      description: "SQL, Excel, Tableau tutorials focused on job-ready skills. Free.",
      url: "https://www.youtube.com/@AlexTheAnalyst",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "Kaggle",
      description: "Datasets, competitions, notebooks, and free courses. The data science hub. Free.",
      url: "https://www.kaggle.com/",
      rating: 4.9
    },
    {
      type: "website",
      title: "Mode Analytics SQL Tutorial",
      description: "Comprehensive SQL tutorial with practice problems and real datasets. Free.",
      url: "https://mode.com/sql-tutorial/",
      rating: 4.7
    },
    {
      type: "website",
      title: "Towards Data Science",
      description: "Quality articles on data science, ML, and analytics from practitioners. Free (Medium membership for full access).",
      url: "https://towardsdatascience.com/",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/datascience",
      description: "Professional data science community with career advice and technical discussions. Free.",
      url: "https://www.reddit.com/r/datascience/",
      rating: 4.7
    },
    {
      type: "discord",
      title: "DataTalks.Club",
      description: "Active community with free courses, study groups, and job postings. Free.",
      url: "https://datatalks.club/",
      rating: 4.8
    }
  ],

  "python": [
    // Courses
    {
      type: "course",
      title: "Python for Everybody Specialization",
      provider: "Coursera, University of Michigan",
      description: "Most popular Python course on Coursera. Perfect for absolute beginners. Free to audit.",
      url: "https://www.coursera.org/specializations/python",
      rating: 4.8
    },
    {
      type: "course",
      title: "CS50's Introduction to Programming with Python",
      provider: "Harvard via edX",
      description: "Harvard's rigorous Python introduction. High quality, challenging content. Free.",
      url: "https://cs50.harvard.edu/python/",
      rating: 4.9
    },
    {
      type: "course",
      title: "100 Days of Code: Python",
      provider: "Udemy, Angela Yu",
      description: "Comprehensive bootcamp building 100 projects. Best value for money. Paid.",
      url: "https://www.udemy.com/course/100-days-of-code/",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "Automate the Boring Stuff with Python",
      author: "Al Sweigart",
      description: "Learn Python by automating real tasks. Perfect for practical learners. Free online.",
      url: "https://automatetheboringstuff.com/",
      rating: 4.9
    },
    {
      type: "book",
      title: "Python Crash Course",
      author: "Eric Matthes",
      description: "Fast-paced, thorough Python introduction with projects. Great for beginners. Paid.",
      url: "https://nostarch.com/pythoncrashcourse2e",
      rating: 4.8
    },
    {
      type: "book",
      title: "Fluent Python",
      author: "Luciano Ramalho",
      description: "Master Python's features and idioms. Best for intermediate to advanced. Paid.",
      url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
      rating: 4.9
    },
    {
      type: "book",
      title: "Think Python",
      author: "Allen B. Downey",
      description: "Computer science introduction using Python. Free online, great for CS fundamentals.",
      url: "https://greenteapress.com/thinkpython2/",
      rating: 4.6
    },
    // YouTube
    {
      type: "youtube",
      title: "Corey Schafer",
      description: "Clear, professional Python tutorials. Best for learning specific topics. Free.",
      url: "https://www.youtube.com/c/Coreyms",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Tech With Tim",
      description: "Python projects and tutorials for all levels. Active community. Free.",
      url: "https://www.youtube.com/c/TechWithTim",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "Arjan Codes",
      description: "Python best practices, design patterns, and clean code. For intermediate+. Free.",
      url: "https://www.youtube.com/c/ArjanCodes",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "Real Python",
      description: "High-quality Python tutorials and articles. Some free, full access paid.",
      url: "https://realpython.com/",
      rating: 4.8
    },
    {
      type: "website",
      title: "Python Official Tutorial",
      description: "Official Python documentation tutorial. Comprehensive and authoritative. Free.",
      url: "https://docs.python.org/3/tutorial/",
      rating: 4.5
    },
    {
      type: "website",
      title: "Exercism Python Track",
      description: "Free coding exercises with mentor feedback. Great for practice. Free.",
      url: "https://exercism.org/tracks/python",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/learnpython",
      description: "Supportive community for Python learners. Active help and resources. Free.",
      url: "https://www.reddit.com/r/learnpython/",
      rating: 4.8
    },
    {
      type: "discord",
      title: "Python Discord",
      description: "Large active Python community with help channels and projects. Free.",
      url: "https://discord.gg/python",
      rating: 4.7
    }
  ],

  "javascript": [
    // Courses
    {
      type: "course",
      title: "The Complete JavaScript Course 2024",
      provider: "Udemy, Jonas Schmedtmann",
      description: "Modern JavaScript from zero to advanced. Includes projects and challenges. Paid.",
      url: "https://www.udemy.com/course/the-complete-javascript-course/",
      rating: 4.8
    },
    {
      type: "course",
      title: "JavaScript Algorithms and Data Structures",
      provider: "freeCodeCamp",
      description: "Interactive curriculum with 300+ challenges. Earn certification. Free.",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      rating: 4.7
    },
    {
      type: "course",
      title: "The Odin Project - JavaScript Path",
      provider: "The Odin Project",
      description: "Full-stack JavaScript curriculum with projects. Community-driven and free.",
      url: "https://www.theodinproject.com/paths/full-stack-javascript",
      rating: 4.9
    },
    // Books
    {
      type: "book",
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      description: "Modern JavaScript introduction with exercises. Beautiful free online edition.",
      url: "https://eloquentjavascript.net/",
      rating: 4.8
    },
    {
      type: "book",
      title: "You Don't Know JS (book series)",
      author: "Kyle Simpson",
      description: "Deep dive into JavaScript mechanics. Essential for truly understanding JS. Free on GitHub.",
      url: "https://github.com/getify/You-Dont-Know-JS",
      rating: 4.9
    },
    {
      type: "book",
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      description: "Classic guide to JavaScript's best features. Short but influential. Paid.",
      url: "https://www.oreilly.com/library/view/javascript-the-good/9780596517748/",
      rating: 4.6
    },
    // YouTube
    {
      type: "youtube",
      title: "Fireship",
      description: "Fast-paced JavaScript and web dev content. Great for staying current. Free.",
      url: "https://www.youtube.com/c/Fireship",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Traversy Media",
      description: "Practical web development tutorials. Clear explanations. Free.",
      url: "https://www.youtube.com/c/TraversyMedia",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Web Dev Simplified",
      description: "JavaScript concepts explained simply. Great for beginners. Free.",
      url: "https://www.youtube.com/c/WebDevSimplified",
      rating: 4.7
    },
    // Websites
    {
      type: "website",
      title: "JavaScript.info",
      description: "Modern JavaScript tutorial. Comprehensive and well-organized. Free.",
      url: "https://javascript.info/",
      rating: 4.9
    },
    {
      type: "website",
      title: "MDN Web Docs",
      description: "Mozilla's JavaScript reference. The authoritative resource. Free.",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      rating: 5.0
    },
    {
      type: "website",
      title: "JavaScript30",
      description: "30 vanilla JS projects in 30 days by Wes Bos. Free.",
      url: "https://javascript30.com/",
      rating: 4.8
    },
    // Communities
    {
      type: "reddit",
      title: "r/javascript",
      description: "JavaScript news, articles, and discussions. Free.",
      url: "https://www.reddit.com/r/javascript/",
      rating: 4.6
    },
    {
      type: "discord",
      title: "Reactiflux",
      description: "Large community for React and JavaScript developers. Free.",
      url: "https://www.reactiflux.com/",
      rating: 4.8
    }
  ],

  "react": [
    // Courses
    {
      type: "course",
      title: "React - The Complete Guide 2024",
      provider: "Udemy, Maximilian Schwarzmüller",
      description: "Most comprehensive React course. Covers hooks, Redux, Next.js. Paid.",
      url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
      rating: 4.7
    },
    {
      type: "course",
      title: "React Official Tutorial",
      provider: "React Team",
      description: "Learn React from the source. Updated for React 18. Free.",
      url: "https://react.dev/learn",
      rating: 4.9
    },
    {
      type: "course",
      title: "Full Stack Open - React",
      provider: "University of Helsinki",
      description: "Modern React and full-stack development. University quality, free.",
      url: "https://fullstackopen.com/en/",
      rating: 4.9
    },
    {
      type: "course",
      title: "Epic React",
      provider: "Kent C. Dodds",
      description: "Advanced React patterns from a React expert. Worth the investment. Paid.",
      url: "https://epicreact.dev/",
      rating: 4.9
    },
    // Books
    {
      type: "book",
      title: "React Documentation",
      author: "React Team",
      description: "New interactive React docs. The best starting point. Free.",
      url: "https://react.dev/",
      rating: 5.0
    },
    {
      type: "book",
      title: "Learning React",
      author: "Alex Banks & Eve Porcello",
      description: "Functional web development with React and Redux. Paid.",
      url: "https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/",
      rating: 4.6
    },
    // YouTube
    {
      type: "youtube",
      title: "Codevolution",
      description: "In-depth React tutorials including hooks, Redux, and TypeScript. Free.",
      url: "https://www.youtube.com/c/Codevolution",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Jack Herrington",
      description: "Advanced React patterns and best practices. Great for experienced devs. Free.",
      url: "https://www.youtube.com/c/JackHerrington",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Theo - t3.gg",
      description: "Modern React ecosystem and best practices. Opinionated but insightful. Free.",
      url: "https://www.youtube.com/c/TheoBrowne1017",
      rating: 4.7
    },
    // Websites
    {
      type: "website",
      title: "React Docs",
      description: "Official React documentation. Interactive examples and guides. Free.",
      url: "https://react.dev/",
      rating: 5.0
    },
    {
      type: "website",
      title: "React Patterns",
      description: "Common React patterns and best practices. Free.",
      url: "https://reactpatterns.com/",
      rating: 4.5
    },
    // Communities
    {
      type: "discord",
      title: "Reactiflux",
      description: "200K+ React developers. Active help channels. Free.",
      url: "https://www.reactiflux.com/",
      rating: 4.8
    },
    {
      type: "reddit",
      title: "r/reactjs",
      description: "React community with news, help, and discussions. Free.",
      url: "https://www.reddit.com/r/reactjs/",
      rating: 4.7
    }
  ],

  "web development": [
    // Courses
    {
      type: "course",
      title: "The Odin Project",
      provider: "Community",
      description: "Complete free curriculum for full-stack web development. Project-based. Free.",
      url: "https://www.theodinproject.com/",
      rating: 4.9
    },
    {
      type: "course",
      title: "CS50's Web Programming with Python and JavaScript",
      provider: "Harvard via edX",
      description: "Build web apps with Python, JavaScript, and SQL. University quality. Free.",
      url: "https://cs50.harvard.edu/web/",
      rating: 4.8
    },
    {
      type: "course",
      title: "Full Stack Open",
      provider: "University of Helsinki",
      description: "Modern web development with React, Node, and GraphQL. Free.",
      url: "https://fullstackopen.com/en/",
      rating: 4.9
    },
    {
      type: "course",
      title: "freeCodeCamp Responsive Web Design",
      provider: "freeCodeCamp",
      description: "Learn HTML, CSS with hands-on projects. Earn certification. Free.",
      url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "MDN Web Development Learning Path",
      author: "Mozilla",
      description: "Comprehensive web dev curriculum from the MDN team. Free.",
      url: "https://developer.mozilla.org/en-US/docs/Learn",
      rating: 4.9
    },
    {
      type: "book",
      title: "HTML & CSS: Design and Build Websites",
      author: "Jon Duckett",
      description: "Beautiful visual introduction to web development. Beginner-friendly. Paid.",
      url: "https://www.htmlandcssbook.com/",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "Fireship",
      description: "Quick, high-quality web dev tutorials and news. Free.",
      url: "https://www.youtube.com/c/Fireship",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Traversy Media",
      description: "Practical web development tutorials from basics to advanced. Free.",
      url: "https://www.youtube.com/c/TraversyMedia",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Kevin Powell",
      description: "CSS master. Deep dives into modern CSS techniques. Free.",
      url: "https://www.youtube.com/kepowob",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Net Ninja",
      description: "Complete courses on web technologies. Great for following along. Free.",
      url: "https://www.youtube.com/c/TheNetNinja",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "MDN Web Docs",
      description: "The definitive web development reference. Free.",
      url: "https://developer.mozilla.org/",
      rating: 5.0
    },
    {
      type: "website",
      title: "CSS-Tricks",
      description: "Tips, tricks, and techniques on CSS and web design. Free.",
      url: "https://css-tricks.com/",
      rating: 4.7
    },
    {
      type: "website",
      title: "Frontend Mentor",
      description: "Real-world projects to build your portfolio. Free tier available.",
      url: "https://www.frontendmentor.io/",
      rating: 4.8
    },
    // Communities
    {
      type: "reddit",
      title: "r/webdev",
      description: "Web development community with news and discussions. Free.",
      url: "https://www.reddit.com/r/webdev/",
      rating: 4.6
    },
    {
      type: "discord",
      title: "The Coding Den",
      description: "Friendly community for developers of all levels. Free.",
      url: "https://discord.gg/code",
      rating: 4.7
    }
  ],

  "cyber security": [
    // Courses
    {
      type: "course",
      title: "Google Cybersecurity Professional Certificate",
      provider: "Coursera",
      description: "Job-ready cybersecurity skills from Google. Beginner-friendly. Free to audit.",
      url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
      rating: 4.8
    },
    {
      type: "course",
      title: "TryHackMe",
      provider: "TryHackMe",
      description: "Hands-on cybersecurity training with virtual labs. Gamified learning. Free tier + Paid.",
      url: "https://tryhackme.com/",
      rating: 4.9
    },
    {
      type: "course",
      title: "Hack The Box Academy",
      provider: "Hack The Box",
      description: "Structured cybersecurity learning paths. Industry-recognized. Free tier + Paid.",
      url: "https://academy.hackthebox.com/",
      rating: 4.8
    },
    {
      type: "course",
      title: "Introduction to Cyber Security Specialization",
      provider: "Coursera, NYU",
      description: "Foundational cybersecurity concepts from NYU. Free to audit.",
      url: "https://www.coursera.org/specializations/intro-cyber-security",
      rating: 4.6
    },
    // Books
    {
      type: "book",
      title: "The Web Application Hacker's Handbook",
      author: "Dafydd Stuttard & Marcus Pinto",
      description: "The bible of web application security testing. Essential reading. Paid.",
      url: "https://portswigger.net/web-security/web-application-hackers-handbook",
      rating: 4.9
    },
    {
      type: "book",
      title: "Hacking: The Art of Exploitation",
      author: "Jon Erickson",
      description: "Classic introduction to hacking techniques and exploitation. Paid.",
      url: "https://nostarch.com/hacking2.htm",
      rating: 4.8
    },
    {
      type: "book",
      title: "OWASP Testing Guide",
      author: "OWASP Foundation",
      description: "Comprehensive web security testing methodology. Free.",
      url: "https://owasp.org/www-project-web-security-testing-guide/",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "NetworkChuck",
      description: "Engaging cybersecurity and networking tutorials. Great for beginners. Free.",
      url: "https://www.youtube.com/c/NetworkChuck",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "John Hammond",
      description: "CTF walkthroughs and security research. Excellent for learning. Free.",
      url: "https://www.youtube.com/c/JohnHammond010",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "LiveOverflow",
      description: "Deep technical security content. Great for understanding vulnerabilities. Free.",
      url: "https://www.youtube.com/c/LiveOverflow",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "IppSec",
      description: "Hack The Box walkthroughs. Learn real penetration testing. Free.",
      url: "https://www.youtube.com/c/ippsec",
      rating: 4.9
    },
    // Websites
    {
      type: "website",
      title: "PortSwigger Web Security Academy",
      description: "Free, comprehensive web security training from Burp Suite creators. Free.",
      url: "https://portswigger.net/web-security",
      rating: 5.0
    },
    {
      type: "website",
      title: "OWASP",
      description: "Open-source web security resources and documentation. Free.",
      url: "https://owasp.org/",
      rating: 4.8
    },
    {
      type: "website",
      title: "OverTheWire Wargames",
      description: "Learn security concepts through games. Great for practice. Free.",
      url: "https://overthewire.org/wargames/",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/netsec",
      description: "Network security news and discussions. Professional community. Free.",
      url: "https://www.reddit.com/r/netsec/",
      rating: 4.7
    },
    {
      type: "discord",
      title: "Hack The Box Discord",
      description: "Active security community with help and discussions. Free.",
      url: "https://discord.gg/hackthebox",
      rating: 4.8
    }
  ],

  "cloud computing": [
    // Courses
    {
      type: "course",
      title: "AWS Cloud Practitioner Essentials",
      provider: "AWS",
      description: "Official AWS foundational course. Great starting point. Free.",
      url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
      rating: 4.7
    },
    {
      type: "course",
      title: "Google Cloud Digital Leader Training",
      provider: "Google Cloud",
      description: "Introduction to Google Cloud concepts and services. Free.",
      url: "https://cloud.google.com/training/cloud-infrastructure#cloud-digital-leader-path",
      rating: 4.6
    },
    {
      type: "course",
      title: "Microsoft Azure Fundamentals (AZ-900)",
      provider: "Microsoft Learn",
      description: "Free Azure fundamentals training from Microsoft. Free.",
      url: "https://learn.microsoft.com/en-us/training/paths/az-900-describe-cloud-concepts/",
      rating: 4.7
    },
    {
      type: "course",
      title: "AWS Solutions Architect Associate",
      provider: "Udemy, Stephane Maarek",
      description: "Best-selling AWS certification course. Thorough and practical. Paid.",
      url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
      rating: 4.8
    },
    // Books
    {
      type: "book",
      title: "AWS Documentation",
      author: "Amazon Web Services",
      description: "Official AWS documentation. Comprehensive and authoritative. Free.",
      url: "https://docs.aws.amazon.com/",
      rating: 4.8
    },
    {
      type: "book",
      title: "The Google Cloud Cookbook",
      author: "Rui Costa & Drew Hodun",
      description: "Practical recipes for Google Cloud Platform. Paid.",
      url: "https://www.oreilly.com/library/view/google-cloud-cookbook/9781492092889/",
      rating: 4.5
    },
    {
      type: "book",
      title: "Kubernetes Up & Running",
      author: "Brendan Burns, Joe Beda, Kelsey Hightower",
      description: "Essential guide to container orchestration. From Kubernetes creators. Paid.",
      url: "https://www.oreilly.com/library/view/kubernetes-up-and/9781098110192/",
      rating: 4.8
    },
    // YouTube
    {
      type: "youtube",
      title: "TechWorld with Nana",
      description: "DevOps and cloud computing tutorials. Beginner-friendly. Free.",
      url: "https://www.youtube.com/c/TechWorldwithNana",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "AWS Events",
      description: "Official AWS conference talks and tutorials. Free.",
      url: "https://www.youtube.com/c/AWSEventsChannel",
      rating: 4.6
    },
    {
      type: "youtube",
      title: "Google Cloud Tech",
      description: "Official Google Cloud tutorials and updates. Free.",
      url: "https://www.youtube.com/c/GoogleCloudTech",
      rating: 4.7
    },
    // Websites
    {
      type: "website",
      title: "AWS Skill Builder",
      description: "Free AWS learning platform with courses and labs. Free tier available.",
      url: "https://skillbuilder.aws/",
      rating: 4.7
    },
    {
      type: "website",
      title: "Microsoft Learn",
      description: "Free Azure learning paths and modules. Free.",
      url: "https://learn.microsoft.com/en-us/azure/",
      rating: 4.8
    },
    {
      type: "website",
      title: "Google Cloud Skills Boost",
      description: "Google Cloud learning platform with labs. Free tier + Paid.",
      url: "https://www.cloudskillsboost.google/",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/aws",
      description: "AWS community with tips, news, and help. Free.",
      url: "https://www.reddit.com/r/aws/",
      rating: 4.6
    },
    {
      type: "reddit",
      title: "r/kubernetes",
      description: "Kubernetes community for container orchestration. Free.",
      url: "https://www.reddit.com/r/kubernetes/",
      rating: 4.7
    }
  ],

  "devops": [
    // Courses
    {
      type: "course",
      title: "DevOps with Docker",
      provider: "University of Helsinki",
      description: "Learn Docker from basics to deployment. Free.",
      url: "https://devopswithdocker.com/",
      rating: 4.8
    },
    {
      type: "course",
      title: "DevOps with Kubernetes",
      provider: "University of Helsinki",
      description: "Kubernetes fundamentals and practices. Free.",
      url: "https://devopswithkubernetes.com/",
      rating: 4.7
    },
    {
      type: "course",
      title: "Docker and Kubernetes: The Complete Guide",
      provider: "Udemy, Stephen Grider",
      description: "Comprehensive Docker and K8s course with projects. Paid.",
      url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
      rating: 4.7
    },
    {
      type: "course",
      title: "GitHub Actions - The Complete Guide",
      provider: "Udemy, Maximilian Schwarzmüller",
      description: "Master CI/CD with GitHub Actions. Paid.",
      url: "https://www.udemy.com/course/github-actions-the-complete-guide/",
      rating: 4.8
    },
    // Books
    {
      type: "book",
      title: "The Phoenix Project",
      author: "Gene Kim, Kevin Behr, George Spafford",
      description: "Novel about IT and DevOps transformation. Essential reading. Paid.",
      url: "https://itrevolution.com/product/the-phoenix-project/",
      rating: 4.8
    },
    {
      type: "book",
      title: "The DevOps Handbook",
      author: "Gene Kim, Jez Humble, Patrick Debois",
      description: "How to create world-class agility with DevOps. Paid.",
      url: "https://itrevolution.com/product/the-devops-handbook-second-edition/",
      rating: 4.7
    },
    {
      type: "book",
      title: "Docker Documentation",
      author: "Docker Inc.",
      description: "Official Docker docs and tutorials. Free.",
      url: "https://docs.docker.com/",
      rating: 4.8
    },
    // YouTube
    {
      type: "youtube",
      title: "TechWorld with Nana",
      description: "DevOps, Kubernetes, and cloud tutorials. Beginner-friendly. Free.",
      url: "https://www.youtube.com/c/TechWorldwithNana",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "DevOps Directive",
      description: "DevOps tools and practices explained clearly. Free.",
      url: "https://www.youtube.com/c/DevOpsDirective",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "Kunal Kushwaha",
      description: "DevOps bootcamp and tutorials. Great for beginners. Free.",
      url: "https://www.youtube.com/c/KunalKushwaha",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "Kubernetes Documentation",
      description: "Official K8s docs with tutorials and examples. Free.",
      url: "https://kubernetes.io/docs/",
      rating: 4.9
    },
    {
      type: "website",
      title: "DevOps Roadmap",
      description: "Step-by-step DevOps learning roadmap. Free.",
      url: "https://roadmap.sh/devops",
      rating: 4.8
    },
    {
      type: "website",
      title: "KodeKloud",
      description: "DevOps labs and practice environments. Free tier + Paid.",
      url: "https://kodekloud.com/",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/devops",
      description: "DevOps community with discussions and resources. Free.",
      url: "https://www.reddit.com/r/devops/",
      rating: 4.7
    },
    {
      type: "discord",
      title: "DevOps, SRE, & Infrastructure",
      description: "Active DevOps community for help and networking. Free.",
      url: "https://discord.gg/VEEnHkPzY6",
      rating: 4.6
    }
  ],

  "artificial intelligence": [
    // Courses
    {
      type: "course",
      title: "CS50's Introduction to Artificial Intelligence",
      provider: "Harvard via edX",
      description: "AI fundamentals with Python. Covers search, knowledge, uncertainty, learning. Free.",
      url: "https://cs50.harvard.edu/ai/",
      rating: 4.9
    },
    {
      type: "course",
      title: "Deep Learning Specialization",
      provider: "Coursera, deeplearning.ai",
      description: "Andrew Ng's legendary deep learning courses. Free to audit.",
      url: "https://www.coursera.org/specializations/deep-learning",
      rating: 4.9
    },
    {
      type: "course",
      title: "Practical Deep Learning for Coders",
      provider: "Fast.ai",
      description: "Build deep learning models from day one. Free.",
      url: "https://course.fast.ai/",
      rating: 4.9
    },
    {
      type: "course",
      title: "Hugging Face NLP Course",
      provider: "Hugging Face",
      description: "Learn NLP with transformers library. Free.",
      url: "https://huggingface.co/learn/nlp-course",
      rating: 4.8
    },
    // Books
    {
      type: "book",
      title: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell & Peter Norvig",
      description: "The definitive AI textbook used worldwide. Paid.",
      url: "http://aima.cs.berkeley.edu/",
      rating: 4.8
    },
    {
      type: "book",
      title: "Deep Learning",
      author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
      description: "Comprehensive deep learning textbook. Free online.",
      url: "https://www.deeplearningbook.org/",
      rating: 4.7
    },
    {
      type: "book",
      title: "Dive into Deep Learning",
      author: "Aston Zhang et al.",
      description: "Interactive deep learning book with code. Free online.",
      url: "https://d2l.ai/",
      rating: 4.8
    },
    // YouTube
    {
      type: "youtube",
      title: "Two Minute Papers",
      description: "AI research papers explained in minutes. Stay current. Free.",
      url: "https://www.youtube.com/c/KárolyZsolnai",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Yannic Kilcher",
      description: "Deep dives into AI research papers. For advanced learners. Free.",
      url: "https://www.youtube.com/c/YannicKilcher",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "Lex Fridman",
      description: "Interviews with AI researchers and leaders. Free.",
      url: "https://www.youtube.com/c/lexfridman",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "OpenAI Documentation",
      description: "Learn to use GPT and other OpenAI models. Free.",
      url: "https://platform.openai.com/docs",
      rating: 4.7
    },
    {
      type: "website",
      title: "Hugging Face",
      description: "AI models, datasets, and tutorials. Free.",
      url: "https://huggingface.co/",
      rating: 4.9
    },
    {
      type: "website",
      title: "Distill.pub",
      description: "Clear explanations of machine learning research. Free.",
      url: "https://distill.pub/",
      rating: 4.9
    },
    // Communities
    {
      type: "reddit",
      title: "r/artificial",
      description: "AI news and discussions. Free.",
      url: "https://www.reddit.com/r/artificial/",
      rating: 4.5
    },
    {
      type: "discord",
      title: "Hugging Face Discord",
      description: "AI/ML community with model discussions. Free.",
      url: "https://discord.gg/huggingface",
      rating: 4.8
    }
  ],

  "sql": [
    // Courses
    {
      type: "course",
      title: "SQL for Data Science",
      provider: "Coursera, UC Davis",
      description: "Learn SQL for data analysis. Beginner-friendly. Free to audit.",
      url: "https://www.coursera.org/learn/sql-for-data-science",
      rating: 4.6
    },
    {
      type: "course",
      title: "The Complete SQL Bootcamp",
      provider: "Udemy, Jose Portilla",
      description: "PostgreSQL focused SQL course with exercises. Paid.",
      url: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "Learning SQL",
      author: "Alan Beaulieu",
      description: "Comprehensive SQL fundamentals book. Paid.",
      url: "https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/",
      rating: 4.6
    },
    // Websites
    {
      type: "website",
      title: "SQLBolt",
      description: "Interactive SQL lessons with exercises. Free.",
      url: "https://sqlbolt.com/",
      rating: 4.9
    },
    {
      type: "website",
      title: "Mode SQL Tutorial",
      description: "SQL tutorial with real datasets and practice. Free.",
      url: "https://mode.com/sql-tutorial/",
      rating: 4.8
    },
    {
      type: "website",
      title: "W3Schools SQL",
      description: "Interactive SQL reference with try-it-yourself. Free.",
      url: "https://www.w3schools.com/sql/",
      rating: 4.5
    },
    {
      type: "website",
      title: "PostgreSQL Tutorial",
      description: "Comprehensive PostgreSQL tutorial. Free.",
      url: "https://www.postgresqltutorial.com/",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "Alex The Analyst - SQL Series",
      description: "Practical SQL tutorials for data analysts. Free.",
      url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8GT6N5ne2qpf603sF26m2PW",
      rating: 4.8
    },
    // Communities
    {
      type: "reddit",
      title: "r/SQL",
      description: "SQL help and discussion community. Free.",
      url: "https://www.reddit.com/r/SQL/",
      rating: 4.6
    }
  ],

  "git": [
    // Courses
    {
      type: "course",
      title: "Git and GitHub for Beginners",
      provider: "freeCodeCamp",
      description: "Complete Git crash course on YouTube. Free.",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      rating: 4.8
    },
    // Books
    {
      type: "book",
      title: "Pro Git",
      author: "Scott Chacon & Ben Straub",
      description: "The complete Git book. Available free online.",
      url: "https://git-scm.com/book/en/v2",
      rating: 4.9
    },
    // Websites
    {
      type: "website",
      title: "Learn Git Branching",
      description: "Interactive Git branching tutorial. Visual and fun. Free.",
      url: "https://learngitbranching.js.org/",
      rating: 5.0
    },
    {
      type: "website",
      title: "GitHub Skills",
      description: "Interactive GitHub courses from GitHub. Free.",
      url: "https://skills.github.com/",
      rating: 4.8
    },
    {
      type: "website",
      title: "Atlassian Git Tutorials",
      description: "Comprehensive Git tutorials and guides. Free.",
      url: "https://www.atlassian.com/git/tutorials",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "The Coding Train - Git and GitHub",
      description: "Beginner-friendly Git series with animations. Free.",
      url: "https://www.youtube.com/playlist?list=PLRqwX-V7Uu6ZF9C0YMKuns9sLDzK6zoiV",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/git",
      description: "Git help and best practices. Free.",
      url: "https://www.reddit.com/r/git/",
      rating: 4.5
    }
  ],

  "system design": [
    // Courses
    {
      type: "course",
      title: "Grokking System Design Interview",
      provider: "Educative",
      description: "Popular system design course for interviews. Paid.",
      url: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      description: "The system design bible. Essential for engineers. Paid.",
      url: "https://dataintensive.net/",
      rating: 4.9
    },
    {
      type: "book",
      title: "System Design Interview",
      author: "Alex Xu",
      description: "Step-by-step framework for system design interviews. Paid.",
      url: "https://bytebytego.com/",
      rating: 4.8
    },
    // YouTube
    {
      type: "youtube",
      title: "ByteByteGo",
      description: "System design concepts explained visually. Free.",
      url: "https://www.youtube.com/c/ByteByteGo",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "System Design Interview",
      description: "Deep dives into real system designs. Free.",
      url: "https://www.youtube.com/c/SystemDesignInterview",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "Gaurav Sen",
      description: "System design tutorials and interview prep. Free.",
      url: "https://www.youtube.com/c/GauravSensei",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "System Design Primer",
      description: "Comprehensive GitHub repo for system design. Free.",
      url: "https://github.com/donnemartin/system-design-primer",
      rating: 4.9
    },
    {
      type: "website",
      title: "High Scalability",
      description: "Real-world architecture case studies. Free.",
      url: "http://highscalability.com/",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/ExperiencedDevs",
      description: "Senior developer discussions including system design. Free.",
      url: "https://www.reddit.com/r/ExperiencedDevs/",
      rating: 4.7
    }
  ],

  "algorithms": [
    // Courses
    {
      type: "course",
      title: "Algorithms Specialization",
      provider: "Coursera, Stanford",
      description: "Stanford's algorithm courses by Tim Roughgarden. Free to audit.",
      url: "https://www.coursera.org/specializations/algorithms",
      rating: 4.8
    },
    {
      type: "course",
      title: "Algorithms, Part I & II",
      provider: "Coursera, Princeton",
      description: "Princeton's algorithms course with Robert Sedgewick. Free.",
      url: "https://www.coursera.org/learn/algorithms-part1",
      rating: 4.9
    },
    // Books
    {
      type: "book",
      title: "Introduction to Algorithms (CLRS)",
      author: "Cormen, Leiserson, Rivest, Stein",
      description: "The algorithms bible. Comprehensive reference. Paid.",
      url: "https://mitpress.mit.edu/books/introduction-algorithms-fourth-edition",
      rating: 4.7
    },
    {
      type: "book",
      title: "Grokking Algorithms",
      author: "Aditya Bhargava",
      description: "Illustrated guide to algorithms. Beginner-friendly. Paid.",
      url: "https://www.manning.com/books/grokking-algorithms-second-edition",
      rating: 4.8
    },
    // Websites
    {
      type: "website",
      title: "LeetCode",
      description: "Coding problems for interview prep. Free tier + Paid.",
      url: "https://leetcode.com/",
      rating: 4.8
    },
    {
      type: "website",
      title: "NeetCode",
      description: "Curated LeetCode problems with video solutions. Free.",
      url: "https://neetcode.io/",
      rating: 4.9
    },
    {
      type: "website",
      title: "Visualgo",
      description: "Visualize algorithms and data structures. Free.",
      url: "https://visualgo.net/",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "NeetCode",
      description: "LeetCode solutions and DSA explanations. Free.",
      url: "https://www.youtube.com/c/NeetCode",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Abdul Bari",
      description: "Algorithm tutorials with clear explanations. Free.",
      url: "https://www.youtube.com/c/AbdulBari",
      rating: 4.8
    },
    // Communities
    {
      type: "reddit",
      title: "r/leetcode",
      description: "LeetCode and algorithms discussion. Free.",
      url: "https://www.reddit.com/r/leetcode/",
      rating: 4.6
    }
  ],

  "blockchain": [
    // Courses
    {
      type: "course",
      title: "Blockchain Specialization",
      provider: "Coursera, University at Buffalo",
      description: "Comprehensive blockchain introduction. Free to audit.",
      url: "https://www.coursera.org/specializations/blockchain",
      rating: 4.5
    },
    {
      type: "course",
      title: "CryptoZombies",
      description: "Learn Solidity by building a game. Interactive and fun. Free.",
      url: "https://cryptozombies.io/",
      rating: 4.8
    },
    {
      type: "course",
      title: "Solidity by Example",
      description: "Learn Solidity through examples. Free.",
      url: "https://solidity-by-example.org/",
      rating: 4.7
    },
    // Books
    {
      type: "book",
      title: "Mastering Bitcoin",
      author: "Andreas M. Antonopoulos",
      description: "Technical deep dive into Bitcoin. Free on GitHub.",
      url: "https://github.com/bitcoinbook/bitcoinbook",
      rating: 4.8
    },
    {
      type: "book",
      title: "Mastering Ethereum",
      author: "Andreas M. Antonopoulos & Gavin Wood",
      description: "Ethereum and smart contracts guide. Free on GitHub.",
      url: "https://github.com/ethereumbook/ethereumbook",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "Patrick Collins",
      description: "Full smart contract development courses. Free.",
      url: "https://www.youtube.com/c/PatrickCollins",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Dapp University",
      description: "Ethereum and DeFi development tutorials. Free.",
      url: "https://www.youtube.com/c/DappUniversity",
      rating: 4.6
    },
    // Websites
    {
      type: "website",
      title: "Ethereum.org Learn",
      description: "Official Ethereum learning resources. Free.",
      url: "https://ethereum.org/en/learn/",
      rating: 4.8
    },
    {
      type: "website",
      title: "Solidity Documentation",
      description: "Official Solidity docs. Free.",
      url: "https://docs.soliditylang.org/",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/ethdev",
      description: "Ethereum development community. Free.",
      url: "https://www.reddit.com/r/ethdev/",
      rating: 4.7
    }
  ],

  "ui ux design": [
    // Courses
    {
      type: "course",
      title: "Google UX Design Professional Certificate",
      provider: "Coursera",
      description: "Complete UX design curriculum from Google. Free to audit.",
      url: "https://www.coursera.org/professional-certificates/google-ux-design",
      rating: 4.8
    },
    {
      type: "course",
      title: "Figma UI UX Design Essentials",
      provider: "Udemy, Daniel Scott",
      description: "Learn Figma for UI/UX design. Paid.",
      url: "https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/",
      rating: 4.6
    },
    // Books
    {
      type: "book",
      title: "Don't Make Me Think",
      author: "Steve Krug",
      description: "Web usability classic. Essential reading. Paid.",
      url: "https://sensible.com/dont-make-me-think/",
      rating: 4.8
    },
    {
      type: "book",
      title: "The Design of Everyday Things",
      author: "Don Norman",
      description: "Fundamental design principles. Must-read. Paid.",
      url: "https://www.nngroup.com/books/design-everyday-things-revised/",
      rating: 4.7
    },
    {
      type: "book",
      title: "Refactoring UI",
      author: "Adam Wathan & Steve Schoger",
      description: "Practical UI design tips for developers. Paid.",
      url: "https://www.refactoringui.com/",
      rating: 4.9
    },
    // YouTube
    {
      type: "youtube",
      title: "Figma",
      description: "Official Figma tutorials and tips. Free.",
      url: "https://www.youtube.com/c/Figma",
      rating: 4.7
    },
    {
      type: "youtube",
      title: "DesignCourse",
      description: "UI/UX and web design tutorials. Free.",
      url: "https://www.youtube.com/c/DesignCourse",
      rating: 4.6
    },
    // Websites
    {
      type: "website",
      title: "Nielsen Norman Group",
      description: "UX research and articles. Industry authority. Free.",
      url: "https://www.nngroup.com/articles/",
      rating: 4.9
    },
    {
      type: "website",
      title: "Laws of UX",
      description: "Collection of UX principles with explanations. Free.",
      url: "https://lawsofux.com/",
      rating: 4.8
    },
    {
      type: "website",
      title: "Figma Community",
      description: "Free design resources and templates. Free.",
      url: "https://www.figma.com/community",
      rating: 4.7
    },
    // Communities
    {
      type: "reddit",
      title: "r/UXDesign",
      description: "UX design community and resources. Free.",
      url: "https://www.reddit.com/r/UXDesign/",
      rating: 4.5
    }
  ],

  "mobile development": [
    // Courses
    {
      type: "course",
      title: "CS193p - Developing Apps for iOS",
      provider: "Stanford University",
      description: "Stanford's iOS development course with SwiftUI. Free.",
      url: "https://cs193p.sites.stanford.edu/",
      rating: 4.9
    },
    {
      type: "course",
      title: "Android Basics with Compose",
      provider: "Google",
      description: "Official Android development course. Free.",
      url: "https://developer.android.com/courses/android-basics-compose/course",
      rating: 4.8
    },
    {
      type: "course",
      title: "The Complete Flutter Development Bootcamp",
      provider: "Udemy, Angela Yu",
      description: "Cross-platform mobile development with Flutter. Paid.",
      url: "https://www.udemy.com/course/flutter-bootcamp-with-dart/",
      rating: 4.7
    },
    {
      type: "course",
      title: "React Native - The Practical Guide",
      provider: "Udemy, Maximilian Schwarzmüller",
      description: "Build cross-platform apps with React Native. Paid.",
      url: "https://www.udemy.com/course/react-native-the-practical-guide/",
      rating: 4.6
    },
    // Books
    {
      type: "book",
      title: "SwiftUI Documentation",
      author: "Apple",
      description: "Official SwiftUI tutorials and reference. Free.",
      url: "https://developer.apple.com/tutorials/swiftui",
      rating: 4.8
    },
    {
      type: "book",
      title: "Flutter Documentation",
      author: "Google",
      description: "Official Flutter docs with codelabs. Free.",
      url: "https://docs.flutter.dev/",
      rating: 4.7
    },
    // YouTube
    {
      type: "youtube",
      title: "Sean Allen",
      description: "Swift and iOS development tutorials. Free.",
      url: "https://www.youtube.com/c/SeanAllen",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "Philipp Lackner",
      description: "Android and Kotlin tutorials. Free.",
      url: "https://www.youtube.com/c/PhilippLackner",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "The Flutter Way",
      description: "Flutter UI tutorials and projects. Free.",
      url: "https://www.youtube.com/c/TheFlutterWay",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/FlutterDev",
      description: "Flutter development community. Free.",
      url: "https://www.reddit.com/r/FlutterDev/",
      rating: 4.7
    },
    {
      type: "reddit",
      title: "r/iOSProgramming",
      description: "iOS development discussions. Free.",
      url: "https://www.reddit.com/r/iOSProgramming/",
      rating: 4.6
    }
  ],

  "software development": [
    // Courses
    {
      type: "course",
      title: "CS50: Introduction to Computer Science",
      provider: "Harvard via edX",
      description: "Harvard's legendary intro CS course. Free.",
      url: "https://cs50.harvard.edu/x/",
      rating: 5.0
    },
    {
      type: "course",
      title: "Missing Semester of Your CS Education",
      provider: "MIT",
      description: "Practical skills every developer needs. Free.",
      url: "https://missing.csail.mit.edu/",
      rating: 4.9
    },
    // Books
    {
      type: "book",
      title: "Clean Code",
      author: "Robert C. Martin",
      description: "Writing maintainable, professional code. Essential. Paid.",
      url: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
      rating: 4.8
    },
    {
      type: "book",
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      description: "Timeless software development wisdom. Paid.",
      url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      rating: 4.9
    },
    {
      type: "book",
      title: "Design Patterns",
      author: "Gang of Four",
      description: "Classic software design patterns. Paid.",
      url: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
      rating: 4.6
    },
    // YouTube
    {
      type: "youtube",
      title: "Fireship",
      description: "Quick tech explainers and tutorials. Free.",
      url: "https://www.youtube.com/c/Fireship",
      rating: 4.9
    },
    {
      type: "youtube",
      title: "Computerphile",
      description: "Computer science concepts explained. Free.",
      url: "https://www.youtube.com/c/Computerphile",
      rating: 4.8
    },
    {
      type: "youtube",
      title: "ThePrimeagen",
      description: "Software development and productivity. Free.",
      url: "https://www.youtube.com/c/ThePrimeagen",
      rating: 4.7
    },
    // Websites
    {
      type: "website",
      title: "Roadmap.sh",
      description: "Developer roadmaps for all paths. Free.",
      url: "https://roadmap.sh/",
      rating: 4.9
    },
    {
      type: "website",
      title: "GeeksforGeeks",
      description: "CS concepts, tutorials, and practice. Free.",
      url: "https://www.geeksforgeeks.org/",
      rating: 4.6
    },
    // Communities
    {
      type: "reddit",
      title: "r/learnprogramming",
      description: "Learning to code support community. Free.",
      url: "https://www.reddit.com/r/learnprogramming/",
      rating: 4.8
    },
    {
      type: "reddit",
      title: "r/cscareerquestions",
      description: "CS career advice and discussions. Free.",
      url: "https://www.reddit.com/r/cscareerquestions/",
      rating: 4.6
    }
  ]
};

// Trending resources for the Explore page
export const trendingResources = [
  {
    title: "Fast.ai - Practical Deep Learning",
    description: "World-class deep learning course. Build real models from day one. Completely free.",
    link: "https://course.fast.ai/",
    icon: "Brain",
    color: "from-purple-500 to-indigo-600",
    difficulty: "intermediate",
    relevantBackgrounds: ["student", "professional", "self-learner"],
    relatedSkills: ["Deep Learning", "Python", "Machine Learning"]
  },
  {
    title: "The Odin Project",
    description: "Complete full-stack curriculum. Project-based learning from zero to job-ready. Free.",
    link: "https://www.theodinproject.com/",
    icon: "Code",
    color: "from-orange-500 to-red-500",
    difficulty: "beginner",
    relevantBackgrounds: ["student", "self-learner"],
    relatedSkills: ["Web Development", "JavaScript", "React"]
  },
  {
    title: "CS50: Introduction to Computer Science",
    description: "Harvard's legendary CS course. Gold standard for CS education. Free.",
    link: "https://cs50.harvard.edu/x/",
    icon: "GraduationCap",
    color: "from-red-500 to-pink-600",
    difficulty: "beginner",
    relevantBackgrounds: ["student", "self-learner"],
    relatedSkills: ["Computer Science", "Programming"]
  },
  {
    title: "PortSwigger Web Security Academy",
    description: "Free, comprehensive web security training from Burp Suite creators.",
    link: "https://portswigger.net/web-security",
    icon: "Shield",
    color: "from-green-500 to-emerald-600",
    difficulty: "intermediate",
    relevantBackgrounds: ["student", "professional"],
    relatedSkills: ["Cyber Security", "Web Security", "Penetration Testing"]
  },
  {
    title: "Kaggle Learn",
    description: "Free micro-courses on ML, Python, and data science with hands-on notebooks.",
    link: "https://www.kaggle.com/learn",
    icon: "Database",
    color: "from-cyan-500 to-blue-500",
    difficulty: "beginner",
    relevantBackgrounds: ["student", "self-learner", "professional"],
    relatedSkills: ["Data Science", "Machine Learning", "Python"]
  },
  {
    title: "Full Stack Open",
    description: "University of Helsinki's modern web development course. React, Node, GraphQL. Free.",
    link: "https://fullstackopen.com/en/",
    icon: "Layers",
    color: "from-blue-500 to-violet-500",
    difficulty: "intermediate",
    relevantBackgrounds: ["student", "professional"],
    relatedSkills: ["React", "Node.js", "Full Stack"]
  }
];

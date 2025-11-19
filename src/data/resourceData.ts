import { Recommendation } from "@/api/searchAPI";

export const resourceData: Record<string, Recommendation[]> = {
    "machine learning": [
        {
            "type": "youtube",
            "title": "Andrew Ng",
            "description": "Founder of deeplearning.ai, sharing high-quality tutorials and insights on machine learning and deep learning. (Free)",
            "url": "https://www.youtube.com/c/AndrewNg"
        },
        {
            "type": "youtube",
            "title": "Sentdex",
            "description": "Practical programming tutorials including deep learning and machine learning projects using Python. (Free)",
            "url": "https://www.youtube.com/user/sentdex"
        },
        {
            "type": "youtube",
            "title": "Deep Lizard",
            "description": "Clear explanations about deep learning concepts, neural networks, and TensorFlow tutorials. (Free)",
            "url": "https://www.youtube.com/c/DeepLizard"
        },
        {
            "type": "youtube",
            "title": "lex Fridman",
            "description": "Interviews and talks with AI researchers and experts covering a variety of deep learning topics. (Free)",
            "url": "https://www.youtube.com/c/lexfridman"
        },
        {
            "type": "youtube",
            "title": "The AI Hacker",
            "description": "Focused tutorials on machine learning, deep learning, and how to implement them in projects. (Free)",
            "url": "https://www.youtube.com/c/TheAIHacker"
        },
        {
            "type": "book",
            "title": "Deep Learning",
            "author": "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
            "description": "Authoritative book covering core concepts and theories in deep learning. (Paid)",
            "url": "https://www.deeplearningbook.org/"
        },
        {
            "type": "book",
            "title": "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
            "author": "Aurélien Géron",
            "description": "Practical guide to machine learning and deep learning using Python libraries. (Paid)",
            "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/"
        },
        {
            "type": "book",
            "title": "Pattern Recognition and Machine Learning",
            "author": "Christopher M. Bishop",
            "description": "Classic machine learning textbook focused on statistical techniques. (Paid)",
            "url": "https://www.springer.com/gp/book/9780387310732"
        },
        {
            "type": "book",
            "title": "Neural Networks and Deep Learning",
            "author": "Michael Nielsen",
            "description": "An online book to understand neural networks and deep learning in an intuitive way. (Free)",
            "url": "http://neuralnetworksanddeeplearning.com/"
        },
        {
            "type": "book",
            "title": "Machine Learning Yearning",
            "author": "Andrew Ng",
            "description": "Strategic guide to designing ML projects by Andrew Ng. (Free)",
            "url": "https://www.deeplearning.ai/machine-learning-yearning/"
        },
        {
            "type": "course",
            "title": "Machine Learning",
            "provider": "Coursera, Andrew Ng",
            "description": "Comprehensive introduction to machine learning concepts and techniques. Free to audit, paid certificate available.",
            "url": "https://www.coursera.org/learn/machine-learning"
        },
        {
            "type": "course",
            "title": "Deep Learning Specialization",
            "provider": "deeplearning.ai, Coursera",
            "description": "In-depth specialization on deep learning, including neural networks and sequence models. (Paid)",
            "url": "https://www.coursera.org/specializations/deep-learning"
        },
        {
            "type": "course",
            "title": "Fast.ai Practical Deep Learning for Coders",
            "provider": "Fast.ai",
            "description": "Hands-on deep learning course emphasizing practical implementation using PyTorch. (Free)",
            "url": "https://course.fast.ai/"
        },
        {
            "type": "course",
            "title": "CS231n: Convolutional Neural Networks for Visual Recognition",
            "provider": "Stanford University",
            "description": "Deep learning course focused on computer vision applications. (Free)",
            "url": "http://cs231n.stanford.edu/"
        },
        {
            "type": "course",
            "title": "MIT Deep Learning for Self-Driving Cars",
            "provider": "MIT OpenCourseWare",
            "description": "Applied deep learning course featuring autonomous driving systems. (Free)",
            "url": "https://selfdrivingcars.mit.edu/"
        },
        {
            "type": "website",
            "title": "TensorFlow Official Docs",
            "description": "Comprehensive tutorials and guides on TensorFlow framework for ML and DL. (Free)",
            "url": "https://www.tensorflow.org/"
        },
        {
            "type": "website",
            "title": "PyTorch Official Docs",
            "description": "Official documentation and tutorials for PyTorch deep learning framework. (Free)",
            "url": "https://pytorch.org/"
        },
        {
            "type": "website",
            "title": "Papers with Code",
            "description": "Latest research papers on ML/DL with code implementations. (Free)",
            "url": "https://paperswithcode.com/"
        },
        {
            "type": "website",
            "title": "DeepLearning.ai",
            "description": "Platform by Andrew Ng offering courses and resources in deep learning and AI. (Paid with some free content)",
            "url": "https://www.deeplearning.ai"
        },
        {
            "type": "website",
            "title": "Machine Learning Mastery",
            "description": "Blog with practical guides, tutorials, and books for ML and DL practice. (Paid and Free content)",
            "url": "https://machinelearningmastery.com/"
        },
        {
            "type": "reddit",
            "title": "r/MachineLearning",
            "description": "Popular community discussing wide-ranging machine learning research and applications. (Free)",
            "url": "https://www.reddit.com/r/MachineLearning/"
        },
        {
            "type": "reddit",
            "title": "r/deeplearning",
            "description": "Focused subreddit on deep learning research, news, and tutorials. (Free)",
            "url": "https://www.reddit.com/r/deeplearning/"
        },
        {
            "type": "reddit",
            "title": "r/LearnMachineLearning",
            "description": "Community of learners sharing resources and advice for mastering machine learning. (Free)",
            "url": "https://www.reddit.com/r/learnmachinelearning/"
        },
        {
            "type": "reddit",
            "title": "r/DataScience",
            "description": "Data science community with significant ML and DL discussions. (Free)",
            "url": "https://www.reddit.com/r/datascience/"
        },
        {
            "type": "reddit",
            "title": "r/ArtificialInteligence",
            "description": "General AI and ML discussions including deep learning topics. (Free)",
            "url": "https://www.reddit.com/r/ArtificialInteligence/"
        },
        {
            "type": "discord",
            "title": "AI & ML Discord Community",
            "description": "Engaged community for machine learning and deep learning help and collaboration. (Free)",
            "url": "https://discord.gg/ai"
        },
        {
            "type": "discord",
            "title": "Deep Learning",
            "description": "Dedicated deep learning discussion and support Discord server. (Free)",
            "url": "https://discord.gg/deeplearning"
        },
        {
            "type": "discord",
            "title": "Machine Learning & Data Science",
            "description": "Active Discord server focusing on ML, DL, data science projects, and career advice. (Free)",
            "url": "https://discord.gg/machinelearning"
        },
        {
            "type": "discord",
            "title": "TensorFlow",
            "description": "Official TensorFlow Discord server with useful ML and DL discussions. (Free)",
            "url": "https://discord.gg/tensorflow"
        },
        {
            "type": "discord",
            "title": "PyTorch",
            "description": "Official PyTorch Discord community focusing on deep learning support and projects. (Free)",
            "url": "https://discord.gg/pytorch"
        }
    ],
    "data science": [
        {
            "type": "youtube",
            "title": "Ken Jee",
            "description": "Covers data science projects, career advice, and tutorials for all skill levels. (Free)",
            "url": "https://www.youtube.com/c/KenJee1"
        },
        {
            "type": "youtube",
            "title": "Data School",
            "description": "Clear, beginner-friendly tutorials on data science concepts and Python tools. (Free)",
            "url": "https://www.youtube.com/c/DataSchool"
        },
        {
            "type": "youtube",
            "title": "Chanin Nantasenamat (Data Professor)",
            "description": "Data science tutorials focused on R, Python, machine learning, and bioinformatics. (Free)",
            "url": "https://www.youtube.com/c/DataProfessor"
        },
        {
            "type": "youtube",
            "title": "Alex The Analyst",
            "description": "Insights into data science career skills, SQL, Tableau, and analytics. (Free)",
            "url": "https://www.youtube.com/@AlexTheAnalyst"
        },
        {
            "type": "youtube",
            "title": "StatQuest with Josh Starmer",
            "description": "Excellent statistical concepts breakdowns for data science and ML. (Free)",
            "url": "https://www.youtube.com/user/joshstarmer"
        },
        {
            "type": "book",
            "title": "Data Science from Scratch",
            "author": "Joel Grus",
            "description": "Practical guide covering data science fundamentals using Python. (Paid)",
            "url": "https://www.oreilly.com/library/view/data-science-from/9781491901427/"
        },
        {
            "type": "book",
            "title": "Python for Data Analysis",
            "author": "Wes McKinney",
            "description": "Comprehensive book on data analysis with pandas and Python. (Paid)",
            "url": "https://www.oreilly.com/library/view/python-for-data/9781491957653/"
        },
        {
            "type": "book",
            "title": "Practical Statistics for Data Scientists",
            "author": "Peter Bruce and Andrew Bruce",
            "description": "Essential statistical concepts for data science practice. (Paid)",
            "url": "https://www.oreilly.com/library/view/practical-statistics-for/9781491952962/"
        },
        {
            "type": "book",
            "title": "The Data Science Handbook",
            "author": "Carl Shan, et al.",
            "description": "Interviews and insights from top data scientists. (Free)",
            "url": "https://www.thedatasciencehandbook.com/"
        },
        {
            "type": "book",
            "title": "Storytelling with Data",
            "author": "Cole Nussbaumer Knaflic",
            "description": "Guide on effective data visualization and storytelling. (Paid)",
            "url": "https://www.storytellingwithdata.com/book"
        },
        {
            "type": "course",
            "title": "IBM Data Science Professional Certificate",
            "provider": "Coursera",
            "description": "Comprehensive introduction to data science concepts and tools. Paid with free audit option.",
            "url": "https://www.coursera.org/professional-certificates/ibm-data-science"
        },
        {
            "type": "course",
            "title": "Data Science MicroMasters",
            "provider": "edX, UC San Diego",
            "description": "Graduate-level courses covering broad data science topics. (Paid)",
            "url": "https://www.edx.org/micromasters/uc-san-diegox-data-science"
        },
        {
            "type": "course",
            "title": "Introduction to Data Science",
            "provider": "Microsoft via edX",
            "description": "Fundamentals of data science including R, Python, and visualization. (Free with paid certificate)",
            "url": "https://www.edx.org/course/introduction-to-data-science"
        },
        {
            "type": "course",
            "title": "Data Science and Machine Learning Bootcamp",
            "provider": "Udemy",
            "description": "Comprehensive course covering data science, ML, and Python tools. (Paid)",
            "url": "https://www.udemy.com/course/data-science-and-machine-learning-bootcamp-with-r/"
        },
        {
            "type": "course",
            "title": "Google Data Analytics Professional Certificate",
            "provider": "Coursera",
            "description": "Robust course on data analytics skills and tools. Paid with free audit option.",
            "url": "https://www.coursera.org/professional-certificates/google-data-analytics"
        },
        {
            "type": "website",
            "title": "Kaggle",
            "description": "Data sets, competitions, and free tutorials for data science projects. (Free)",
            "url": "https://www.kaggle.com/"
        },
        {
            "type": "website",
            "title": "KDnuggets",
            "description": "Data science news, tutorials, and resources. (Free)",
            "url": "https://www.kdnuggets.com/"
        },
        {
            "type": "website",
            "title": "DataCamp",
            "description": "Interactive data science and analytics training platform. (Free trial, paid subscriptions)",
            "url": "https://www.datacamp.com/"
        },
        {
            "type": "website",
            "title": "FlowingData",
            "description": "Data visualization tutorials and examples. (Free)",
            "url": "https://flowingdata.com/"
        },
        {
            "type": "website",
            "title": "FiveThirtyEight",
            "description": "Data-driven journalism with public datasets and explanatory stories. (Free)",
            "url": "https://fivethirtyeight.com/"
        },
        {
            "type": "reddit",
            "title": "r/datascience",
            "description": "Active community for data science questions, resources, and discussions. (Free)",
            "url": "https://www.reddit.com/r/datascience/"
        },
        {
            "type": "reddit",
            "title": "r/dataisbeautiful",
            "description": "Celebrates excellent data visualizations and storytelling. (Free)",
            "url": "https://www.reddit.com/r/dataisbeautiful/"
        },
        {
            "type": "reddit",
            "title": "r/learnDataScience",
            "description": "Community for beginners to learn data science concepts and careers. (Free)",
            "url": "https://www.reddit.com/r/learnDataScience/"
        },
        {
            "type": "reddit",
            "title": "r/bigdata",
            "description": "Discussions on big data technologies, tools, and projects. (Free)",
            "url": "https://www.reddit.com/r/bigdata/"
        },
        {
            "type": "reddit",
            "title": "r/SQL",
            "description": "Community dedicated to SQL for data manipulation and analysis. (Free)",
            "url": "https://www.reddit.com/r/SQL/"
        },
        {
            "type": "discord",
            "title": "Data Science Discord",
            "description": "Discord community for data science discussions, projects, and help. (Free)",
            "url": "https://discord.gg/datascience"
        },
        {
            "type": "discord",
            "title": "DataTalks.Club",
            "description": "Active community for data scientists, learners, and job seekers. (Free)",
            "url": "https://discord.gg/datatalks"
        },
        {
            "type": "discord",
            "title": "Analytics Vidhya",
            "description": "Community with discussions, webinars, and tutorials for data practitioners. (Free)",
            "url": "https://discord.com/invite/analyticsvidhya"
        },
        {
            "type": "discord",
            "title": "r/DataScience Official Server",
            "description": "Official Discord server for the r/datascience Reddit community. (Free)",
            "url": "https://discord.gg/datascienceofficial"
        },
        {
            "type": "discord",
            "title": "Tableau Community",
            "description": "Focused on data visualization and analytics using Tableau software. (Free)",
            "url": "https://discord.gg/tableau"
        }
    ],
    "data analyst": [
        {
            "type": "youtube",
            "title": "Alex The Analyst",
            "description": "Data analyst career guidance, SQL, Excel, and visualization tutorials. (Free)",
            "url": "https://www.youtube.com/@AlexTheAnalyst"
        },
        {
            "type": "youtube",
            "title": "Chanelle Marie",
            "description": "Data analytics tutorials and career advice geared towards new analysts. (Free)",
            "url": "https://www.youtube.com/c/ChanelleMarie"
        },
        {
            "type": "youtube",
            "title": "Career Karma",
            "description": "Data analytics and data science tutorials, bootcamp reviews, and advice. (Free)",
            "url": "https://www.youtube.com/c/CareerKarma"
        },
        {
            "type": "youtube",
            "title": "365 Data Science",
            "description": "Data analyst skills, Excel, Power BI, and Tableau tutorials. (Free and Paid)",
            "url": "https://www.youtube.com/c/365DataScience"
        },
        {
            "type": "youtube",
            "title": "Kevin Stratvert",
            "description": "Excel and Power BI tutorials for aspiring data analysts. (Free)",
            "url": "https://www.youtube.com/user/kevstrat"
        },
        {
            "type": "book",
            "title": "Data Analytics Made Accessible",
            "author": "Anil Maheshwari",
            "description": "Comprehensive guide to data analytics concepts and tools. (Paid)",
            "url": "https://www.amazon.com/Data-Analytics-Made-Accessible-3rd/dp/1537526255"
        },
        {
            "type": "book",
            "title": "Storytelling with Data",
            "author": "Cole Nussbaumer Knaflic",
            "description": "How to effectively visualize and communicate data insights. (Paid)",
            "url": "https://www.storytellingwithdata.com/book"
        },
        {
            "type": "book",
            "title": "Data Analytics for Beginners",
            "author": "Victor Finch",
            "description": "Starting guide for data analysis concepts and basic tools. (Paid)",
            "url": "https://www.amazon.com/Data-Analytics-Beginners-practical-introduction/dp/B08LZQRL45"
        },
        {
            "type": "book",
            "title": "SQL for Data Analytics",
            "author": "Upom Malik",
            "description": "Complete guide to using SQL for querying and analyzing data. (Paid)",
            "url": "https://www.amazon.com/SQL-Data-Analytics-Upom-Malik/dp/1484257292"
        },
        {
            "type": "book",
            "title": "Microsoft Excel Data Analysis and Business Modeling",
            "author": "Wayne Winston",
            "description": "Master Excel techniques for business analytics and data interpretation. (Paid)",
            "url": "https://www.amazon.com/Microsoft-Excel-Analysis-Business-Modeling/dp/1509305887"
        },
        {
            "type": "course",
            "title": "Google Data Analytics Professional Certificate",
            "provider": "Coursera",
            "description": "Foundations of data analysis, visualization, and tools like SQL and R. Free to audit, paid certificate.",
            "url": "https://www.coursera.org/professional-certificates/google-data-analytics"
        },
        {
            "type": "course",
            "title": "Excel to MySQL: Analytic Techniques for Business Specialization",
            "provider": "Coursera, Duke University",
            "description": "Covers Excel, SQL, and data visualization for analytics projects. Paid with free audit.",
            "url": "https://www.coursera.org/specializations/excel-mysql"
        },
        {
            "type": "course",
            "title": "Data Analysis with Python",
            "provider": "freeCodeCamp",
            "description": "Hands-on course teaching data analysis using Python libraries. (Free)",
            "url": "https://www.freecodecamp.org/learn/data-analysis-with-python/"
        },
        {
            "type": "course",
            "title": "Complete Data Analyst Bootcamp",
            "provider": "Udemy",
            "description": "Comprehensive bootcamp covering Excel, SQL, Tableau, and Power BI. (Paid)",
            "url": "https://www.udemy.com/course/the-data-analyst-course/"
        },
        {
            "type": "course",
            "title": "Introduction to Data Analytics",
            "provider": "edX, Microsoft",
            "description": "Beginner friendly course on data analytics principles and techniques. (Free with paid certificate)",
            "url": "https://www.edx.org/course/introduction-to-data-analytics"
        },
        {
            "type": "website",
            "title": "Mode Analytics SQL Tutorial",
            "description": "Free interactive tutorials to learn SQL for data analysis. (Free)",
            "url": "https://mode.com/sql-tutorial/"
        },
        {
            "type": "website",
            "title": "Tableau Public",
            "description": "Free resource for learning and sharing data visualizations. (Free)",
            "url": "https://public.tableau.com/en-us/s/resources"
        },
        {
            "type": "website",
            "title": "DataCamp",
            "description": "Interactive courses covering data analytics tools and techniques. Free trial available, paid subscription.",
            "url": "https://www.datacamp.com/"
        },
        {
            "type": "website",
            "title": "SQLBolt",
            "description": "Interactive SQL lessons and exercises for data analysts. (Free)",
            "url": "https://sqlbolt.com/"
        },
        {
            "type": "website",
            "title": "Analytics Vidhya",
            "description": "Blog and training focused on data analysis, SQL, and visualization skills. (Free and Paid content)",
            "url": "https://www.analyticsvidhya.com/"
        },
        {
            "type": "reddit",
            "title": "r/dataanalysis",
            "description": "Community for data analyst questions, tutorials, and career support. (Free)",
            "url": "https://www.reddit.com/r/dataanalysis/"
        },
        {
            "type": "reddit",
            "title": "r/excel",
            "description": "Community focused on Excel tips, tricks, and problems solving. (Free)",
            "url": "https://www.reddit.com/r/excel/"
        },
        {
            "type": "reddit",
            "title": "r/PowerBI",
            "description": "Community for Microsoft Power BI users to share knowledge and troubleshooting tips. (Free)",
            "url": "https://www.reddit.com/r/PowerBI/"
        },
        {
            "type": "reddit",
            "title": "r/Tableau",
            "description": "Tableau software community sharing dashboards, tutorials, and help. (Free)",
            "url": "https://www.reddit.com/r/Tableau/"
        },
        {
            "type": "reddit",
            "title": "r/SQL",
            "description": "Subreddit dedicated to SQL questions and learning. (Free)",
            "url": "https://www.reddit.com/r/SQL/"
        },
        {
            "type": "discord",
            "title": "Data Analyst Hub",
            "description": "Community for data analyst skill development, jobs, and project collaboration. (Free)",
            "url": "https://discord.gg/dataanalyst"
        },
        {
            "type": "discord",
            "title": "Analytics Vidhya Discord",
            "description": "Discord server with channels focused on data analytics and visualization. (Free)",
            "url": "https://discord.com/invite/analyticsvidhya"
        },
        {
            "type": "discord",
            "title": "Data Visualization Society",
            "description": "Focused on data viz tools, best practices, and careers. (Free)",
            "url": "https://discord.gg/data-viz"
        },
        {
            "type": "discord",
            "title": "Power BI Community",
            "description": "Power BI users supporting each other with tips and help. (Free)",
            "url": "https://discord.gg/powerbi"
        },
        {
            "type": "discord",
            "title": "Tableau Community",
            "description": "Learning and sharing Tableau insights and dashboards. (Free)",
            "url": "https://discord.gg/tableau"
        }
    ],
    "cyber security": [
        {
            "type": "youtube",
            "title": "NetworkChuck",
            "description": "Engaging tutorials covering cybersecurity concepts, certifications, and hands-on labs. (Free)",
            "url": "https://www.youtube.com/c/NetworkChuck"
        },
        {
            "type": "youtube",
            "title": "The Cyber Mentor",
            "description": "In-depth ethical hacking and penetration testing tutorials. (Free and Paid content)",
            "url": "https://www.youtube.com/c/TheCyberMentor"
        },
        {
            "type": "youtube",
            "title": "HackerSploit",
            "description": "Comprehensive cybersecurity, ethical hacking, and Linux tutorials. (Free)",
            "url": "https://www.youtube.com/c/HackerSploit"
        },
        {
            "type": "youtube",
            "title": "John Hammond",
            "description": "Detailed walkthroughs of CTF challenges and cybersecurity concepts. (Free)",
            "url": "https://www.youtube.com/c/JohnHammond010"
        },
        {
            "type": "youtube",
            "title": "LiveOverflow",
            "description": "Explains hacking techniques and security vulnerabilities in an accessible way. (Free)",
            "url": "https://www.youtube.com/c/LiveOverflow"
        },
        {
            "type": "book",
            "title": "The Web Application Hacker's Handbook",
            "author": "Dafydd Stuttard and Marcus Pinto",
            "description": "Detailed guide to web application security and penetration testing. (Paid)",
            "url": "https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470"
        },
        {
            "type": "book",
            "title": "Metasploit: The Penetration Tester's Guide",
            "author": "David Kennedy et al.",
            "description": "Comprehensive guide to using Metasploit for penetration testing. (Paid)",
            "url": "https://www.amazon.com/Metasploit-Penetration-Testers-David-Kennedy/dp/159327288X"
        },
        {
            "type": "book",
            "title": "Hacking: The Art of Exploitation",
            "author": "Jon Erickson",
            "description": "Fundamental guide to hacking techniques and computer security. (Paid)",
            "url": "https://www.nostarch.com/hacking2.htm"
        },
        {
            "type": "book",
            "title": "Cybersecurity and Cyberwar: What Everyone Needs to Know",
            "author": "P.W. Singer and Allan Friedman",
            "description": "Accessible overview of cybersecurity landscape and challenges. (Paid)",
            "url": "https://www.amazon.com/Cybersecurity-Cyberwar-Everyone-Needs-Know/dp/0199918090"
        },
        {
            "type": "book",
            "title": "Blue Team Handbook",
            "author": "Don Murdoch",
            "description": "Defensive cybersecurity guide for blue team professionals. (Paid)",
            "url": "https://www.amazon.com/Blue-Team-Handbook---Field/dp/1515201295"
        },
        {
            "type": "course",
            "title": "Introduction to Cyber Security Specialization",
            "provider": "Coursera, NYU",
            "description": "Covers basic cybersecurity principles, attacks, and defense strategies. Free to audit, paid certificate available.",
            "url": "https://www.coursera.org/specializations/intro-cyber-security"
        },
        {
            "type": "course",
            "title": "Cybersecurity Fundamentals",
            "provider": "edX, Rochester Institute of Technology",
            "description": "Fundamentals of cybersecurity and risk management. Free with paid certificate.",
            "url": "https://www.edx.org/course/cybersecurity-fundamentals"
        },
        {
            "type": "course",
            "title": "Certified Ethical Hacker (CEH) v12",
            "provider": "EC-Council (Official)",
            "description": "Detailed CEH certification preparation course. (Paid)",
            "url": "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/"
        },
        {
            "type": "course",
            "title": "Cybersecurity Bootcamp",
            "provider": "Udemy",
            "description": "Hands-on cybersecurity and ethical hacking course. (Paid)",
            "url": "https://www.udemy.com/course/learn-cyber-security/"
        },
        {
            "type": "course",
            "title": "Practical Network Penetration Tester",
            "provider": "Pentester Academy",
            "description": "Lab-based penetration testing training. (Paid)",
            "url": "https://www.pentesteracademy.com/course?id=7"
        },
        {
            "type": "website",
            "title": "OWASP",
            "description": "Open Web Application Security Project – guides and tools for web security. (Free)",
            "url": "https://owasp.org/"
        },
        {
            "type": "website",
            "title": "Hack The Box",
            "description": "Platform for hands-on penetration testing labs and challenges. (Free and paid tiers)",
            "url": "https://www.hackthebox.eu/"
        },
        {
            "type": "website",
            "title": "Cybrary",
            "description": "Cybersecurity training courses and career resources. (Free and paid content)",
            "url": "https://www.cybrary.it/"
        },
        {
            "type": "website",
            "title": "SecurityTube",
            "description": "Free cybersecurity video tutorials and lectures. (Free)",
            "url": "http://www.securitytube.net/"
        },
        {
            "type": "website",
            "title": "Sans Institute",
            "description": "Industry-leading cybersecurity training and certifications. (Paid)",
            "url": "https://www.sans.org/"
        },
        {
            "type": "reddit",
            "title": "r/cybersecurity",
            "description": "Discussions and news about cybersecurity. (Free)",
            "url": "https://www.reddit.com/r/cybersecurity/"
        },
        {
            "type": "reddit",
            "title": "r/netsec",
            "description": "Network security focused community with news, articles, and help. (Free)",
            "url": "https://www.reddit.com/r/netsec/"
        },
        {
            "type": "reddit",
            "title": "r/ethicalhacking",
            "description": "Ethical hacking tutorials, challenges, and discussions. (Free)",
            "url": "https://www.reddit.com/r/ethicalhacking/"
        },
        {
            "type": "reddit",
            "title": "r/AskNetsec",
            "description": "Community for asking network security questions. (Free)",
            "url": "https://www.reddit.com/r/AskNetsec/"
        },
        {
            "type": "reddit",
            "title": "r/ReverseEngineering",
            "description": "Discussions on reverse engineering malware and software. (Free)",
            "url": "https://www.reddit.com/r/ReverseEngineering/"
        },
        {
            "type": "discord",
            "title": "The Many Hats Club",
            "description": "Cybersecurity community focused on learning and sharing. (Free)",
            "url": "https://discord.gg/themanyhatsclub"
        },
        {
            "type": "discord",
            "title": "HackerOne Community",
            "description": "Bug bounty and security researcher community. (Free)",
            "url": "https://discord.gg/hackerone"
        },
        {
            "type": "discord",
            "title": "InfoSec Prep",
            "description": "Community for cybersecurity certification preparation and study groups. (Free)",
            "url": "https://discord.gg/infosecprep"
        },
        {
            "type": "discord",
            "title": "Red Team Village",
            "description": "Focused on red team tactics, tools, and training. (Free)",
            "url": "https://discord.gg/redteamvillage"
        },
        {
            "type": "discord",
            "title": "MalwareTech Community",
            "description": "Community around malware research and cybersecurity. (Free)",
            "url": "https://discord.gg/malwaretech"
        }
    ],
    "cloud computing": [
        {
            "type": "youtube",
            "title": "AWS",
            "description": "Official Amazon Web Services channel with tutorials and announcements. (Free)",
            "url": "https://www.youtube.com/user/AmazonWebServices"
        },
        {
            "type": "youtube",
            "title": "Google Cloud Platform",
            "description": "Official Google Cloud tutorials and product announcements. (Free)",
            "url": "https://www.youtube.com/user/googlecloudplatform"
        },
        {
            "type": "youtube",
            "title": "Azure",
            "description": "Microsoft Azure channel with cloud solutions and how-tos. (Free)",
            "url": "https://www.youtube.com/user/windowsazure"
        },
        {
            "type": "youtube",
            "title": "TechWorld with Nana",
            "description": "Cloud computing, Kubernetes, DevOps, and infrastructure tutorials. (Free)",
            "url": "https://www.youtube.com/c/TechWorldwithNana"
        },
        {
            "type": "youtube",
            "title": "Cloud Academy",
            "description": "Cloud certifications and tutorials for AWS, Azure, GCP. (Free and Paid content)",
            "url": "https://www.youtube.com/c/CloudAcademyInc"
        },
        {
            "type": "book",
            "title": "AWS Certified Solutions Architect Official Study Guide",
            "author": "Ben Piper and David Clinton",
            "description": "Comprehensive study guide for AWS Solutions Architect exam. (Paid)",
            "url": "https://www.amazon.com/AWS-Certified-Solutions-Architect-Official/dp/111950421X"
        },
        {
            "type": "book",
            "title": "Cloud Computing: Concepts, Technology & Architecture",
            "author": "Thomas Erl",
            "description": "Detailed exploration of cloud computing architectures and services. (Paid)",
            "url": "https://www.amazon.com/Cloud-Computing-Concepts-Technology-Architecture/dp/0133387526"
        },
        {
            "type": "book",
            "title": "Microsoft Azure Fundamentals",
            "author": "Jim Cheshire",
            "description": "Guide to Azure cloud concepts and services for certification prep. (Paid)",
            "url": "https://www.amazon.com/Microsoft-Azure-Fundamentals-Jim-Cheshire/dp/0136872974"
        },
        {
            "type": "book",
            "title": "Google Cloud Platform for Architects",
            "author": "Vitthal Srinivasan and Janani Ravi",
            "description": "Cloud architecture design and best practices on GCP. (Paid)",
            "url": "https://www.amazon.com/Google-Cloud-Platform-Architects-Srinivasan/dp/1484258001"
        },
        {
            "type": "book",
            "title": "Kubernetes Up & Running",
            "author": "Brendan Burns, Joe Beda, Kelsey Hightower",
            "description": "Practical guide to container orchestration with Kubernetes. (Paid)",
            "url": "https://www.oreilly.com/library/view/kubernetes-up-and/9781491935675/"
        },
        {
            "type": "course",
            "title": "AWS Certified Solutions Architect - Associate",
            "provider": "Udemy",
            "description": "Complete preparation course for AWS Solutions Architect exam. (Paid)",
            "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate/"
        },
        {
            "type": "course",
            "title": "Google Cloud Platform Fundamentals: Core Infrastructure",
            "provider": "Coursera, Google Cloud",
            "description": "Introduction to GCP products and services. Free to audit, paid certificate.",
            "url": "https://www.coursera.org/learn/gcp-fundamentals"
        },
        {
            "type": "course",
            "title": "Microsoft Azure Fundamentals AZ-900",
            "provider": "Udemy",
            "description": "Preparation for Microsoft Azure fundamentals certification exam. (Paid)",
            "url": "https://www.udemy.com/course/az900-azure/"
        },
        {
            "type": "course",
            "title": "Introduction to Cloud Computing",
            "provider": "edX, IBM",
            "description": "Basic cloud computing concepts and architecture. Free with paid certificate.",
            "url": "https://www.edx.org/course/introduction-to-cloud-computing"
        },
        {
            "type": "course",
            "title": "Cloud Computing Specialization",
            "provider": "Coursera, University of Illinois",
            "description": "Comprehensive specialization covering cloud fundamentals and services. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/cloud-computing"
        },
        {
            "type": "website",
            "title": "AWS Documentation",
            "description": "Official documentation and tutorials for all AWS services. (Free)",
            "url": "https://docs.aws.amazon.com/"
        },
        {
            "type": "website",
            "title": "Microsoft Azure Docs",
            "description": "Microsoft’s official Azure documentation and learning center. (Free)",
            "url": "https://docs.microsoft.com/en-us/azure/"
        },
        {
            "type": "website",
            "title": "Google Cloud Platform Documentation",
            "description": "Detailed GCP docs, sample code, and tutorials. (Free)",
            "url": "https://cloud.google.com/docs"
        },
        {
            "type": "website",
            "title": "Kubernetes Documentation",
            "description": "Official Kubernetes docs and tutorials for container orchestration. (Free)",
            "url": "https://kubernetes.io/docs/"
        },
        {
            "type": "website",
            "title": "Cloud Academy",
            "description": "Cloud training platform offering courses, labs, and practice exams. (Free and Paid)",
            "url": "https://cloudacademy.com/"
        },
        {
            "type": "reddit",
            "title": "r/aws",
            "description": "Community sharing AWS questions, tips, and announcements. (Free)",
            "url": "https://www.reddit.com/r/aws/"
        },
        {
            "type": "reddit",
            "title": "r/Azure",
            "description": "Microsoft Azure discussion and help community. (Free)",
            "url": "https://www.reddit.com/r/AZURE/"
        },
        {
            "type": "reddit",
            "title": "r/googlecloud",
            "description": "Google Cloud Platform related news and support community. (Free)",
            "url": "https://www.reddit.com/r/googlecloud/"
        },
        {
            "type": "reddit",
            "title": "r/kubernetes",
            "description": "Discussions, news, and help related to Kubernetes technology. (Free)",
            "url": "https://www.reddit.com/r/kubernetes/"
        },
        {
            "type": "reddit",
            "title": "r/devops",
            "description": "Community for DevOps best practices using cloud and automation. (Free)",
            "url": "https://www.reddit.com/r/devops/"
        },
        {
            "type": "discord",
            "title": "Cloud Community",
            "description": "Active cloud computing Discord with AWS, Azure, GCP channels. (Free)",
            "url": "https://discord.gg/cloud"
        },
        {
            "type": "discord",
            "title": "AWS Discord",
            "description": "Official and community-supported AWS discussion and help server. (Free)",
            "url": "https://discord.gg/aws"
        },
        {
            "type": "discord",
            "title": "Google Cloud Discord",
            "description": "Community for GCP users to share tips and projects. (Free)",
            "url": "https://discord.gg/googlecloud"
        },
        {
            "type": "discord",
            "title": "Microsoft Azure Discord",
            "description": "Azure support and learning community. (Free)",
            "url": "https://discord.gg/microsoftazure"
        },
        {
            "type": "discord",
            "title": "Kubernetes Community",
            "description": "Official Kubernetes chat server for users and developers. (Free)",
            "url": "https://discord.gg/kubernetes"
        }
    ],
    "full stack development": [
        {
            "type": "youtube",
            "title": "Traversy Media",
            "description": "Comprehensive tutorials covering front-end, back-end, and full stack development. (Free)",
            "url": "https://www.youtube.com/c/TraversyMedia"
        },
        {
            "type": "youtube",
            "title": "The Net Ninja",
            "description": "Wide-ranging programming tutorials including React, Node.js, and full-stack projects. (Free)",
            "url": "https://www.youtube.com/c/TheNetNinja"
        },
        {
            "type": "youtube",
            "title": "Academind",
            "description": "Modern web development and full-stack tutorials with practical examples. (Free)",
            "url": "https://www.youtube.com/c/Academind"
        },
        {
            "type": "youtube",
            "title": "Programming with Mosh",
            "description": "Beginner to advanced tutorials on full stack technologies and software development principles. (Free and Paid content)",
            "url": "https://www.youtube.com/c/programmingwithmosh"
        },
        {
            "type": "youtube",
            "title": "freeCodeCamp.org",
            "description": "Full-length courses covering full stack development and many programming languages. (Free)",
            "url": "https://www.youtube.com/c/Freecodecamp"
        },
        {
            "type": "book",
            "title": "Eloquent JavaScript",
            "author": "Marijn Haverbeke",
            "description": "Modern JavaScript programming deep dive, essential for front-end and full stack dev. (Free and Paid)",
            "url": "https://eloquentjavascript.net/"
        },
        {
            "type": "book",
            "title": "You Don't Know JS (book series)",
            "author": "Kyle Simpson",
            "description": "In-depth series exploring JavaScript’s core mechanisms to build strong foundational knowledge. (Free and Paid)",
            "url": "https://github.com/getify/You-Dont-Know-JS"
        },
        {
            "type": "book",
            "title": "Fullstack React",
            "author": "Accomazzo, Murray, and Hernandez",
            "description": "Guide to building full stack web apps with React and related technologies. (Paid)",
            "url": "https://www.fullstackreact.com/"
        },
        {
            "type": "book",
            "title": "The Pragmatic Programmer",
            "author": "Andrew Hunt and David Thomas",
            "description": "Classic book on effective software and full stack development practices. (Paid)",
            "url": "https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052"
        },
        {
            "type": "book",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "description": "Best practices and principles for writing maintainable and efficient code. (Paid)",
            "url": "https://www.oreilly.com/library/view/clean-code-a/9780136083238/"
        },
        {
            "type": "course",
            "title": "The Web Developer Bootcamp 2025",
            "provider": "Udemy",
            "description": "Complete front-end and back-end web development course. (Paid)",
            "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"
        },
        {
            "type": "course",
            "title": "Full Stack Open",
            "provider": "University of Helsinki",
            "description": "Free course covering modern full stack JavaScript development with React and Node.js. (Free)",
            "url": "https://fullstackopen.com/en/"
        },
        {
            "type": "course",
            "title": "CS50’s Web Programming with Python and JavaScript",
            "provider": "Harvard University, edX",
            "description": "In-depth course on web app development with Python, JavaScript, and SQL. Free to audit, paid certificate.",
            "url": "https://cs50.harvard.edu/web/2020/"
        },
        {
            "type": "course",
            "title": "Frontend Masters",
            "provider": "Frontend Masters",
            "description": "Industry-expert full stack and front-end development courses. (Paid)",
            "url": "https://frontendmasters.com/"
        },
        {
            "type": "course",
            "title": "freeCodeCamp Full Stack Certification",
            "provider": "freeCodeCamp",
            "description": "Complete certification program covering front-end and back-end technologies. (Free)",
            "url": "https://www.freecodecamp.org/learn/full-stack/"
        },
        {
            "type": "website",
            "title": "MDN Web Docs",
            "description": "Comprehensive web development references and tutorials by Mozilla. (Free)",
            "url": "https://developer.mozilla.org/en-US/"
        },
        {
            "type": "website",
            "title": "W3Schools",
            "description": "Easy-to-follow tutorials for HTML, CSS, JavaScript, and server-side languages. (Free)",
            "url": "https://www.w3schools.com/"
        },
        {
            "type": "website",
            "title": "Stack Overflow",
            "description": "Largest programming Q&A community for help with development problems. (Free)",
            "url": "https://stackoverflow.com/"
        },
        {
            "type": "website",
            "title": "Dev.to",
            "description": "Community-driven blog platform for programming and software development. (Free)",
            "url": "https://dev.to/"
        },
        {
            "type": "website",
            "title": "GitHub",
            "description": "Platform for hosting and collaborating on software projects. (Free and Paid)",
            "url": "https://github.com/"
        },
        {
            "type": "reddit",
            "title": "r/webdev",
            "description": "Community for discussing web development technologies and trends. (Free)",
            "url": "https://www.reddit.com/r/webdev/"
        },
        {
            "type": "reddit",
            "title": "r/frontend",
            "description": "Focused community for front-end development discussions. (Free)",
            "url": "https://www.reddit.com/r/frontend/"
        },
        {
            "type": "reddit",
            "title": "r/javascript",
            "description": "Discussion and news about JavaScript development. (Free)",
            "url": "https://www.reddit.com/r/javascript/"
        },
        {
            "type": "reddit",
            "title": "r/learnprogramming",
            "description": "Helpful subreddit for learners in many programming domains. (Free)",
            "url": "https://www.reddit.com/r/learnprogramming/"
        },
        {
            "type": "reddit",
            "title": "r/coding",
            "description": "General programming discussions and help. (Free)",
            "url": "https://www.reddit.com/r/coding/"
        },
        {
            "type": "discord",
            "title": "The Coding Den",
            "description": "Friendly Discord community for programmers of all levels. (Free)",
            "url": "https://discord.gg/codingden"
        },
        {
            "type": "discord",
            "title": "Reactiflux",
            "description": "Community focusing on React and front-end development. (Free)",
            "url": "https://discord.gg/reactiflux"
        },
        {
            "type": "discord",
            "title": "Dev Community",
            "description": "Developer discussions, mentorship, and collaboration. (Free)",
            "url": "https://discord.gg/devcommunity"
        },
        {
            "type": "discord",
            "title": "100Devs",
            "description": "Coding community with careers guidance and peer support. (Free)",
            "url": "https://discord.gg/100devs"
        },
        {
            "type": "discord",
            "title": "CodeSupport",
            "description": "A large community supporting and encouraging software developers. (Free)",
            "url": "https://discord.gg/codesupport"
        }
    ],
    "software development": [
        {
            "type": "youtube",
            "title": "Computerphile",
            "description": "Videos about computers and computer stuff from the University of Nottingham. (Free)",
            "url": "https://www.youtube.com/user/Computerphile"
        },
        {
            "type": "youtube",
            "title": "Tom Scott",
            "description": "Educational videos including many on computer science and software topics. (Free)",
            "url": "https://www.youtube.com/c/TomScottGo"
        },
        {
            "type": "youtube",
            "title": "Ben Eater",
            "description": "Building a computer from scratch and other low-level electronics/software tutorials. (Free)",
            "url": "https://www.youtube.com/c/BenEater"
        },
        {
            "type": "youtube",
            "title": "Fireship",
            "description": "High-intensity code tutorials and tech news. (Free)",
            "url": "https://www.youtube.com/c/Fireship"
        },
        {
            "type": "book",
            "title": "Design Patterns: Elements of Reusable Object-Oriented Software",
            "author": "Erich Gamma et al.",
            "description": "The classic book on software design patterns. (Paid)",
            "url": "https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612"
        },
        {
            "type": "book",
            "title": "Refactoring",
            "author": "Martin Fowler",
            "description": "Improving the design of existing code. (Paid)",
            "url": "https://martinfowler.com/books/refactoring.html"
        },
        {
            "type": "book",
            "title": "Introduction to Algorithms",
            "author": "Thomas H. Cormen et al.",
            "description": "Comprehensive textbook on algorithms. (Paid)",
            "url": "https://mitpress.mit.edu/books/introduction-algorithms-third-edition"
        },
        {
            "type": "course",
            "title": "Software Development Lifecycle Specialization",
            "provider": "Coursera, University of Minnesota",
            "description": "Learn the SDLC and software methodologies. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/software-development-lifecycle"
        },
        {
            "type": "course",
            "title": "CS50: Introduction to Computer Science",
            "provider": "Harvard, edX",
            "description": "Introduction to the intellectual enterprises of computer science and the art of programming. (Free)",
            "url": "https://cs50.harvard.edu/x/"
        },
        {
            "type": "website",
            "title": "GeeksforGeeks",
            "description": "A computer science portal for geeks. (Free)",
            "url": "https://www.geeksforgeeks.org/"
        },
        {
            "type": "website",
            "title": "HackerRank",
            "description": "Practice coding, prepare for interviews, and get hired. (Free)",
            "url": "https://www.hackerrank.com/"
        },
        {
            "type": "reddit",
            "title": "r/softwaredevelopment",
            "description": "General discussion about software development methods and practices. (Free)",
            "url": "https://www.reddit.com/r/softwaredevelopment/"
        },
        {
            "type": "reddit",
            "title": "r/cscareerquestions",
            "description": "A subreddit for those with questions about working in the tech industry. (Free)",
            "url": "https://www.reddit.com/r/cscareerquestions/"
        }
    ],
    "devops": [
        {
            "type": "youtube",
            "title": "DevOps Directive",
            "description": "Tutorials and interviews about DevOps, Cloud, and Infrastructure. (Free)",
            "url": "https://www.youtube.com/c/DevOpsDirective"
        },
        {
            "type": "youtube",
            "title": "Nana Janashia",
            "description": "DevOps and Cloud computing tutorials. (Free)",
            "url": "https://www.youtube.com/c/TechWorldwithNana"
        },
        {
            "type": "youtube",
            "title": "Stephane Maarek",
            "description": "AWS and Kafka tutorials. (Free)",
            "url": "https://www.youtube.com/c/StephaneMaarek"
        },
        {
            "type": "book",
            "title": "The Phoenix Project",
            "author": "Gene Kim et al.",
            "description": "A novel about IT, DevOps, and helping your business win. (Paid)",
            "url": "https://itrevolution.com/book/the-phoenix-project/"
        },
        {
            "type": "book",
            "title": "The DevOps Handbook",
            "author": "Gene Kim et al.",
            "description": "How to create world-class agility, reliability, and security in technology organizations. (Paid)",
            "url": "https://itrevolution.com/book/the-devops-handbook/"
        },
        {
            "type": "book",
            "title": "Accelerate",
            "author": "Nicole Forsgren et al.",
            "description": "The science of lean software and devops. (Paid)",
            "url": "https://itrevolution.com/book/accelerate/"
        },
        {
            "type": "course",
            "title": "DevOps Culture and Mindset",
            "provider": "Coursera, UC Davis",
            "description": "Introduction to DevOps culture. Paid with audit option.",
            "url": "https://www.coursera.org/learn/devops-culture-and-mindset"
        },
        {
            "type": "course",
            "title": "Docker and Kubernetes: The Complete Guide",
            "provider": "Udemy",
            "description": "Hands-on guide to Docker and Kubernetes. (Paid)",
            "url": "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/"
        },
        {
            "type": "website",
            "title": "DevOps.com",
            "description": "News, insights, and resources for DevOps. (Free)",
            "url": "https://devops.com/"
        },
        {
            "type": "website",
            "title": "CNCF",
            "description": "Cloud Native Computing Foundation - home of Kubernetes and Prometheus. (Free)",
            "url": "https://www.cncf.io/"
        },
        {
            "type": "reddit",
            "title": "r/devops",
            "description": "DevOps community. (Free)",
            "url": "https://www.reddit.com/r/devops/"
        },
        {
            "type": "discord",
            "title": "DevOps Engineers",
            "description": "Community for DevOps professionals. (Free)",
            "url": "https://discord.gg/devops"
        }
    ],
    "blockchain": [
        {
            "type": "youtube",
            "title": "Whiteboard Crypto",
            "description": "Explains crypto and blockchain concepts using analogies. (Free)",
            "url": "https://www.youtube.com/c/WhiteboardCrypto"
        },
        {
            "type": "youtube",
            "title": "Dapp University",
            "description": "Learn to build decentralized apps on the Ethereum blockchain. (Free)",
            "url": "https://www.youtube.com/c/DappUniversity"
        },
        {
            "type": "youtube",
            "title": "Andreas M. Antonopoulos",
            "description": "Talks and Q&As about Bitcoin and open blockchains. (Free)",
            "url": "https://www.youtube.com/user/aantonop"
        },
        {
            "type": "book",
            "title": "Mastering Bitcoin",
            "author": "Andreas M. Antonopoulos",
            "description": "Technical guide to Bitcoin. (Free/Paid)",
            "url": "https://github.com/bitcoinbook/bitcoinbook"
        },
        {
            "type": "book",
            "title": "Mastering Ethereum",
            "author": "Andreas M. Antonopoulos and Gavin Wood",
            "description": "Guide to smart contracts and DApps. (Free/Paid)",
            "url": "https://github.com/ethereumbook/ethereumbook"
        },
        {
            "type": "course",
            "title": "Blockchain Specialization",
            "provider": "Coursera, University at Buffalo",
            "description": "Broad introduction to blockchain technology. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/blockchain"
        },
        {
            "type": "course",
            "title": "Ethereum and Solidity: The Complete Developer's Guide",
            "provider": "Udemy",
            "description": "Build DApps with Ethereum and Solidity. (Paid)",
            "url": "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/"
        },
        {
            "type": "website",
            "title": "CoinDesk",
            "description": "News and insights on cryptocurrency and blockchain. (Free)",
            "url": "https://www.coindesk.com/"
        },
        {
            "type": "website",
            "title": "Solidity Documentation",
            "description": "Official documentation for the Solidity language. (Free)",
            "url": "https://docs.soliditylang.org/"
        },
        {
            "type": "reddit",
            "title": "r/ethdev",
            "description": "Ethereum development community. (Free)",
            "url": "https://www.reddit.com/r/ethdev/"
        },
        {
            "type": "discord",
            "title": "CryptoDevs",
            "description": "Community for crypto developers. (Free)",
            "url": "https://discord.gg/cryptodevs"
        }
    ],
    "iot": [
        {
            "type": "youtube",
            "title": "Kevin McAleer",
            "description": "Robotics and IoT projects with Raspberry Pi and MicroPython. (Free)",
            "url": "https://www.youtube.com/c/KevinMcAleer"
        },
        {
            "type": "youtube",
            "title": "DroneBot Workshop",
            "description": "Tutorials on Arduino, Raspberry Pi, and electronics. (Free)",
            "url": "https://www.youtube.com/c/Dronebotworkshop"
        },
        {
            "type": "book",
            "title": "Designing the Internet of Things",
            "author": "Adrian McEwen and Hakim Cassimally",
            "description": "Connecting devices and sensors to the internet. (Paid)",
            "url": "https://www.wiley.com/en-us/Designing+the+Internet+of+Things-p-9781118430620"
        },
        {
            "type": "course",
            "title": "Internet of Things (IoT) Specialization",
            "provider": "Coursera, UC Irvine",
            "description": "Design and create IoT devices. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/iot"
        },
        {
            "type": "website",
            "title": "Hackster.io",
            "description": "Community dedicated to hardware hacking and IoT projects. (Free)",
            "url": "https://www.hackster.io/"
        },
        {
            "type": "website",
            "title": "Arduino Project Hub",
            "description": "Official showcase of Arduino projects. (Free)",
            "url": "https://create.arduino.cc/projecthub"
        }
    ],
    "ar/vr": [
        {
            "type": "youtube",
            "title": "Dilmer Valecillos",
            "description": "Tutorials on AR/VR development with Unity and XR Interaction Toolkit. (Free)",
            "url": "https://www.youtube.com/c/DilmerValecillos"
        },
        {
            "type": "youtube",
            "title": "Valem",
            "description": "VR development tutorials for Unity. (Free)",
            "url": "https://www.youtube.com/c/ValemVR"
        },
        {
            "type": "book",
            "title": "Unity 2020 Virtual Reality Projects",
            "author": "Jonathan Linowes",
            "description": "Learn VR development by building projects in Unity. (Paid)",
            "url": "https://www.packtpub.com/product/unity-2020-virtual-reality-projects-third-edition/9781839217379"
        },
        {
            "type": "course",
            "title": "XR Design and Development",
            "provider": "Coursera, Unity",
            "description": "Official Unity course on AR and VR development. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/xr-design-development"
        },
        {
            "type": "website",
            "title": "Unity Learn",
            "description": "Official learning platform for Unity, including XR pathways. (Free)",
            "url": "https://learn.unity.com/"
        }
    ],
    "communication": [
        {
            "type": "youtube",
            "title": "TED",
            "description": "Talks from expert speakers on education, business, science, tech and creativity. (Free)",
            "url": "https://www.youtube.com/user/TEDtalksDirector"
        },
        {
            "type": "youtube",
            "title": "Charisma on Command",
            "description": "Tips to be more charismatic and confident in social situations. (Free)",
            "url": "https://www.youtube.com/user/charismaoncommand"
        },
        {
            "type": "book",
            "title": "Crucial Conversations",
            "author": "Kerry Patterson et al.",
            "description": "Tools for talking when stakes are high. (Paid)",
            "url": "https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/1469047293"
        },
        {
            "type": "book",
            "title": "How to Win Friends and Influence People",
            "author": "Dale Carnegie",
            "description": "Classic advice on communication and relationships. (Paid)",
            "url": "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034"
        },
        {
            "type": "course",
            "title": "Effective Communication: Writing, Design, and Presentation",
            "provider": "Coursera, University of Colorado Boulder",
            "description": "Improve business communication skills. Paid with audit option.",
            "url": "https://www.coursera.org/specializations/effective-business-communication"
        }
    ],
    "project management": [
        {
            "type": "youtube",
            "title": "ProjectManager",
            "description": "Tips, tools, and training for project managers. (Free)",
            "url": "https://www.youtube.com/user/projectmanagervideos"
        },
        {
            "type": "youtube",
            "title": "Adriana Girdler",
            "description": "Productivity and project management advice. (Free)",
            "url": "https://www.youtube.com/c/AdrianaGirdler"
        },
        {
            "type": "book",
            "title": "A Guide to the Project Management Body of Knowledge (PMBOK Guide)",
            "author": "PMI",
            "description": "The standard guide for project management. (Paid)",
            "url": "https://www.pmi.org/pmbok-guide-standards/foundational/pmbok"
        },
        {
            "type": "course",
            "title": "Google Project Management: Professional Certificate",
            "provider": "Coursera",
            "description": "Prepare for a career in project management. Paid with audit option.",
            "url": "https://www.coursera.org/professional-certificates/google-project-management"
        },
        {
            "type": "website",
            "title": "Project Management Institute (PMI)",
            "description": "Professional organization for project management. (Free/Paid)",
            "url": "https://www.pmi.org/"
        }
    ],
    "digital marketing": [
        {
            "type": "youtube",
            "title": "Neil Patel",
            "description": "SEO and digital marketing tips. (Free)",
            "url": "https://www.youtube.com/user/neilvkpatel"
        },
        {
            "type": "youtube",
            "title": "Ahrefs",
            "description": "SEO tutorials and marketing case studies. (Free)",
            "url": "https://www.youtube.com/c/AhrefsCom"
        },
        {
            "type": "book",
            "title": "Building a StoryBrand",
            "author": "Donald Miller",
            "description": "Clarify your message so customers will listen. (Paid)",
            "url": "https://storybrand.com/book/"
        },
        {
            "type": "course",
            "title": "Google Digital Marketing & E-commerce Professional Certificate",
            "provider": "Coursera",
            "description": "Learn digital marketing skills. Paid with audit option.",
            "url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce"
        },
        {
            "type": "website",
            "title": "HubSpot Blog",
            "description": "Marketing, sales, and service content. (Free)",
            "url": "https://blog.hubspot.com/"
        }
    ],
    "financial management": [
        {
            "type": "youtube",
            "title": "The Plain Bagel",
            "description": "Finance and investment education. (Free)",
            "url": "https://www.youtube.com/c/ThePlainBagel"
        },
        {
            "type": "youtube",
            "title": "Khan Academy Finance",
            "description": "Educational videos on finance and capital markets. (Free)",
            "url": "https://www.khanacademy.org/economics-finance-domain/core-finance"
        },
        {
            "type": "book",
            "title": "Rich Dad Poor Dad",
            "author": "Robert Kiyosaki",
            "description": "Personal finance classic. (Paid)",
            "url": "https://www.richdad.com/"
        },
        {
            "type": "course",
            "title": "Financial Markets",
            "provider": "Coursera, Yale University",
            "description": "Overview of ideas, methods, and institutions that permit human society to manage risks and foster enterprise. (Free)",
            "url": "https://www.coursera.org/learn/financial-markets-global"
        },
        {
            "type": "website",
            "title": "Investopedia",
            "description": "Financial education website. (Free)",
            "url": "https://www.investopedia.com/"
        }
    ],
    "emotional intelligence": [
        {
            "type": "youtube",
            "title": "School of Life",
            "description": "Videos on emotional intelligence and self-knowledge. (Free)",
            "url": "https://www.youtube.com/c/theschooloflifetv"
        },
        {
            "type": "book",
            "title": "Emotional Intelligence 2.0",
            "author": "Travis Bradberry and Jean Greaves",
            "description": "Strategies to increase your EQ. (Paid)",
            "url": "https://www.amazon.com/Emotional-Intelligence-2-0-Travis-Bradberry/dp/0974320625"
        },
        {
            "type": "course",
            "title": "Inspiring Leadership through Emotional Intelligence",
            "provider": "Coursera, Case Western Reserve University",
            "description": "Build better relationships and lead effectively. Paid with audit option.",
            "url": "https://www.coursera.org/learn/emotional-intelligence-leadership"
        }
    ]
};

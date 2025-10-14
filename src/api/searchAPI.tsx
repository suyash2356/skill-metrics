// api/searchAPI.ts
import axios from "axios";

// Standardized recommendation type
export type Recommendation = {
  type: "youtube" | "book" | "course" | "website" | "reddit" | "discord" | "blog";
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  duration?: string;
  rating?: number;
  url: string;
};

// Allowed topics (skills, domains, exams)
export const allowedTopics = [
  "artificial intelligence and machine learning","ai","ai/ml","data science","data analytics",
  "cyber security","cloud computing","software development","programming","devops",
  "blockchain","internet of things","ar/vr","communication","project management",
  "sustainability","digital marketing","financial management","emotional intelligence",
  "leadership","healthcare skills","legal and compliance","product management","design",
  "information technology","healthcare","finance","education","environmental sustainability",
  "marketing","logistics and supply chain","legal services",
  "jee","neet","cat","gate","upsc","civil services examination","gmat","gre","sat","act",
  "ielts","toefl","clat","ssc","ca exam","banking exams","xat","mat","lsat","nda"
];

// API keys (replace with your own)
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Curated resources per topic
const curatedResources: Record<string, Recommendation[]> = {
  "ai": [
    {
        "type": "youtube",
        "title": "Krish Naik - AI & ML",
        "description": "Top tutorials on AI and Machine Learning concepts covering both theory and practical projects. (Free)",
        "url": "https://www.youtube.com/@krishnaik06"
    },
    {
        "type": "youtube",
        "title": "Yannic Kilcher",
        "description": "In-depth analysis and explanations of the latest AI research papers and concepts. (Free)",
        "url": "https://www.youtube.com/c/YannicKilcher"
    },
    {
        "type": "youtube",
        "title": "Two Minute Papers",
        "description": "Concise summaries and explanations of cutting-edge AI research in digestible two-minute videos. (Free)",
        "url": "https://www.youtube.com/c/KárolyZsolnai"
    },
    {
        "type": "youtube",
        "title": "StatQuest with Josh Starmer",
        "description": "Clear and beginner-friendly breakdowns of AI and machine learning statistical concepts. (Free)",
        "url": "https://www.youtube.com/user/joshstarmer"
    },
    {
        "type": "youtube",
        "title": "Lex Fridman",
        "description": "Interviews and conversations with top AI researchers, practitioners, and thought leaders. (Free)",
        "url": "https://www.youtube.com/c/lexfridman"
    },
    {
        "type": "book",
        "title": "Artificial Intelligence: A Modern Approach",
        "author": "Stuart Russell and Peter Norvig",
        "description": "Comprehensive and foundational AI textbook widely used in academia and industry. (Paid)",
        "url": "https://www.amazon.com/Artificial-Intelligence-Modern-Approach-3rd/dp/0136042597"
    },
    {
        "type": "book",
        "title": "Mathematics for Machine Learning",
        "author": "Marc Peter Deisenroth",
        "description": "Key mathematical concepts underpinning AI and machine learning algorithms. (Paid)",
        "url": "https://www.amazon.com/Mathematics-Machine-Learning-Peter-Deisenroth/dp/1108455140"
    },
    {
        "type": "book",
        "title": "The Alignment Problem: Machine Learning and Human Values",
        "author": "Brian Christian",
        "description": "Explores challenges of aligning AI behavior with human values and ethics. (Paid)",
        "url": "https://www.amazon.com/Alignment-Problem-Machine-Learning-Values/dp/0374257833"
    },
    {
        "type": "book",
        "title": "Mastering AI in 2025: The Ultimate Guide",
        "author": "Various",
        "description": "Up-to-date practical guide on leveraging AI tools and apps effectively. (Paid)",
        "url": "https://www.goodreads.com/book/show/223703056-mastering-ai-in-2025"
    },
    {
        "type": "book",
        "title": "AI: A Very Short Introduction",
        "author": "Margaret A. Boden",
        "description": "Concise, accessible introduction to AI concepts and history. (Paid)",
        "url": "https://www.amazon.com/Artificial-Intelligence-Short-Introduction-Introductions/dp/0199602913"
    },
    {
        "type": "course",
        "title": "AI For Everyone",
        "provider": "Coursera, Andrew Ng",
        "description": "Non-technical overview of AI concepts and societal impact. Free to audit, paid certificate available.",
        "url": "https://www.coursera.org/learn/ai-for-everyone"
    },
    {
        "type": "course",
        "title": "Elements of AI",
        "provider": "University of Helsinki",
        "description": "Free online course designed to demystify AI for broad audiences. (Free)",
        "url": "https://www.elementsofai.com/"
    },
    {
        "type": "course",
        "title": "Deep Learning Specialization",
        "provider": "deeplearning.ai, Coursera",
        "description": "Comprehensive deep learning techniques and applications. (Paid)",
        "url": "https://www.coursera.org/specializations/deep-learning"
    },
    {
        "type": "course",
        "title": "MIT Introduction to Deep Learning",
        "provider": "MIT OpenCourseWare",
        "description": "Graduate-level free course covering cutting-edge research in deep learning. (Free)",
        "url": "http://introtodeeplearning.com/"
    },
    {
        "type": "course",
        "title": "Artificial Intelligence: Principles and Techniques",
        "provider": "Stanford University",
        "description": "Fundamental AI techniques covered in this free course. (Free)",
        "url": "http://web.stanford.edu/class/cs221/"
    },
    {
        "type": "website",
        "title": "Google AI Learn",
        "description": "Official Google learning paths, tools, and resources for AI. (Free)",
        "url": "https://ai.google/learn-ai-skills/"
    },
    {
        "type": "website",
        "title": "OpenAI Blog",
        "description": "Cutting-edge research updates and guides from OpenAI. (Free)",
        "url": "https://openai.com/blog/"
    },
    {
        "type": "website",
        "title": "Distill.pub",
        "description": "Visual explanations of complex AI research. (Free)",
        "url": "https://distill.pub/"
    },
    {
        "type": "website",
        "title": "Towards Data Science",
        "description": "AI articles, tutorials, and practical how-tos from researchers and practitioners. (Free with some paid content)",
        "url": "https://towardsdatascience.com/"
    },
    {
        "type": "website",
        "title": "AI Weekly",
        "description": "Curated weekly newsletter and articles on AI news and research. (Free)",
        "url": "https://aiweekly.co/"
    },
    {
        "type": "reddit",
        "title": "r/artificial",
        "description": "Active Reddit community for AI news, research, and discussions. (Free)",
        "url": "https://www.reddit.com/r/artificial/"
    },
    {
        "type": "reddit",
        "title": "r/MachineLearning",
        "description": "Large community focusing on all aspects of machine learning research and practice. (Free)",
        "url": "https://www.reddit.com/r/MachineLearning/"
    },
    {
        "type": "reddit",
        "title": "r/ChatGPT",
        "description": "Dedicated subreddit for discussions and news about ChatGPT and related AI models. (Free)",
        "url": "https://www.reddit.com/r/ChatGPT/"
    },
    {
        "type": "reddit",
        "title": "r/OpenAI",
        "description": "Community focused on OpenAI developments, research, and AI safety. (Free)",
        "url": "https://www.reddit.com/r/OpenAI/"
    },
    {
        "type": "reddit",
        "title": "r/ArtificialInteligence",
        "description": "General AI community with a focus on academic and industry AI advancements. (Free)",
        "url": "https://www.reddit.com/r/ArtificialInteligence/"
    },
    {
        "type": "discord",
        "title": "AI & ML Discord Community",
        "description": "Vibrant real-time chat community focused on AI and machine learning help, projects, and discussions. (Free)",
        "url": "https://discord.gg/ai"
    },
    {
        "type": "discord",
        "title": "OpenAI Discord",
        "description": "Official server for OpenAI users and developers sharing resources and discussions. (Free)",
        "url": "https://discord.gg/openai"
    },
    {
        "type": "discord",
        "title": "Learn AI Together",
        "description": "Community focused on learning AI collectively with resources, projects, and mentorship. (Free)",
        "url": "https://discord.gg/learnai"
    }
],
"ml": [
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
        "title": "The Net Ninja",
        "description": "High-quality tutorials covering multiple programming languages and software engineering topics. (Free)",
        "url": "https://www.youtube.com/c/TheNetNinja"
    },
    {
        "type": "youtube",
        "title": "Derek Banas",
        "description": "Deep and fast-paced programming tutorials on a wide range of software development topics. (Free)",
        "url": "https://www.youtube.com/user/derekbanas"
    },
    {
        "type": "youtube",
        "title": "Tech With Tim",
        "description": "Programming tutorials, including Python and game development. (Free)",
        "url": "https://www.youtube.com/c/TechWithTim"
    },
    {
        "type": "youtube",
        "title": "Programming with Mosh",
        "description": "From beginner to advanced programming and software development tutorials. (Free and Paid content)",
        "url": "https://www.youtube.com/c/programmingwithmosh"
    },
    {
        "type": "youtube",
        "title": "FreeCodeCamp.org",
        "description": "Full free courses on various software development topics. (Free)",
        "url": "https://www.youtube.com/c/Freecodecamp"
    },
    {
        "type": "book",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "description": "Best practices and principles for writing maintainable and efficient code. (Paid)",
        "url": "https://www.oreilly.com/library/view/clean-code-a/9780136083238/"
    },
    {
        "type": "book",
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt and David Thomas",
        "description": "Classic advice on becoming a skilled and pragmatic software developer. (Paid)",
        "url": "https://www.amazon.com/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052"
    },
    {
        "type": "book",
        "title": "Design Patterns: Elements of Reusable Object-Oriented Software",
        "author": "Erich Gamma et al.",
        "description": "Definitive guide on software design patterns. (Paid)",
        "url": "https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612"
    },
    {
        "type": "book",
        "title": "Refactoring: Improving the Design of Existing Code",
        "author": "Martin Fowler",
        "description": "Guide to code refactoring techniques for cleaner code. (Paid)",
        "url": "https://martinfowler.com/books/refactoring.html"
    },
    {
        "type": "book",
        "title": "Code Complete",
        "author": "Steve McConnell",
        "description": "Comprehensive guide to software construction best practices. (Paid)",
        "url": "https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670"
    },
    {
        "type": "course",
        "title": "Algorithms Specialization",
        "provider": "Coursera, Stanford University",
        "description": "Comprehensive paid course series on algorithms and software development fundamentals. Free to audit.",
        "url": "https://www.coursera.org/specializations/algorithms"
    },
    {
        "type": "course",
        "title": "Java Programming and Software Engineering Fundamentals",
        "provider": "Coursera, Duke University",
        "description": "Paid specialization with beginner to intermediate programming skills. Free to audit.",
        "url": "https://www.coursera.org/specializations/java-programming"
    },
    {
        "type": "course",
        "title": "CS50's Introduction to Computer Science",
        "provider": "Harvard University, edX",
        "description": "Popular beginner-friendly computer science and software development course. Free to audit, paid certificate.",
        "url": "https://cs50.harvard.edu/x/2025/"
    },
    {
        "type": "course",
        "title": "Pluralsight Software Development Path",
        "provider": "Pluralsight",
        "description": "Paid learning paths covering software development lifecycle and languages.",
        "url": "https://www.pluralsight.com/paths/software-development"
    },
    {
        "type": "course",
        "title": "freeCodeCamp Software Development Certifications",
        "provider": "freeCodeCamp",
        "description": "Free certifications covering web, JavaScript, APIs, and more. (Free)",
        "url": "https://www.freecodecamp.org/learn"
    },
    {
        "type": "website",
        "title": "Stack Overflow",
        "description": "Encyclopedic Q&A community for software developers. (Free)",
        "url": "https://stackoverflow.com/"
    },
    {
        "type": "website",
        "title": "GitHub",
        "description": "Platform to collaborate, share, and host software projects. (Free and Paid)",
        "url": "https://github.com/"
    },
    {
        "type": "website",
        "title": "GeeksforGeeks",
        "description": "Programming tutorials, data structures, algorithms, and interview guides. (Free and Paid)",
        "url": "https://www.geeksforgeeks.org/"
    },
    {
        "type": "website",
        "title": "HackerRank",
        "description": "Coding challenges and interview practice for developers. (Free and Paid)",
        "url": "https://www.hackerrank.com/"
    },
    {
        "type": "website",
        "title": "LeetCode",
        "description": "Competitive programming platform with coding exercises and contests. (Free and Paid)",
        "url": "https://leetcode.com/"
    },
    {
        "type": "reddit",
        "title": "r/programming",
        "description": "General discussion about programming and software development. (Free)",
        "url": "https://www.reddit.com/r/programming/"
    },
    {
        "type": "reddit",
        "title": "r/learnprogramming",
        "description": "Supportive community for learning programming at any level. (Free)",
        "url": "https://www.reddit.com/r/learnprogramming/"
    },
    {
        "type": "reddit",
        "title": "r/coding",
        "description": "General programming help and discussion. (Free)",
        "url": "https://www.reddit.com/r/coding/"
    },
    {
        "type": "reddit",
        "title": "r/compsci",
        "description": "Computer science theory and software development discussions. (Free)",
        "url": "https://www.reddit.com/r/compsci/"
    },
    {
        "type": "reddit",
        "title": "r/softwaredevelopment",
        "description": "Community focused on software development processes and methodologies. (Free)",
        "url": "https://www.reddit.com/r/softwaredevelopment/"
    },
    {
        "type": "discord",
        "title": "CodeSupport",
        "description": "Large community for software developers to get help and mentorship. (Free)",
        "url": "https://discord.gg/codesupport"
    },
    {
        "type": "discord",
        "title": "The Coding Den",
        "description": "Supportive Discord community for programmers across languages and levels. (Free)",
        "url": "https://discord.gg/codingden"
    },
    {
        "type": "discord",
        "title": "100Devs",
        "description": "Community geared towards learning programming with peer support and career advice. (Free)",
        "url": "https://discord.gg/100devs"
    },
    {
        "type": "discord",
        "title": "Dev Community",
        "description": "Active and diverse developer community sharing knowledge and projects. (Free)",
        "url": "https://discord.gg/devcommunity"
    },
    {
        "type": "discord",
        "title": "Frontend Masters Community",
        "description": "Community linked to the Frontend Masters learning platform focusing on all aspects of software development. (Paid membership)",
        "url": "https://discord.gg/frontendmasters"
    }
],
"devops": [
    {
        "type": "youtube",
        "title": "TechWorld with Nana",
        "description": "Comprehensive DevOps tutorials covering Kubernetes, Docker, CI/CD pipelines, and cloud concepts. (Free)",
        "url": "https://www.youtube.com/c/TechWorldwithNana"
    },
    {
        "type": "youtube",
        "title": "The Net Ninja",
        "description": "DevOps and infrastructure tutorials including Docker and Kubernetes. (Free)",
        "url": "https://www.youtube.com/c/TheNetNinja"
    },
    {
        "type": "youtube",
        "title": "freeCodeCamp.org",
        "description": "Full-length courses on DevOps tools and practices, including Docker and Terraform. (Free)",
        "url": "https://www.youtube.com/c/Freecodecamp"
    },
    {
        "type": "youtube",
        "title": "AWS Online Tech Talks",
        "description": "Official AWS channel with talks on cloud infrastructure and DevOps best practices. (Free)",
        "url": "https://www.youtube.com/user/AmazonWebServices"
    },
    {
        "type": "youtube",
        "title": "Cloud Academy",
        "description": "DevOps related tutorials and certification preparation. (Free and Paid content)",
        "url": "https://www.youtube.com/c/CloudAcademyInc"
    },
    {
        "type": "book",
        "title": "The Phoenix Project",
        "author": "Gene Kim, Kevin Behr, George Spafford",
        "description": "Novel-style book explaining DevOps principles and practices. (Paid)",
        "url": "https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/1942788290"
    },
    {
        "type": "book",
        "title": "The DevOps Handbook",
        "author": "Gene Kim, Jez Humble, Patrick Debois, John Willis",
        "description": "Comprehensive guide on DevOps culture, tools, and processes. (Paid)",
        "url": "https://www.amazon.com/DevOps-Handbook-World-Class-Reliability-Organizations/dp/1942788002"
    },
    {
        "type": "book",
        "title": "Site Reliability Engineering",
        "author": "Niall Richard Murphy, Betsy Beyer, Chris Jones",
        "description": "Insights from Google on SRE and modern DevOps practices. (Paid)",
        "url": "https://sre.google/sre-book/table-of-contents/"
    },
    {
        "type": "book",
        "title": "Infrastructure as Code",
        "author": "Kief Morris",
        "description": "Principles and practices for automating cloud infrastructure. (Paid)",
        "url": "https://www.amazon.com/Infrastructure-Code-Managing-Servers-Cloud/dp/1491924357"
    },
    {
        "type": "book",
        "title": "Effective DevOps",
        "author": "Jennifer Davis and Katherine Daniels",
        "description": "Focus on team culture and collaboration in DevOps environments. (Paid)",
        "url": "https://www.amazon.com/Effective-DevOps-Collaboration-Performance-Organizations/dp/1491926309"
    },
    {
        "type": "course",
        "title": "Docker and Kubernetes: The Complete Guide",
        "provider": "Udemy",
        "description": "Hands-on Docker and Kubernetes course for real-world DevOps. (Paid)",
        "url": "https://www.udemy.com/course/docker-kubernetes-the-complete-guide/"
    },
    {
        "type": "course",
        "title": "Google IT Automation with Python",
        "provider": "Coursera, Google",
        "description": "Focuses on Python, Git, and IT automation with relevance to DevOps. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/professional-certificates/google-it-automation"
    },
    {
        "type": "course",
        "title": "AWS Certified DevOps Engineer - Professional",
        "provider": "Udemy",
        "description": "Certification prep for DevOps engineers working with AWS. (Paid)",
        "url": "https://www.udemy.com/course/aws-certified-devops-engineer-professional/"
    },
    {
        "type": "course",
        "title": "Introduction to DevOps",
        "provider": "edX, Microsoft",
        "description": "DevOps fundamentals and CI/CD pipelines. Free with paid certificate.",
        "url": "https://www.edx.org/course/introduction-to-devops"
    },
    {
        "type": "course",
        "title": "Learn DevOps: The Complete Kubernetes Guide",
        "provider": "Udemy",
        "description": "Comprehensive Kubernetes and cloud native DevOps course. (Paid)",
        "url": "https://www.udemy.com/course/learn-devops-the-complete-kubernetes-guide/"
    },
    {
        "type": "website",
        "title": "Kubernetes Documentation",
        "description": "Official docs and tutorials for Kubernetes container orchestration. (Free)",
        "url": "https://kubernetes.io/docs/"
    },
    {
        "type": "website",
        "title": "Docker Documentation",
        "description": "Comprehensive Docker containerization resources and guides. (Free)",
        "url": "https://docs.docker.com/"
    },
    {
        "type": "website",
        "title": "Terraform by HashiCorp",
        "description": "Infrastructure as Code tool documentation and tutorials. (Free)",
        "url": "https://www.terraform.io/docs"
    },
    {
        "type": "website",
        "title": "DevOps.com",
        "description": "News, tutorials, and best practices in the DevOps space. (Free)",
        "url": "https://devops.com/"
    },
    {
        "type": "website",
        "title": "Continuous Delivery Foundation",
        "description": "Resources and community for continuous integration and delivery. (Free)",
        "url": "https://cd.foundation/"
    },
    {
        "type": "reddit",
        "title": "r/devops",
        "description": "Community discussing automation, CI/CD, and cloud infrastructure. (Free)",
        "url": "https://www.reddit.com/r/devops/"
    },
    {
        "type": "reddit",
        "title": "r/kubernetes",
        "description": "Kubernetes-focused discussions and support. (Free)",
        "url": "https://www.reddit.com/r/kubernetes/"
    },
    {
        "type": "reddit",
        "title": "r/docker",
        "description": "Discussions about Docker container technology. (Free)",
        "url": "https://www.reddit.com/r/docker/"
    },
    {
        "type": "reddit",
        "title": "r/terraform",
        "description": "Community for HashiCorp Terraform users and experts. (Free)",
        "url": "https://www.reddit.com/r/Terraform/"
    },
    {
        "type": "reddit",
        "title": "r/androiddevops",
        "description": "Focused on DevOps in Android development. (Free)",
        "url": "https://www.reddit.com/r/androiddevops/"
    },
    {
        "type": "discord",
        "title": "DevOps & SRE",
        "description": "Discord for discussions on DevOps practices and Site Reliability Engineering. (Free)",
        "url": "https://discord.gg/devops"
    },
    {
        "type": "discord",
        "title": "Kubernetes Community",
        "description": "Official Kubernetes Discord for community support and development. (Free)",
        "url": "https://discord.gg/kubernetes"
    },
    {
        "type": "discord",
        "title": "Docker Community",
        "description": "Official Docker chat server for users and developers. (Free)",
        "url": "https://discord.gg/docker"
    },
    {
        "type": "discord",
        "title": "Terraform Community",
        "description": "Community for Terraform practitioners to share knowledge. (Free)",
        "url": "https://discord.gg/terraform"
    },
    {
        "type": "discord",
        "title": "Cloud Native Computing Foundation (CNCF)",
        "description": "Discuss cloud native projects including Kubernetes and Prometheus. (Free)",
        "url": "https://discord.gg/cncf"
    }
],
"block chain": [
    {
        "type": "youtube",
        "title": "Ivan on Tech",
        "description": "Blockchain and cryptocurrency education with lots of technical content. (Free)",
        "url": "https://www.youtube.com/c/IvanonTech"
    },
    {
        "type": "youtube",
        "title": "EatTheBlocks",
        "description": "Ethereum and blockchain development tutorials. (Free)",
        "url": "https://www.youtube.com/c/EatTheBlocks"
    },
    {
        "type": "youtube",
        "title": "Dapp University",
        "description": "Hands-on tutorials for building decentralized applications on Ethereum. (Free and Paid)",
        "url": "https://www.youtube.com/c/DappUniversity"
    },
    {
        "type": "youtube",
        "title": "Finematics",
        "description": "Explainers on DeFi, NFTs, and blockchain technology. (Free)",
        "url": "https://www.youtube.com/c/Finematics"
    },
    {
        "type": "youtube",
        "title": "Whiteboard Crypto",
        "description": "Clear blockchain concepts and technical insights. (Free)",
        "url": "https://www.youtube.com/c/WhiteboardCrypto"
    },
    {
        "type": "book",
        "title": "Mastering Bitcoin",
        "author": "Andreas M. Antonopoulos",
        "description": "Comprehensive technical guide to Bitcoin and blockchain. (Paid)",
        "url": "https://bitcoinbook.info/"
    },
    {
        "type": "book",
        "title": "Mastering Ethereum",
        "author": "Andreas M. Antonopoulos and Gavin Wood",
        "description": "Deep dive into Ethereum blockchain and smart contract development. (Free and Paid)",
        "url": "https://github.com/ethereumbook/ethereumbook"
    },
    {
        "type": "book",
        "title": "Blockchain Basics",
        "author": "Daniel Drescher",
        "description": "Non-technical introduction to blockchain technology. (Paid)",
        "url": "https://www.amazon.com/Blockchain-Basics-Non-Technical-Introduction-Technology/dp/1484226038"
    },
    {
        "type": "book",
        "title": "The Basics of Bitcoins and Blockchains",
        "author": "Antony Lewis",
        "description": "Concise beginner's guide to Bitcoin and blockchains. (Paid)",
        "url": "https://www.amazon.com/Basics-Bitcoins-Blockchains-Antony-Lewis/dp/164250011X"
    },
    {
        "type": "book",
        "title": "DeFi and the Future of Finance",
        "author": "Campbell R. Harvey, Ashwin Ramachandran, Joey Santoro",
        "description": "Explores DeFi concepts and blockchain's impact on finance. (Paid)",
        "url": "https://www.amazon.com/DeFi-Future-Finance-Campbell-Harvey/dp/0262044683"
    },
    {
        "type": "course",
        "title": "Blockchain Specialization",
        "provider": "Coursera, University at Buffalo",
        "description": "Covering blockchain basics and applications in business. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/specializations/blockchain"
    },
    {
        "type": "course",
        "title": "Ethereum and Solidity: The Complete Developer's Guide",
        "provider": "Udemy",
        "description": "Hands-on course teaching Solidity and Ethereum dapp development. (Paid)",
        "url": "https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/"
    },
    {
        "type": "course",
        "title": "Bitcoin and Cryptocurrency Technologies",
        "provider": "Coursera, Princeton University",
        "description": "Technical introduction to Bitcoin and crypto protocols. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/cryptocurrency"
    },
    {
        "type": "course",
        "title": "Blockchain Developer Nanodegree",
        "provider": "Udacity",
        "description": "In-depth paid program for blockchain development skills. (Paid)",
        "url": "https://www.udacity.com/course/blockchain-developer-nanodegree--nd1309"
    },
    {
        "type": "course",
        "title": "Introduction to Hyperledger Blockchain Technologies",
        "provider": "edX, Linux Foundation",
        "description": "Covers Hyperledger Fabric and blockchain principles. Free with paid certificate.",
        "url": "https://www.edx.org/course/introduction-to-hyperledger-blockchain-technologies"
    },
    {
        "type": "website",
        "title": "Ethereum.org",
        "description": "Official Ethereum project site with developer tutorials and docs. (Free)",
        "url": "https://ethereum.org/en/developers/"
    },
    {
        "type": "website",
        "title": "Bitcoin.org",
        "description": "Resource hub for Bitcoin fundamentals and documentation. (Free)",
        "url": "https://bitcoin.org/en/"
    },
    {
        "type": "website",
        "title": "CryptoZombies",
        "description": "Interactive Solidity game development tutorials. (Free)",
        "url": "https://cryptozombies.io/"
    },
    {
        "type": "website",
        "title": "DeFi Pulse",
        "description": "Trends and analytics on DeFi projects. (Free)",
        "url": "https://defipulse.com/"
    },
    {
        "type": "website",
        "title": "CoinGecko",
        "description": "Cryptocurrency market data and information. (Free)",
        "url": "https://www.coingecko.com/"
    },
    {
        "type": "reddit",
        "title": "r/ethereum",
        "description": "Ethereum community discussing updates, development, and ecosystem. (Free)",
        "url": "https://www.reddit.com/r/ethereum/"
    },
    {
        "type": "reddit",
        "title": "r/Bitcoin",
        "description": "Bitcoin discussion and news community. (Free)",
        "url": "https://www.reddit.com/r/Bitcoin/"
    },
    {
        "type": "reddit",
        "title": "r/ethdev",
        "description": "Ethereum developers’ subreddit for technical discussions. (Free)",
        "url": "https://www.reddit.com/r/ethdev/"
    },
    {
        "type": "reddit",
        "title": "r/defi",
        "description": "Decentralized finance discussions and projects. (Free)",
        "url": "https://www.reddit.com/r/defi/"
    },
    {
        "type": "reddit",
        "title": "r/cryptocurrency",
        "description": "General cryptocurrency discussion and news. (Free)",
        "url": "https://www.reddit.com/r/CryptoCurrency/"
    },
    {
        "type": "discord",
        "title": "Ethereum Developers",
        "description": "Discord for Ethereum developers and community members. (Free)",
        "url": "https://discord.gg/CetY6Y4"
    },
    {
        "type": "discord",
        "title": "Crypto Devs",
        "description": "Community for blockchain developers to share knowledge and projects. (Free)",
        "url": "https://discord.gg/cryptodevs"
    },
    {
        "type": "discord",
        "title": "Dapp University",
        "description": "Official Discord channel for Dapp University courses and discussion. (Free)",
        "url": "https://discord.gg/dappuniversity"
    },
    {
        "type": "discord",
        "title": "NFT Talk",
        "description": "Community focused on NFTs, blockchain art, and related technologies. (Free)",
        "url": "https://discord.gg/nfttalk"
    },
    {
        "type": "discord",
        "title": "DeFi Chain",
        "description": "Discord for decentralized finance discussions and developer support. (Free)",
        "url": "https://discord.gg/defichain"
    }
],
"internet of things": [
    {
        "type": "youtube",
        "title": "Andreas Spiess",
        "description": "Popular channel focusing on IoT projects, sensors, and microcontrollers like ESP8266 and ESP32. (Free)",
        "url": "https://www.youtube.com/c/AndreasSpiess"
    },
    {
        "type": "youtube",
        "title": "The IoT Academy",
        "description": "Tutorials and explanations on IoT technologies, protocols, and applications. (Free)",
        "url": "https://www.youtube.com/c/TheIoTAcademy"
    },
    {
        "type": "youtube",
        "title": "Great Projects",
        "description": "Practical IoT project tutorials using Raspberry Pi, Arduino, and sensors. (Free)",
        "url": "https://www.youtube.com/c/GreatProjects"
    },
    {
        "type": "youtube",
        "title": "Paul McWhorter",
        "description": "Detailed tutorials on Arduino and IoT hardware programming. (Free)",
        "url": "https://www.youtube.com/c/PaulMcWhorter"
    },
    {
        "type": "youtube",
        "title": "IoT Tech Trends",
        "description": "Industry news, product reviews, and IoT technology insights. (Free)",
        "url": "https://www.youtube.com/c/IoTTechTrends"
    },
    {
        "type": "book",
        "title": "Building the Internet of Things",
        "author": "Maciej Kranz",
        "description": "Strategic guide to IoT business and technology landscape. (Paid)",
        "url": "https://www.amazon.com/Building-Internet-Things-Maciej-Kranz/dp/1119285665"
    },
    {
        "type": "book",
        "title": "Internet of Things: A Hands-On Approach",
        "author": "Arshdeep Bahga and Vijay Madisetti",
        "description": "Technical foundation with practical IoT applications and coding examples. (Paid)",
        "url": "https://www.amazon.com/Internet-Things-Hands-Arshdeep-Bahga/dp/0996025510"
    },
    {
        "type": "book",
        "title": "Designing Connected Products",
        "author": "Claire Rowland, Elizabeth Goodman",
        "description": "User-centric approach to IoT product design and development. (Paid)",
        "url": "https://www.oreilly.com/library/view/designing-connected-products/9781449378065/"
    },
    {
        "type": "book",
        "title": "Getting Started with Raspberry Pi",
        "author": "Matt Richardson and Shawn Wallace",
        "description": "Guide for beginners on Raspberry Pi to build IoT projects. (Paid)",
        "url": "https://www.oreilly.com/library/view/getting-started-with/9781449344896/"
    },
    {
        "type": "book",
        "title": "Learning Internet of Things",
        "author": "Peter Waher",
        "description": "Introduction to concepts, protocols, and technologies in IoT. (Paid)",
        "url": "https://www.packtpub.com/product/learning-internet-of-things/9781784392166"
    },
    {
        "type": "course",
        "title": "Introduction to the Internet of Things and Embedded Systems",
        "provider": "Coursera, UC Irvine",
        "description": "Fundamentals of IoT systems and hardware interfacing. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/introduction-internet-of-things"
    },
    {
        "type": "course",
        "title": "Internet of Things (IoT) - An Introduction",
        "provider": "edX, Curtin University",
        "description": "Overview of IoT concepts, architecture, and applications. Free with paid certificate.",
        "url": "https://www.edx.org/course/internet-of-things-iot-an-introduction"
    },
    {
        "type": "course",
        "title": "IoT MicroMasters Program",
        "provider": "edX, Curtin University",
        "description": "In-depth paid program covering IoT system design and analysis.",
        "url": "https://www.edx.org/micromasters/curtinx-internet-of-things"
    },
    {
        "type": "course",
        "title": "IoT Foundations",
        "provider": "LinkedIn Learning",
        "description": "Covers basics of IoT architecture and protocols. (Paid with free trial)",
        "url": "https://www.linkedin.com/learning/iot-foundations"
    },
    {
        "type": "course",
        "title": "Learn IoT with Raspberry Pi",
        "provider": "Udemy",
        "description": "Practical IoT projects on Raspberry Pi. (Paid)",
        "url": "https://www.udemy.com/course/iot-with-raspberry-pi/"
    },
    {
        "type": "website",
        "title": "IoT For All",
        "description": "IoT tutorials, news, and industry insights. (Free)",
        "url": "https://www.iotforall.com/"
    },
    {
        "type": "website",
        "title": "Hackster.io",
        "description": "Community for IoT project sharing and tutorials. (Free)",
        "url": "https://www.hackster.io/iot"
    },
    {
        "type": "website",
        "title": "Adafruit Learning System",
        "description": "Extensive IoT hardware project tutorials. (Free)",
        "url": "https://learn.adafruit.com/"
    },
    {
        "type": "website",
        "title": "Raspberry Pi Official Documentation",
        "description": "Guides for Raspberry Pi hardware used in IoT projects. (Free)",
        "url": "https://www.raspberrypi.com/documentation/"
    },
    {
        "type": "website",
        "title": "ThingsBoard",
        "description": "Open-source IoT platform tutorials and documentation. (Free)",
        "url": "https://thingsboard.io/docs/"
    },
    {
        "type": "reddit",
        "title": "r/IOT",
        "description": "Community discussing IoT projects, news, and developments. (Free)",
        "url": "https://www.reddit.com/r/IOT/"
    },
    {
        "type": "reddit",
        "title": "r/esp32",
        "description": "Focused on ESP32 microcontroller and IoT projects. (Free)",
        "url": "https://www.reddit.com/r/esp32/"
    },
    {
        "type": "reddit",
        "title": "r/raspberry_pi",
        "description": "Projects and discussions related to Raspberry Pi in IoT. (Free)",
        "url": "https://www.reddit.com/r/raspberry_pi/"
    },
    {
        "type": "reddit",
        "title": "r/homeautomation",
        "description": "Community focused on smart homes and IoT automation. (Free)",
        "url": "https://www.reddit.com/r/homeautomation/"
    },
    {
        "type": "reddit",
        "title": "r/embedded",
        "description": "Embedded systems and IoT hardware discussions. (Free)",
        "url": "https://www.reddit.com/r/embedded/"
    },
    {
        "type": "discord",
        "title": "IoT Community",
        "description": "Supportive Discord community for IoT developers and enthusiasts. (Free)",
        "url": "https://discord.gg/iot"
    },
    {
        "type": "discord",
        "title": "ESP32 Developers",
        "description": "Focused on ESP32 IoT hardware and development. (Free)",
        "url": "https://discord.gg/esp32"
    },
    {
        "type": "discord",
        "title": "Raspberry Pi Official",
        "description": "Official Raspberry Pi community Discord server. (Free)",
        "url": "https://discord.gg/raspberrypi"
    },
    {
        "type": "discord",
        "title": "Home Automation",
        "description": "Community for smart home IoT automation discussions. (Free)",
        "url": "https://discord.gg/homeautomation"
    },
    {
        "type": "discord",
        "title": "Embedded Systems",
        "description": "Discord for embedded systems and IoT hardware topics. (Free)",
        "url": "https://discord.gg/embeddedsystems"
    }
],
"ar vr": [
    {
        "type": "youtube",
        "title": "Valem",
        "description": "AR and VR tutorials including Unity and Unreal Engine projects. (Free)",
        "url": "https://www.youtube.com/c/ValemVR"
    },
    {
        "type": "youtube",
        "title": "Mix & Jam",
        "description": "Game development with a focus on AR/VR prototypes and mechanics. (Free)",
        "url": "https://www.youtube.com/c/MixandJam"
    },
    {
        "type": "youtube",
        "title": "Brackeys",
        "description": "Unity tutorials covering VR game development fundamentals. (Free)",
        "url": "https://www.youtube.com/c/Brackeys"
    },
    {
        "type": "youtube",
        "title": "The VR Developer",
        "description": "Courses and tutorials on creating VR applications. (Free and Paid)",
        "url": "https://www.youtube.com/c/TheVRDeveloper"
    },
    {
        "type": "youtube",
        "title": "Game Dev Guide",
        "description": "Unity and Unreal Engine tutorials applicable for AR and VR. (Free)",
        "url": "https://www.youtube.com/c/GameDevGuide"
    },
    {
        "type": "book",
        "title": "Augmented Reality: Principles and Practice",
        "author": "Dieter Schmalstieg and Tobias Hollerer",
        "description": "Academic book on AR fundamentals and applications. (Paid)",
        "url": "https://www.pearson.com/store/p/augmented-reality-principles-and-practice/P1000025062"
    },
    {
        "type": "book",
        "title": "Learning Virtual Reality",
        "author": "Tony Parisi",
        "description": "Comprehensive guide on VR development and design. (Paid)",
        "url": "https://www.oreilly.com/library/view/learning-virtual-reality/9781491922831/"
    },
    {
        "type": "book",
        "title": "Unity Virtual Reality Projects",
        "author": "Jonathan Linowes",
        "description": "Step-by-step development of VR applications with Unity. (Paid)",
        "url": "https://www.packtpub.com/product/unity-virtual-reality-projects/9781784390865"
    },
    {
        "type": "book",
        "title": "Practical Augmented Reality",
        "author": "Steve Aukstakalnis",
        "description": "Engineering and designing augmented reality apps. (Paid)",
        "url": "https://www.oreilly.com/library/view/practical-augmented-reality/9781491935613/"
    },
    {
        "type": "book",
        "title": "Virtual & Augmented Reality For Dummies",
        "author": "Paul Mealy and John Carucci",
        "description": "Beginner-friendly introduction to VR and AR technologies and applications. (Paid)",
        "url": "https://www.dummies.com/book/technology/design-graphics/3d-graphics/virtual-augmented-reality-for-dummies-282679/"
    },
    {
        "type": "course",
        "title": "Create Your First AR Experience",
        "provider": "Coursera, University of London",
        "description": "Introductory course on AR development basics. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/ar-building-blocks"
    },
    {
        "type": "course",
        "title": "VR App Development with Unity",
        "provider": "Udemy",
        "description": "Step-by-step guide for building VR applications using Unity. (Paid)",
        "url": "https://www.udemy.com/course/vr-app-development-with-unity/"
    },
    {
        "type": "course",
        "title": "Augmented Reality & VR Metaverse Developer",
        "provider": "Udemy",
        "description": "Comprehensive paid course covering AR, VR and emerging Metaverse technology.",
        "url": "https://www.udemy.com/course/ar-vr-metaverse-developer/"
    },
    {
        "type": "course",
        "title": "Unity XR: How to Build AR and VR Apps",
        "provider": "LinkedIn Learning",
        "description": "Course on Unity extended reality development. (Paid with free trial)",
        "url": "https://www.linkedin.com/learning/unity-xr-how-to-build-ar-and-vr-apps"
    },
    {
        "type": "course",
        "title": "Introduction to Virtual Reality",
        "provider": "Udacity",
        "description": "Free and paid courses focused on fundamentals of VR programming.",
        "url": "https://www.udacity.com/course/introduction-to-virtual-reality--ud400"
    },
    {
        "type": "website",
        "title": "Unity Learn",
        "description": "Official tutorials and documentation for Unity AR/VR development. (Free and Paid content)",
        "url": "https://learn.unity.com/"
    },
    {
        "type": "website",
        "title": "Unreal Engine Documentation",
        "description": "Official Unreal Engine tutorials on VR and AR app creation. (Free)",
        "url": "https://docs.unrealengine.com/en-US/Platforms/VR/index.html"
    },
    {
        "type": "website",
        "title": "Augment",
        "description": "Resources and tools focused on augmented reality experiences. (Free)",
        "url": "https://www.augment.com/resources/"
    },
    {
        "type": "website",
        "title": "XR Today",
        "description": "News and insights on AR, VR, and mixed reality technology trends. (Free)",
        "url": "https://www.xrtoday.com/"
    },
    {
        "type": "website",
        "title": "Road to VR",
        "description": "Industry news and comprehensive VR development resources. (Free)",
        "url": "https://www.roadtovr.com/"
    },
    {
        "type": "reddit",
        "title": "r/augmentedreality",
        "description": "Community sharing news and projects related to AR technology. (Free)",
        "url": "https://www.reddit.com/r/augmentedreality/"
    },
    {
        "type": "reddit",
        "title": "r/virtualreality",
        "description": "Discussions on VR hardware, games, and development. (Free)",
        "url": "https://www.reddit.com/r/virtualreality/"
    },
    {
        "type": "reddit",
        "title": "r/Unity3D",
        "description": "Unity engine community with many VR and AR project discussions. (Free)",
        "url": "https://www.reddit.com/r/Unity3D/"
    },
    {
        "type": "reddit",
        "title": "r/VRDev",
        "description": "Developer community focused on virtual reality applications. (Free)",
        "url": "https://www.reddit.com/r/VRDev/"
    },
    {
        "type": "reddit",
        "title": "r/UnrealEngine",
        "description": "Unreal Engine developers sharing content including VR and AR. (Free)",
        "url": "https://www.reddit.com/r/unrealengine/"
    },
    {
        "type": "discord",
        "title": "VR Devs",
        "description": "Active Discord community of VR developers and enthusiasts. (Free)",
        "url": "https://discord.gg/vrdev"
    },
    {
        "type": "discord",
        "title": "Unity XR Developers",
        "description": "Official Unity Discord focused on AR and VR projects. (Free)",
        "url": "https://discord.gg/unityxr"
    },
    {
        "type": "discord",
        "title": "Unreal Slackers",
        "description": "Large Unreal Engine development community including VR/AR channels. (Free)",
        "url": "https://discord.gg/unrealslackers"
    },
    {
        "type": "discord",
        "title": "XR Bootcamp",
        "description": "Community for XR developers and learners. (Free)",
        "url": "https://discord.gg/xrbootcamp"
    },
    {
        "type": "discord",
        "title": "Game Dev Network",
        "description": "Multi-purpose game development Discord with AR/VR focus areas. (Free)",
        "url": "https://discord.gg/gamedev"
    }
],
// Non Tech Skills
"communication": [
    {
        "type": "youtube",
        "title": "Communication Coach Alex Lyon",
        "description": "Effective communication skills, tips, and strategies for professional settings. (Free)",
        "url": "https://www.youtube.com/c/AlexLyonCommunicationCoach"
    },
    {
        "type": "youtube",
        "title": "Craig Hadden",
        "description": "Public speaking and presentation skills tutorials and tips. (Free)",
        "url": "https://www.youtube.com/c/CraigHadden"
    },
    {
        "type": "youtube",
        "title": "Maneesh Sathi",
        "description": "Workplace communication and soft skills development. (Free)",
        "url": "https://www.youtube.com/c/ManeeshSathi"
    },
    {
        "type": "youtube",
        "title": "Harvard Business Review",
        "description": "Professional communication, leadership, and management tips. (Free)",
        "url": "https://www.youtube.com/user/harvardbusiness"
    },
    {
        "type": "youtube",
        "title": "Speak Confidently",
        "description": "Practical tips to improve speaking, listening, and interpersonal skills. (Free)",
        "url": "https://www.youtube.com/c/SpeakConfidently"
    },
    {
        "type": "book",
        "title": "Crucial Conversations",
        "author": "Al Switzler, Joseph Grenny, Ron McMillan, and Al Switzler",
        "description": "Strategies for effective dialogue in high-stakes situations. (Paid)",
        "url": "https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/0071771328"
    },
    {
        "type": "book",
        "title": "Never Split the Difference",
        "author": "Chris Voss",
        "description": "Negotiation techniques that improve communication and influence. (Paid)",
        "url": "https://www.amazon.com/Never-Split-Difference-Negotiating-Not/dp/0062407805"
    },
    {
        "type": "book",
        "title": "How to Win Friends and Influence People",
        "author": "Dale Carnegie",
        "description": "Classic techniques on effective communication and relationship building. (Paid)",
        "url": "https://www.amazon.com/How-Win-Friends-Influence-People/dp/0671027034"
    },
    {
        "type": "book",
        "title": "Difficult Conversations",
        "author": "Douglas Stone, Bruce Patton, Sheila Heen",
        "description": "Navigating challenging dialogues in personal and professional settings. (Paid)",
        "url": "https://www.amazon.com/Difficult-Conversations-Discuss-What-Matters/dp/0143118447"
    },
    {
        "type": "book",
        "title": "Made to Stick",
        "author": "Chip Heath, Dan Heath",
        "description": "How to craft memorable, impactful messages. (Paid)",
        "url": "https://www.amazon.com/Made-Stick-Why-Some-Persuasive/dp/1400064287"
    },
    {
        "type": "course",
        "title": "Effective Business Communication",
        "provider": "Coursera, University of Pennsylvania",
        "description": "Focus on professional communication skills for the workplace. (Free to audit, Paid certificate)",
        "url": "https://www.coursera.org/learn/effective-business-communication"
    },
    {
        "type": "course",
        "title": "Communication Skills for Teamwork",
        "provider": "edX, Queensland University of Technology",
        "description": "Courses on interpersonal communication and teamwork skills. (Free with paid certificate)",
        "url": "https://www.edx.org/course/communication-skills"
    },
    {
        "type": "course",
        "title": "Business Communication Skills",
        "provider": "LinkedIn Learning",
        "description": "Professional communication and presentation skills. (Paid with free trial)",
        "url": "https://www.linkedin.com/learning/business-communication-skills"
    },
    {
        "type": "course",
        "title": "Effective Communication in the Workplace",
        "provider": "Udemy",
        "description": "Practical workplace communication tactics. (Paid)",
        "url": "https://www.udemy.com/course/communication-skills-for-work/"
    },
    {
        "type": "website",
        "title": "MindTools",
        "description": "Guides and articles on communication skills, leadership, and management. (Free and Paid)",
        "url": "https://www.mindtools.com/"
    },
    {
        "type": "website",
        "title": "TED Talks on Communication",
        "description": "Inspiring talks on personal and professional communication. (Free)",
        "url": "https://www.ted.com/topics/communication"
    },
    {
        "type": "website",
        "title": "Toastmasters International",
        "description": "Global organization focusing on public speaking and leadership development. (Paid membership, local clubs mostly free)",
        "url": "https://www.toastmasters.org/"
    },
    {
        "type": "reddit",
        "title": "r/communication",
        "description": "Community sharing advice and insights on communication skills. (Free)",
        "url": "https://www.reddit.com/r/communication/"
    },
    {
        "type": "reddit",
        "title": "r/PublicSpeakers",
        "description": "Discussions around public speaking and presentation skills. (Free)",
        "url": "https://www.reddit.com/r/PublicSpeakers/"
    },
    {
        "type": "reddit",
        "title": "r/selfimprovement",
        "description": "Various personal development topics including communication. (Free)",
        "url": "https://www.reddit.com/r/selfimprovement/"
    },
    {
        "type": "discord",
        "title": "public speaking and communication",
        "description": "Community for practicing and improving public speaking skills. (Free)",
        "url": "https://discord.gg/publicspeaking"
    },
    {
        "type": "discord",
        "title": "Leadership & Communication",
        "description": "Supportive community for leadership and communication development. (Free)",
        "url": "https://discord.gg/leadership"
    },
    {
        "type": "discord",
        "title": "Soft Skills Hub",
        "description": "Community focusing on soft skills including communication and teamwork. (Free)",
        "url": "https://discord.gg/softskills"
    }
],
"project management": [
    {
        "type": "youtube",
        "title": "Project Management Institute",
        "description": "Official channel with webinars, project management techniques, and certifications. (Free)",
        "url": "https://www.youtube.com/c/Pmi"
    },
    {
        "type": "youtube",
        "title": "Simplilearn",
        "description": "Project management tutorials covering PMP, Agile, Scrum, and more. (Free and Paid)",
        "url": "https://www.youtube.com/c/Simplilearn"
    },
    {
        "type": "youtube",
        "title": "Project Management Simplified",
        "description": "Clear and practical tips on managing projects effectively. (Free)",
        "url": "https://www.youtube.com/c/PMsimplified"
    },
    {
        "type": "youtube",
        "title": "MindView",
        "description": "Project planning, scheduling, and collaboration tutorials. (Free)",
        "url": "https://www.youtube.com/c/MindView"
    },
    {
        "type": "youtube",
        "title": "Praxis Framework",
        "description": "Comprehensive insights on project, program, and portfolio management. (Free)",
        "url": "https://www.youtube.com/c/PraxisFramework"
    },
    {
        "type": "book",
        "title": "A Guide to the Project Management Body of Knowledge (PMBOK)",
        "author": "PMI",
        "description": "Standard for project management best practices. (Paid)",
        "url": "https://www.amazon.com/dp/1628253704"
    },
    {
        "type": "book",
        "title": "Scrum: The Art of Doing Twice the Work in Half the Time",
        "author": "Jeff Sutherland",
        "description": "Agile and Scrum methodologies in project management. (Paid)",
        "url": "https://www.amazon.com/Scrum-Twice-Work-Half-Time/dp/038534645X"
    },
    {
        "type": "book",
        "title": "The Lean Startup",
        "author": "Eric Ries",
        "description": "Focuses on iterative project and product management for startups. (Paid)",
        "url": "https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898"
    },
    {
        "type": "book",
        "title": "Critical Chain",
        "author": "Eliyahu M. Goldratt",
        "description": "Management theory for project scheduling and resource management. (Paid)",
        "url": "https://www.amazon.com/Critical-Chain-Project-Management-Management/dp/0884271534"
    },
    {
        "type": "course",
        "title": "Project Management Principles and Practices",
        "provider": "Coursera, UCI",
        "description": "Fundamentals of project management. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/specializations/project-management"
    },
    {
        "type": "course",
        "title": "Agile Development Using Scrum",
        "provider": "Coursera, University of Virginia",
        "description": "Agile Scrum methodology course. Free to audit, paid certification available.",
        "url": "https://www.coursera.org/learn/agile-development"
    },
    {
        "type": "course",
        "title": "Introduction to Project Management",
        "provider": "edX, University of Adelaide",
        "description": "Core concepts of managing projects. Free with paid certificate option.",
        "url": "https://www.edx.org/course/introduction-to-project-management"
    },
    {
        "type": "website",
        "title": "ProjectManagement.com",
        "description": "Rich repository of articles, templates, and tools for project managers. (Free)",
        "url": "https://www.projectmanagement.com/"
    },
    {
        "type": "website",
        "title": "PMI.org",
        "description": "Official site of Project Management Institute covering standards, certifications, and resources. (Free and Paid memberships)",
        "url": "https://www.pmi.org/"
    },
    {
        "type": "website",
        "title": "Scrum.org",
        "description": "Official Scrum resource and certification body. (Free resources, Paid exams)",
        "url": "https://www.scrum.org/"
    },
    {
        "type": "website",
        "title": "Agile Alliance",
        "description": "Resources, articles, and community for Agile project management. (Free)",
        "url": "https://www.agilealliance.org/"
    },
    {
        "type": "reddit",
        "title": "r/projectmanagement",
        "description": "Discussion community around project management best practices and tools. (Free)",
        "url": "https://www.reddit.com/r/projectmanagement/"
    },
    {
        "type": "reddit",
        "title": "r/Agile",
        "description": "Community for Agile methodologies including Scrum and Kanban. (Free)",
        "url": "https://www.reddit.com/r/agile/"
    },
    {
        "type": "reddit",
        "title": "r/PMP",
        "description": "Community for PMP certification and project management discussion. (Free)",
        "url": "https://www.reddit.com/r/PMP/"
    },
    {
        "type": "discord",
        "title": "Project Management Institute",
        "description": "Official PMI community for discussion, certifications, and events. (Free)",
        "url": "https://discord.gg/pmi"
    },
    {
        "type": "discord",
        "title": "Agile Community",
        "description": "Focus on Agile practices, Scrum, and Kanban. (Free)",
        "url": "https://discord.gg/agile"
    },
    {
        "type": "discord",
        "title": "Project Managers",
        "description": "Community for professional project managers to network. (Free)",
        "url": "https://discord.gg/projectmanagers"
    },
    {
        "type": "discord",
        "title": "Scrum and Agile",
        "description": "Discussion for Scrum and Agile practitioners. (Free)",
        "url": "https://discord.gg/scrum"
    }
],
"digital marketing": [
    {
        "type": "youtube",
        "title": "Neil Patel",
        "description": "Digital marketing strategies, SEO, content marketing, and growth hacking tips. (Free)",
        "url": "https://www.youtube.com/user/neilvkpatel"
    },
    {
        "type": "youtube",
        "title": "Marketing 360",
        "description": "Digital marketing tutorials covering SEO, PPC, social media, and email marketing. (Free)",
        "url": "https://www.youtube.com/c/Marketing360"
    },
    {
        "type": "youtube",
        "title": "Ahrefs",
        "description": "SEO tutorials, backlinking, and keyword research strategies. (Free)",
        "url": "https://www.youtube.com/c/AhrefsCom"
    },
    {
        "type": "youtube",
        "title": "HubSpot",
        "description": "Inbound marketing, content marketing, and CRM tutorials from HubSpot experts. (Free)",
        "url": "https://www.youtube.com/user/HubSpot"
    },
    {
        "type": "youtube",
        "title": "Semrush",
        "description": "SEO, PPC, content marketing, and analytics tutorials using Semrush tools. (Free)",
        "url": "https://www.youtube.com/c/Semrush"
    },
    {
        "type": "book",
        "title": "Digital Marketing for Dummies",
        "author": "Ryan Deiss and Russ Henneberry",
        "description": "Beginner-friendly guide covering key digital marketing channels. (Paid)",
        "url": "https://www.amazon.com/Digital-Marketing-Dummies-Ryan-Deiss/dp/1119235590"
    },
    {
        "type": "book",
        "title": "Jab, Jab, Jab, Right Hook",
        "author": "Gary Vaynerchuk",
        "description": "Social media marketing strategies for engaging audiences. (Paid)",
        "url": "https://www.amazon.com/Jab-Right-Hook-Story-Social/dp/006227306X"
    },
    {
        "type": "book",
        "title": "Contagious: How to Build Word of Mouth in the Digital Age",
        "author": "Jonah Berger",
        "description": "Principles behind why things catch on in marketing. (Paid)",
        "url": "https://www.amazon.com/Contagious-Build-Word-Mouth-Digital/dp/1451686579"
    },
    {
        "type": "book",
        "title": "SEO 2025",
        "author": "Adam Clarke",
        "description": "Updated SEO strategies and techniques for 2025. (Paid)",
        "url": "https://www.amazon.com/SEO-2020-Grey-Hat-Search-Strategies/dp/1098798143"
    },
    {
        "type": "book",
        "title": "Email Marketing Rules",
        "author": "Chad S. White",
        "description": "Effective strategies for email marketing campaigns. (Paid)",
        "url": "https://www.amazon.com/Email-Marketing-Rules-Checklists-Campaigns/dp/1544519466"
    },
    {
        "type": "course",
        "title": "Digital Marketing Specialization",
        "provider": "Coursera, University of Illinois",
        "description": "Comprehensive digital marketing course covering SEO, social media, and more. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/specializations/digital-marketing"
    },
    {
        "type": "course",
        "title": "Google Digital Garage",
        "provider": "Google",
        "description": "Free course on fundamentals of digital marketing. (Free)",
        "url": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing"
    },
    {
        "type": "course",
        "title": "SEO Training Course",
        "provider": "Moz Academy",
        "description": "SEO fundamentals and strategies course. (Free and paid)",
        "url": "https://academy.moz.com/"
    },
    {
        "type": "course",
        "title": "Facebook Blueprint",
        "provider": "Meta",
        "description": "Training in Facebook advertising and marketing tools. (Free)",
        "url": "https://www.facebook.com/business/learn"
    },
    {
        "type": "course",
        "title": "The Complete Digital Marketing Course",
        "provider": "Udemy",
        "description": "All-in-one paid course covering digital marketing channels and tools. (Paid)",
        "url": "https://www.udemy.com/course/learn-digital-marketing-course/"
    },
    {
        "type": "website",
        "title": "Neil Patel",
        "description": "SEO, content marketing, and analytics blog and tools. (Free)",
        "url": "https://neilpatel.com/"
    },
    {
        "type": "website",
        "title": "HubSpot Blog",
        "description": "Insights on inbound marketing and sales. (Free)",
        "url": "https://blog.hubspot.com/"
    },
    {
        "type": "website",
        "title": "Ahrefs Blog",
        "description": "SEO guides, case studies, and industry news. (Free)",
        "url": "https://ahrefs.com/blog/"
    },
    {
        "type": "website",
        "title": "Search Engine Land",
        "description": "News and insights on search marketing. (Free)",
        "url": "https://searchengineland.com/"
    },
    {
        "type": "website",
        "title": "Content Marketing Institute",
        "description": "Content marketing resources and research. (Free)",
        "url": "https://contentmarketinginstitute.com/"
    },
    {
        "type": "reddit",
        "title": "r/digital_marketing",
        "description": "Community sharing digital marketing tips and questions. (Free)",
        "url": "https://www.reddit.com/r/digital_marketing/"
    },
    {
        "type": "reddit",
        "title": "r/SEO",
        "description": "Focused on SEO news, tips, and discussions. (Free)",
        "url": "https://www.reddit.com/r/SEO/"
    },
    {
        "type": "reddit",
        "title": "r/PPC",
        "description": "Pay-per-click advertising community and advice. (Free)",
        "url": "https://www.reddit.com/r/PPC/"
    },
    {
        "type": "discord",
        "title": "Digital Marketing",
        "description": "Active Discord community covering SEO, social media, and content strategy. (Free)",
        "url": "https://discord.gg/digitalmarketing"
    },
    {
        "type": "discord",
        "title": "SEO Signals Lab",
        "description": "Discord community for SEO tips and networking. (Free)",
        "url": "https://discord.gg/seo"
    },
    {
        "type": "discord",
        "title": "Content Marketing",
        "description": "Community focused on content creation and marketing strategies. (Free)",
        "url": "https://discord.gg/contentmarketing"
    }
],
"financial management": [
    {
        "type": "youtube",
        "title": "Graham Stephan",
        "description": "Personal finance, investing, and financial management advice. (Free)",
        "url": "https://www.youtube.com/c/GrahamStephan"
    },
    {
        "type": "youtube",
        "title": "The Financial Diet",
        "description": "Financial management tips and budgeting advice for all audiences. (Free)",
        "url": "https://www.youtube.com/c/TheFinancialDiet"
    },
    {
        "type": "youtube",
        "title": "Andrei Jikh",
        "description": "Investing, personal finance, and money management tutorials. (Free)",
        "url": "https://www.youtube.com/c/AndreiJikh"
    },
    {
        "type": "youtube",
        "title": "WhiteBoard Finance",
        "description": "Finance education with a focus on budgeting, investing, and wealth building. (Free)",
        "url": "https://www.youtube.com/c/WhiteBoardFinance"
    },
    {
        "type": "youtube",
        "title": "Financial Education",
        "description": "Investing strategies, stock market analysis and wealth management. (Free)",
        "url": "https://www.youtube.com/c/FinancialEducationOfficial"
    },
    {
        "type": "book",
        "title": "The Intelligent Investor",
        "author": "Benjamin Graham",
        "description": "Classic book on value investing and financial prudence. (Paid)",
        "url": "https://www.amazon.com/Intelligent-Investor-Definitive-Value-Investing/dp/0060555661"
    },
    {
        "type": "book",
        "title": "Rich Dad Poor Dad",
        "author": "Robert T. Kiyosaki",
        "description": "Personal finance philosophy and wealth-building mindset. (Paid)",
        "url": "https://www.amazon.com/Rich-Dad-Poor-Teach-Middle/dp/1612680194"
    },
    {
        "type": "book",
        "title": "Your Money or Your Life",
        "author": "Vicki Robin and Joe Dominguez",
        "description": "Guide to transforming relationship with money and financial independence. (Paid)",
        "url": "https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766"
    },
    {
        "type": "book",
        "title": "The Millionaire Next Door",
        "author": "Thomas J. Stanley and William D. Danko",
        "description": "Research on habits of wealthy individuals and money management. (Paid)",
        "url": "https://www.amazon.com/Millionaire-Next-Door-Thomas-Stanley/dp/1589795474"
    },
    {
        "type": "book",
        "title": "I Will Teach You to Be Rich",
        "author": "Ramit Sethi",
        "description": "Practical financial advice for young adults and beginners. (Paid)",
        "url": "https://www.amazon.com/Will-Teach-You-Be-Rich/dp/0761147489"
    },
    {
        "type": "course",
        "title": "Financial Markets",
        "provider": "Coursera, Yale University",
        "description": "Introduction to financial markets, risk, and behavioral finance. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/financial-markets-global"
    },
    {
        "type": "course",
        "title": "Personal & Family Financial Planning",
        "provider": "Coursera, University of Florida",
        "description": "Comprehensive personal financial management course. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/family-planning"
    },
    {
        "type": "course",
        "title": "Finance for Non-Financial Professionals",
        "provider": "Coursera, University of California, Irvine",
        "description": "Basic finance concepts for professionals without finance background. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/finance-for-non-finance"
    },
    {
        "type": "course",
        "title": "Introduction to Corporate Finance",
        "provider": "edX, Wharton School",
        "description": "Introduction to financial management in corporate settings. Free with paid certificate.",
        "url": "https://www.edx.org/course/introduction-to-corporate-finance"
    },
    {
        "type": "course",
        "title": "Investment Management",
        "provider": "Coursera, University of Geneva",
        "description": "Advanced course on investment strategies and portfolio management. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/investment-management"
    },
    {
        "type": "website",
        "title": "Investopedia",
        "description": "Extensive resource of financial definitions, tutorials, and news. (Free and paid premium articles)",
        "url": "https://www.investopedia.com/"
    },
    {
        "type": "website",
        "title": "The Motley Fool",
        "description": "Investment advice, market news, and financial education. (Free and subscription)",
        "url": "https://www.fool.com/"
    },
    {
        "type": "website",
        "title": "Morningstar",
        "description": "Investment research, fund analysis, and portfolio management tools. (Free and paid with subscription)",
        "url": "https://www.morningstar.com/"
    },
    {
        "type": "website",
        "title": "NerdWallet",
        "description": "Financial product reviews and personal finance tips. (Free)",
        "url": "https://www.nerdwallet.com/"
    },
    {
        "type": "website",
        "title": "Khan Academy Personal Finance",
        "description": "Free courses on money management, investing, and economics. (Free)",
        "url": "https://www.khanacademy.org/college-careers-more/personal-finance"
    },
    {
        "type": "reddit",
        "title": "r/personalfinance",
        "description": "Community sharing advice on budgeting, investing, and managing money. (Free)",
        "url": "https://www.reddit.com/r/personalfinance/"
    },
    {
        "type": "reddit",
        "title": "r/investing",
        "description": "Discussion on stock market, investing strategies, and portfolio management. (Free)",
        "url": "https://www.reddit.com/r/investing/"
    },
    {
        "type": "reddit",
        "title": "r/financialindependence",
        "description": "Community focused on achieving financial freedom through smart management. (Free)",
        "url": "https://www.reddit.com/r/financialindependence/"
    },
    {
        "type": "discord",
        "title": "Financial Independence",
        "description": "Discord community focused on personal finance, investing, and FI strategies. (Free)",
        "url": "https://discord.gg/financialindependence"
    },
    {
        "type": "discord",
        "title": "Investment Club",
        "description": "Community discussing stock market, crypto, and investing education. (Free)",
        "url": "https://discord.gg/investment"
    },
    {
        "type": "discord",
        "title": "Personal Finance",
        "description": "General discussion and advice on money management. (Free)",
        "url": "https://discord.gg/personalfinance"
    }
],
"emotional intelligence": [
    {
        "type": "youtube",
        "title": "The School of Life",
        "description": "Lessons on emotional intelligence, psychology, and self-awareness. (Free)",
        "url": "https://www.youtube.com/c/schooloflifechannel"
    },
    {
        "type": "youtube",
        "title": "Daniel Goleman",
        "description": "Insights from the author who popularized emotional intelligence. (Free)",
        "url": "https://www.youtube.com/results?search_query=daniel+goleman"
    },
    {
        "type": "youtube",
        "title": "Big Think",
        "description": "Expert talks on emotional intelligence and human behavior. (Free)",
        "url": "https://www.youtube.com/c/bigthink"
    },
    {
        "type": "youtube",
        "title": "Better Ideas",
        "description": "Self-improvement tips with focus on emotional and social intelligence. (Free)",
        "url": "https://www.youtube.com/c/BetterIdeasYT"
    },
    {
        "type": "youtube",
        "title": "Practical Psychology",
        "description": "Psychology explanations including emotional intelligence concepts. (Free)",
        "url": "https://www.youtube.com/c/PracticalPsychology"
    },
    {
        "type": "book",
        "title": "Emotional Intelligence",
        "author": "Daniel Goleman",
        "description": "Foundational book defining and explaining emotional intelligence. (Paid)",
        "url": "https://www.amazon.com/Emotional-Intelligence-Matter-More-Than/dp/055338371X"
    },
    {
        "type": "book",
        "title": "Emotional Intelligence 2.0",
        "author": "Travis Bradberry and Jean Greaves",
        "description": "Strategies and assessments to improve EQ skills. (Paid)",
        "url": "https://www.amazon.com/Emotional-Intelligence-2-0-Travis-Bradberry/dp/0974320625"
    },
    {
        "type": "book",
        "title": "The EQ Edge",
        "author": "Steven J. Stein and Howard E. Book",
        "description": "Guide to understanding and developing emotional intelligence. (Paid)",
        "url": "https://www.amazon.com/EQ-Edge-Emotional-Intelligence-Impact/dp/1416541111"
    },
    {
        "type": "book",
        "title": "Working with Emotional Intelligence",
        "author": "Daniel Goleman",
        "description": "Emotional intelligence in the workplace and leadership. (Paid)",
        "url": "https://www.amazon.com/Working-Emotional-Intelligence-Daniel-Goleman/dp/055384375X"
    },
    {
        "type": "book",
        "title": "Self-Compassion",
        "author": "Kristin Neff",
        "description": "Building emotional resilience through self-compassion. (Paid)",
        "url": "https://www.amazon.com/Self-Compassion-Stop-Judging-Yourself-Kindness/dp/0061733512"
    },
    {
        "type": "course",
        "title": "Inspiring Leadership through Emotional Intelligence",
        "provider": "Coursera, Case Western Reserve University",
        "description": "How emotional intelligence empowers leadership capabilities. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/emotional-intelligence-leadership"
    },
    {
        "type": "course",
        "title": "Developing Your Emotional Intelligence",
        "provider": "LinkedIn Learning",
        "description": "Practical steps to build emotional intelligence at work. (Paid with free trial)",
        "url": "https://www.linkedin.com/learning/developing-your-emotional-intelligence"
    },
    {
        "type": "course",
        "title": "Emotional Intelligence at Work",
        "provider": "edX, University of Queensland",
        "description": "Gain EQ skills to succeed professionally. Free with paid certificate.",
        "url": "https://www.edx.org/course/emotional-intelligence-at-work"
    },
    {
        "type": "course",
        "title": "Emotional Intelligence: Cultivating Immense EQ",
        "provider": "Udemy",
        "description": "Tools to improve your emotional intelligence and relationships. (Paid)",
        "url": "https://www.udemy.com/course/emotional-intelligence-cultivating-immense-eq-awareness/"
    },
    {
        "type": "website",
        "title": "Six Seconds",
        "description": "Nonprofit offering EQ tools, assessments and learning resources. (Some free content)",
        "url": "https://www.6seconds.org/"
    },
    {
        "type": "website",
        "title": "The Consortium for Research on Emotional Intelligence in Organizations",
        "description": "Research, reports, and resources on workplace emotional intelligence. (Free)",
        "url": "http://www.eiconsortium.org/"
    },
    {
        "type": "website",
        "title": "Greater Good Science Center",
        "description": "Research-based resources on emotional intelligence and well-being. (Free)",
        "url": "https://greatergood.berkeley.edu/topic/emotional_intelligence"
    },
    {
        "type": "reddit",
        "title": "r/emotionalintelligence",
        "description": "Discussions, advice, and resources on emotional intelligence development. (Free)",
        "url": "https://www.reddit.com/r/emotionalintelligence/"
    },
    {
        "type": "reddit",
        "title": "r/selfimprovement",
        "description": "Topics include emotional intelligence growth and mental health. (Free)",
        "url": "https://www.reddit.com/r/selfimprovement/"
    },
    {
        "type": "discord",
        "title": "Emotional Intelligence Community",
        "description": "Support and discussion for improving EQ and interpersonal skills. (Free)",
        "url": "https://discord.gg/emotionalintelligence"
    },
    {
        "type": "discord",
        "title": "Self-Help & Personal Development",
        "description": "Community for self-improvement including emotional intelligence topics. (Free)",
        "url": "https://discord.gg/selfhelp"
    }
],
"leadership": [
    {
        "type": "youtube",
        "title": "Simon Sinek",
        "description": "Popular motivational talks and leadership philosophies focused on ‘why’. (Free)",
        "url": "https://www.youtube.com/user/SimonSinek"
    },
    {
        "type": "youtube",
        "title": "Leadership Nudge",
        "description": "Short, practical leadership advice and tips for professionals. (Free)",
        "url": "https://www.youtube.com/c/LeadershipNudge"
    },
    {
        "type": "youtube",
        "title": "Craig Groeschel",
        "description": "Leadership insights with a focus on growth and influence. (Free)",
        "url": "https://www.youtube.com/user/CraigGroeschel"
    },
    {
        "type": "youtube",
        "title": "Robin Sharma",
        "description": "Personal growth and leadership development strategies. (Free)",
        "url": "https://www.youtube.com/user/sharmaleadership"
    },
    {
        "type": "youtube",
        "title": "LeadX",
        "description": "Interviews and insights from top leadership experts. (Free)",
        "url": "https://www.youtube.com/c/LeadX"
    },
    {
        "type": "book",
        "title": "Leaders Eat Last",
        "author": "Simon Sinek",
        "description": "Exploring how great leaders build trust and cooperation. (Paid)",
        "url": "https://www.amazon.com/Leaders-Eat-Last-Together-Others/dp/1591848016"
    },
    {
        "type": "book",
        "title": "The 21 Irrefutable Laws of Leadership",
        "author": "John C. Maxwell",
        "description": "Timeless principles for effective leadership. (Paid)",
        "url": "https://www.amazon.com/21-Irrefutable-Laws-Leadership-Follow/dp/0785288376"
    },
    {
        "type": "book",
        "title": "Drive",
        "author": "Daniel H. Pink",
        "description": "Motivation theories and how they relate to leadership. (Paid)",
        "url": "https://www.amazon.com/Drive-Surprising-Truth-About-Motivates/dp/1594484805"
    },
    {
        "type": "book",
        "title": "Dare to Lead",
        "author": "Brené Brown",
        "description": "Courage and vulnerability in leadership. (Paid)",
        "url": "https://www.amazon.com/Dare-Lead-Brave-Conversations-Hearts/dp/0399592520"
    },
    {
        "type": "book",
        "title": "Start with Why",
        "author": "Simon Sinek",
        "description": "Leadership driven by purpose. (Paid)",
        "url": "https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447"
    },
    {
        "type": "course",
        "title": "Leading People and Teams",
        "provider": "Coursera, University of Michigan",
        "description": "Leadership fundamentals including motivating and managing teams. Free audit, paid cert.",
        "url": "https://www.coursera.org/specializations/leading-people-teams"
    },
    {
        "type": "course",
        "title": "Foundations of Everyday Leadership",
        "provider": "edX, Catalyst",
        "description": "Introduction to leadership concepts and skills. Free with paid certificate.",
        "url": "https://www.edx.org/course/foundations-of-everyday-leadership"
    },
    {
        "type": "course",
        "title": "Leadership Communication",
        "provider": "LinkedIn Learning",
        "description": "Building communication skills essential for leaders. Paid with free trial.",
        "url": "https://www.linkedin.com/learning/leadership-communication"
    },
    {
        "type": "course",
        "title": "Developing Your Leadership Style",
        "provider": "Udemy",
        "description": "Practical aspects of becoming an effective leader. (Paid)",
        "url": "https://www.udemy.com/course/developing-your-leadership-style/"
    },
    {
        "type": "website",
        "title": "Harvard Business Review Leadership",
        "description": "Leader insights, research, and case studies. (Free and Paid content)",
        "url": "https://hbr.org/topic/leadership"
    },
    {
        "type": "website",
        "title": "Center for Creative Leadership",
        "description": "Research, articles, and tools for leadership development. (Free and Paid resources)",
        "url": "https://www.ccl.org/"
    },
    {
        "type": "website",
        "title": "MindTools Leadership Skills",
        "description": "Leadership skill guides and tools for career development. (Free and Paid)",
        "url": "https://www.mindtools.com/pages/main/newMN_LDR.htm"
    },
    {
        "type": "reddit",
        "title": "r/leadership",
        "description": "Conversations on leadership skills and experiences. (Free)",
        "url": "https://www.reddit.com/r/leadership/"
    },
    {
        "type": "reddit",
        "title": "r/management",
        "description": "Management and leadership topics, support, and advice. (Free)",
        "url": "https://www.reddit.com/r/management/"
    },
    {
        "type": "discord",
        "title": "Leadership & Management",
        "description": "Supportive leadership skills and professional development community. (Free)",
        "url": "https://discord.gg/leadership"
    },
    {
        "type": "discord",
        "title": "Effective Leadership",
        "description": "Community focused on leadership training and networking. (Free)",
        "url": "https://discord.gg/effectiveleadership"
    }
],
"health care skills": [
    {
        "type": "youtube",
        "title": "Osmosis",
        "description": "Educational videos on medical concepts, disease mechanisms, and health care fundamentals. (Free)",
        "url": "https://www.youtube.com/c/Osmosis"
    },
    {
        "type": "youtube",
        "title": "MedCram",
        "description": "Clear and concise explanations of medical topics, clinical reasoning, and patient care. (Free)",
        "url": "https://www.youtube.com/c/MEDCRAMvideos"
    },
    {
        "type": "youtube",
        "title": "Johns Hopkins Medicine",
        "description": "Lectures, health tips, and research updates from Johns Hopkins experts. (Free)",
        "url": "https://www.youtube.com/user/JohnsHopkinsMedicine"
    },
    {
        "type": "youtube",
        "title": "Strong Medicine",
        "description": "Short videos on medical topics for exam prep and clinical skills. (Free)",
        "url": "https://www.youtube.com/c/StrongMedicine"
    },
    {
        "type": "youtube",
        "title": "Armando Hasudungan",
        "description": "Illustrated tutorials of medical and health science topics. (Free)",
        "url": "https://www.youtube.com/c/ArmandoHasudungan"
    },
    {
        "type": "book",
        "title": "Bates' Guide to Physical Examination and History Taking",
        "author": "Lynn Bickley",
        "description": "Essential book on clinical examination skills for healthcare practitioners. (Paid)",
        "url": "https://www.amazon.com/Bates-Guide-Physical-Examination-History/dp/149638938X"
    },
    {
        "type": "book",
        "title": "The Merck Manual of Diagnosis and Therapy",
        "author": "Robert S. Porter et al.",
        "description": "Comprehensive medical reference for diagnostics and treatment. (Paid)",
        "url": "https://www.amazon.com/Merck-Manual-Diagnosis-Therapy-Professional/dp/0911910427"
    },
    {
        "type": "book",
        "title": "Clinical Microbiology Made Ridiculously Simple",
        "author": "Mark Gladwin and William Trattler",
        "description": "Concise review of microbiology and infectious diseases. (Paid)",
        "url": "https://www.amazon.com/Clinical-Microbiology-Made-Ridiculously-Simple/dp/0940780710"
    },
    {
        "type": "book",
        "title": "First Aid for the USMLE Step 1",
        "author": "Tao Le and Vikas Bhushan",
        "description": "Comprehensive review for medical licensing exams with clinical skills. (Paid)",
        "url": "https://www.amazon.com/First-Aid-USMLE-Step-2024/dp/1264656610"
    },
    {
        "type": "book",
        "title": "Medical Terminology: A Short Course",
        "author": "Davis V. Trybulski and others",
        "description": "Introduction to medical vocabulary and terminology. (Paid)",
        "url": "https://www.amazon.com/Medical-Terminology-Short-Davis-Trybulski/dp/032376287X"
    },
    {
        "type": "course",
        "title": "Medical Neuroscience",
        "provider": "Coursera, Duke University",
        "description": "Fundamentals of neurosciences and clinical applications. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/medical-neuroscience"
    },
    {
        "type": "course",
        "title": "Introduction to Global Health",
        "provider": "Coursera, University of Copenhagen",
        "description": "Global health challenges, health systems, and epidemiology. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/global-health"
    },
    {
        "type": "course",
        "title": "Clinical Terminology for International and U.S. Students",
        "provider": "edX, Doane University",
        "description": "Medical vocabulary course for healthcare communication. Free with paid certificate.",
        "url": "https://www.edx.org/course/clinical-terminology-for-international-and-u-s-students"
    },
    {
        "type": "course",
        "title": "Foundations of Healthcare",
        "provider": "OpenWHO by WHO",
        "description": "Basic healthcare concepts and emergency response skills. (Free)",
        "url": "https://openwho.org/courses/FOUNDATIONS-OF-HEALTHCARE"
    },
    {
        "type": "course",
        "title": "Health Informatics",
        "provider": "Udemy",
        "description": "Training in healthcare IT systems and data management. (Paid)",
        "url": "https://www.udemy.com/course/health-informatics/"
    },
    {
        "type": "website",
        "title": "Medscape",
        "description": "Latest medical news, clinical references, and continuing education. (Free)",
        "url": "https://www.medscape.com/"
    },
    {
        "type": "website",
        "title": "CDC Learning Center",
        "description": "Online public health training and clinical guidance. (Free)",
        "url": "https://www.cdc.gov/learning"
    },
    {
        "type": "website",
        "title": "UpToDate",
        "description": "Clinical decision support with evidence-based content. (Subscription required)",
        "url": "https://www.uptodate.com/"
    },
    {
        "type": "website",
        "title": "World Health Organization (WHO)",
        "description": "Global health information, guidelines, and training materials. (Free)",
        "url": "https://www.who.int/"
    },
    {
        "type": "website",
        "title": "NHS Digital Academy",
        "description": "Digital health and leadership training resources. (Free and Paid)",
        "url": "https://digital.nhs.uk/services/digital-academy"
    },
    {
        "type": "reddit",
        "title": "r/medicine",
        "description": "Discussions and information for healthcare professionals and students. (Free)",
        "url": "https://www.reddit.com/r/medicine/"
    },
    {
        "type": "reddit",
        "title": "r/nursing",
        "description": "Community for nursing professionals and students. (Free)",
        "url": "https://www.reddit.com/r/nursing/"
    },
    {
        "type": "reddit",
        "title": "r/medicalschool",
        "description": "Support and resources for medical students. (Free)",
        "url": "https://www.reddit.com/r/medicalschool/"
    },
    {
        "type": "discord",
        "title": "Medical Students Community",
        "description": "Discord for medical students discussing studies and clinical skills. (Free)",
        "url": "https://discord.gg/medicalstudents"
    },
    {
        "type": "discord",
        "title": "Healthcare Professionals",
        "description": "Community for healthcare practitioners across specialties. (Free)",
        "url": "https://discord.gg/healthcarepros"
    }
],
"legal compliance": [
    {
        "type": "youtube",
        "title": "LegalEagle",
        "description": "Legal education videos covering compliance, courtroom procedures, and law basics. (Free)",
        "url": "https://www.youtube.com/c/LegalEagle"
    },
    {
        "type": "youtube",
        "title": "The Law Simplified",
        "description": "Simplified explanations of complex legal topics and compliance issues. (Free)",
        "url": "https://www.youtube.com/c/TheLawSimplified"
    },
    {
        "type": "youtube",
        "title": "LawShelf",
        "description": "Comprehensive legal lessons including compliance and corporate law. (Free)",
        "url": "https://www.youtube.com/user/LawShelf"
    },
    {
        "type": "youtube",
        "title": "Corporate Counsel Business Journal",
        "description": "Legal compliance trends and corporate governance guidance. (Free)",
        "url": "https://www.youtube.com/c/ccbjournal"
    },
    {
        "type": "youtube",
        "title": "Compliance Week",
        "description": "Best practices in regulatory compliance and risk management. (Free)",
        "url": "https://www.youtube.com/c/ComplianceWeek"
    },
    {
        "type": "book",
        "title": "Principles of Corporate Governance",
        "author": "William Yates & Jeffrey Gordon",
        "description": "Modern corporate governance and compliance standards. (Paid)",
        "url": "https://www.amazon.com/Principles-Corporate-Governance-William-Yates/dp/0190697201"
    },
    {
        "type": "book",
        "title": "The Complete Compliance and Ethics Manual",
        "author": "Society of Corporate Compliance and Ethics",
        "description": "Authoritative guide on compliance standards across industries. (Paid)",
        "url": "https://shop.corporatecompliance.org/the-complete-compliance-and-ethics-manual-4th-edition/249"
    },
    {
        "type": "book",
        "title": "Corporate Compliance: Regulation and Enforcement",
        "author": "Mark J. Nigrini",
        "description": "Insights into enforcement and compliance regulations in corporations. (Paid)",
        "url": "https://www.amazon.com/Corporate-Compliance-Regulation-Enforcement-America/dp/1538124083"
    },
    {
        "type": "book",
        "title": "Data Privacy and GDPR Handbook",
        "author": "Mathias Kipp",
        "description": "Guide to data privacy laws and global compliance frameworks. (Paid)",
        "url": "https://www.amazon.com/Data-Privacy-GDPR-Handbook-Kipp/dp/1838987909"
    },
    {
        "type": "book",
        "title": "HIPAA Compliance Handbook",
        "author": "Sharon D. Nelson, et al.",
        "description": "Practical guide to HIPAA regulations for health information compliance. (Paid)",
        "url": "https://www.amazon.com/HIPAA-Compliance-Handbook-Sharon-Nelson/dp/163425081X"
    },
    {
        "type": "course",
        "title": "Introduction to Corporate Governance and Compliance",
        "provider": "Coursera, University of London",
        "description": "Overview of governance principles and compliance requirements. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/corporate-governance-compliance"
    },
    {
        "type": "course",
        "title": "General Data Protection Regulation (GDPR)",
        "provider": "Udemy",
        "description": "Training on GDPR compliance regulations. (Paid)",
        "url": "https://www.udemy.com/course/gdpr-compliance-training-course/"
    },
    {
        "type": "course",
        "title": "Risk Management and Compliance",
        "provider": "edX, NYU",
        "description": "Corporate risk and compliance strategies. Free with paid certificate option.",
        "url": "https://www.edx.org/course/risk-management-and-compliance"
    },
    {
        "type": "course",
        "title": "Healthcare Compliance Certificate",
        "provider": "Health Care Compliance Association",
        "description": "Professional training in healthcare regulatory compliance. (Paid)",
        "url": "https://www.hcca-info.org/certification/CHC"
    },
    {
        "type": "website",
        "title": "Compliance Week",
        "description": "News, insights, and best practices in compliance and risk management. (Free and Paid)",
        "url": "https://www.complianceweek.com/"
    },
    {
        "type": "website",
        "title": "Society of Corporate Compliance and Ethics (SCCE)",
        "description": "Resources and training materials for compliance professionals. (Free and Paid)",
        "url": "https://www.corporatecompliance.org/"
    },
    {
        "type": "website",
        "title": "Federal Trade Commission (FTC)",
        "description": "Regulatory guidance and compliance resources from the FTC. (Free)",
        "url": "https://www.ftc.gov/"
    },
    {
        "type": "website",
        "title": "European Data Protection Board (EDPB)",
        "description": "Official body providing guidance on GDPR and data protection. (Free)",
        "url": "https://edpb.europa.eu/"
    },
    {
        "type": "reddit",
        "title": "r/compliance",
        "description": "Community for regulatory and corporate compliance discussions. (Free)",
        "url": "https://www.reddit.com/r/compliance/"
    },
    {
        "type": "reddit",
        "title": "r/legaladvice",
        "description": "General legal advice and compliance questions. (Free)",
        "url": "https://www.reddit.com/r/legaladvice/"
    },
    {
        "type": "discord",
        "title": "Compliance Professionals",
        "description": "Community for networking and sharing compliance knowledge. (Free)",
        "url": "https://discord.gg/compliance"
    },
    {
        "type": "discord",
        "title": "Legal Advice",
        "description": "Discord group for legal discussions and professional advice. (Free)",
        "url": "https://discord.gg/legaladvice"
    }
],
"product management": [
    {
        "type": "youtube",
        "title": "Product School",
        "description": "Training and talks on product management principles, tools, and career advice. (Free and Paid content)",
        "url": "https://www.youtube.com/c/ProductSchool"
    },
    {
        "type": "youtube",
        "title": "Mind the Product",
        "description": "Interviews, conferences, and tutorials related to product management. (Free)",
        "url": "https://www.youtube.com/c/MindTheProduct"
    },
    {
        "type": "youtube",
        "title": "This is Product Management",
        "description": "Insights and lessons from product leaders on challenges and best practices. (Free)",
        "url": "https://www.youtube.com/c/ThisIsProductManagement"
    },
    {
        "type": "youtube",
        "title": "Roman Pichler",
        "description": "Expert tutorials on Agile product management and roadmapping. (Free)",
        "url": "https://www.youtube.com/user/romanpichler"
    },
    {
        "type": "youtube",
        "title": "SVPG (Silicon Valley Product Group)",
        "description": "Thought leadership videos on product strategy and management. (Free)",
        "url": "https://www.youtube.com/c/SiliconValleyProductGroup"
    },
    {
        "type": "book",
        "title": "Inspired: How To Create Products Customers Love",
        "author": "Marty Cagan",
        "description": "Classic guide on building great tech products with strong PM practices. (Paid)",
        "url": "https://www.amazon.com/Inspired-Create-Products-Customers-Love/dp/1119387507"
    },
    {
        "type": "book",
        "title": "Lean Product and Lean Analytics",
        "author": "Ben Yoskovitz and Alistair Croll",
        "description": "Data-driven approaches to product development and growth. (Paid)",
        "url": "https://leananalyticsbook.com/"
    },
    {
        "type": "book",
        "title": "The Lean Startup",
        "author": "Eric Ries",
        "description": "Methodology for agile product development and validated learning. (Paid)",
        "url": "https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898"
    },
    {
        "type": "book",
        "title": "Sprint: How to Solve Big Problems and Test New Ideas",
        "author": "Jake Knapp",
        "description": "A step-by-step process for rapid product design and prototyping. (Paid)",
        "url": "https://www.amazon.com/Sprint-Solve-Problems-Test-Ideas/dp/150112174X"
    },
    {
        "type": "book",
        "title": "Hooked: How to Build Habit-Forming Products",
        "author": "Nir Eyal",
        "description": "Psychology behind creating engaging and addictive products. (Paid)",
        "url": "https://www.amazon.com/Hooked-How-Build-Habit-Forming-Products/dp/1591847788"
    },
    {
        "type": "course",
        "title": "Digital Product Management",
        "provider": "Coursera, University of Virginia",
        "description": "Fundamentals of managing products in digital environments. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/uva-darden-digital-product-management"
    },
    {
        "type": "course",
        "title": "Agile Product Management",
        "provider": "edX, University of Maryland",
        "description": "Agile approaches for product managers. Free with paid certificate.",
        "url": "https://www.edx.org/course/agile-product-management"
    },
    {
        "type": "course",
        "title": "Product Management 101",
        "provider": "Udemy",
        "description": "Beginner-friendly course introducing key PM concepts. (Paid)",
        "url": "https://www.udemy.com/course/product-management-101/"
    },
    {
        "type": "course",
        "title": "One Month Product Management",
        "provider": "OneMonth",
        "description": "Intensive product management course completed in 30 days. (Paid)",
        "url": "https://onemonth.com/courses/product-management"
    },
    {
        "type": "website",
        "title": "Mind the Product",
        "description": "News, events, articles, and training for product managers. (Free and Paid)",
        "url": "https://www.mindtheproduct.com/"
    },
    {
        "type": "website",
        "title": "Product Coalition",
        "description": "Wide collection of articles and resources from product community. (Free)",
        "url": "https://productcoalition.com/"
    },
    {
        "type": "website",
        "title": "ProductPlan Blog",
        "description": "Product roadmap and management tips. (Free)",
        "url": "https://www.productplan.com/blog/"
    },
    {
        "type": "reddit",
        "title": "r/productmanagement",
        "description": "Community discussions, advice, and resource sharing for product managers. (Free)",
        "url": "https://www.reddit.com/r/productmanagement/"
    },
    {
        "type": "reddit",
        "title": "r/startups",
        "description": "Startup product development and entrepreneurship discussions. (Free)",
        "url": "https://www.reddit.com/r/startups/"
    },
    {
        "type": "discord",
        "title": "Product School Community",
        "description": "Active Discord for product management networking and learning. (Free)",
        "url": "https://discord.gg/productschool"
    },
    {
        "type": "discord",
        "title": "Product Coalition",
        "description": "Community for sharing product management insights and career advice. (Free)",
        "url": "https://discord.gg/productcoalition"
    }
],
"design": [
    {
        "type": "youtube",
        "title": "The Futur",
        "description": "Design theory, graphic design, UX/UI tutorials, and career advice. (Free and Paid content)",
        "url": "https://www.youtube.com/c/TheFutur"
    },
    {
        "type": "youtube",
        "title": "CharliMarieTV",
        "description": "UI/UX design tips, portfolio advice, and design process walkthroughs. (Free)",
        "url": "https://www.youtube.com/c/CharliMarieTV"
    },
    {
        "type": "youtube",
        "title": "Flux Academy",
        "description": "Freelance web design and UX/UI tutorials with practical projects. (Free and Paid)",
        "url": "https://www.youtube.com/c/FluxWithRanSegall"
    },
    {
        "type": "youtube",
        "title": "AJ&Smart",
        "description": "Design sprints and UX innovation techniques. (Free)",
        "url": "https://www.youtube.com/c/AJSmart"
    },
    {
        "type": "youtube",
        "title": "Satori Graphics",
        "description": "Graphic design tutorials covering Adobe software and design principles. (Free)",
        "url": "https://www.youtube.com/c/SatoriGraphics"
    },
    {
        "type": "book",
        "title": "Don't Make Me Think",
        "author": "Steve Krug",
        "description": "Classic book on web usability and user-centered design. (Paid)",
        "url": "https://www.amazon.com/Dont-Make-Think-Revisited-Usability/dp/0321965515"
    },
    {
        "type": "book",
        "title": "The Design of Everyday Things",
        "author": "Don Norman",
        "description": "Fundamental concepts in human-centered design and usability. (Paid)",
        "url": "https://www.amazon.com/Design-Everyday-Things-Revised-Expanded/dp/0465050654"
    },
    {
        "type": "book",
        "title": "Sprint",
        "author": "Jake Knapp",
        "description": "Process for solving big design and business challenges in five days. (Paid)",
        "url": "https://www.amazon.com/Sprint-Solve-Problems-Test-Ideas/dp/150112174X"
    },
    {
        "type": "book",
        "title": "About Face",
        "author": "Alan Cooper, Robert Reimann",
        "description": "Comprehensive guide to interaction design. (Paid)",
        "url": "https://www.amazon.com/About-Face-Essentials-Interaction-Design/dp/1118766571"
    },
    {
        "type": "book",
        "title": "Creative Confidence",
        "author": "Tom Kelley and David Kelley",
        "description": "Building creative skills and innovation in design. (Paid)",
        "url": "https://www.amazon.com/Creative-Confidence-Unleashing-Potential-Within/dp/038534936X"
    },
    {
        "type": "course",
        "title": "UI / UX Design Specialization",
        "provider": "Coursera, CalArts",
        "description": "Comprehensive course covering user interface and user experience design. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/specializations/ui-ux-design"
    },
    {
        "type": "course",
        "title": "Interaction Design Foundation",
        "provider": "Interaction Design Foundation",
        "description": "Wide range of UX and design courses. Paid membership with unlimited access.",
        "url": "https://www.interaction-design.org/"
    },
    {
        "type": "course",
        "title": "UX Design Fundamentals",
        "provider": "LinkedIn Learning",
        "description": "Basics of UX design principles and tools. Paid with free trial.",
        "url": "https://www.linkedin.com/learning/ux-fundamentals"
    },
    {
        "type": "course",
        "title": "Adobe XD Essentials",
        "provider": "Udemy",
        "description": "Hands-on course on using Adobe XD for UI/UX design. (Paid)",
        "url": "https://www.udemy.com/course/adobe-xd-web-design-essential-training/"
    },
    {
        "type": "website",
        "title": "Smashing Magazine",
        "description": "Articles and tutorials on web design, UX, and development. (Free and Paid)",
        "url": "https://www.smashingmagazine.com/"
    },
    {
        "type": "website",
        "title": "A List Apart",
        "description": "Design and development best practices with focus on UX. (Free)",
        "url": "https://alistapart.com/"
    },
    {
        "type": "website",
        "title": "Nielsen Norman Group",
        "description": "Research-based UX articles and reports. Some free, subscription for full access.",
        "url": "https://www.nngroup.com/"
    },
    {
        "type": "website",
        "title": "UX Design.cc",
        "description": "Curated articles, resources, and tutorials for UX designers. (Free)",
        "url": "https://uxdesign.cc/"
    },
    {
        "type": "reddit",
        "title": "r/userexperience",
        "description": "Community focused on UX design, research, and trends. (Free)",
        "url": "https://www.reddit.com/r/userexperience/"
    },
    {
        "type": "reddit",
        "title": "r/web_design",
        "description": "Discussions on web and UI design topics. (Free)",
        "url": "https://www.reddit.com/r/web_design/"
    },
    {
        "type": "reddit",
        "title": "r/graphic_design",
        "description": "Community for graphic designers, critiques, and inspiration. (Free)",
        "url": "https://www.reddit.com/r/graphic_design/"
    },
    {
        "type": "discord",
        "title": "Designership",
        "description": "Active Discord community for designers of all disciplines. (Free)",
        "url": "https://discord.gg/designership"
    },
    {
        "type": "discord",
        "title": "UX Mastery",
        "description": "Focuses on user experience design and career growth. (Free)",
        "url": "https://discord.gg/uxmastery"
    },
    {
        "type": "discord",
        "title": "Designer Hangout",
        "description": "Professional UX design community. (Free)",
        "url": "https://discord.gg/designerhangout"
    }
],
"information technology": [
    {
        "type": "youtube",
        "title": "NetworkChuck",
        "description": "IT networking, cybersecurity, and cloud computing tutorials. (Free)",
        "url": "https://www.youtube.com/c/NetworkChuck"
    },
    {
        "type": "youtube",
        "title": "Eli the Computer Guy",
        "description": "Comprehensive IT tutorials covering networking, security, and systems administration. (Free)",
        "url": "https://www.youtube.com/user/elithecomputerguy"
    },
    {
        "type": "youtube",
        "title": "Professor Messer",
        "description": "Study material and tutorials for CompTIA certifications including A+, Network+, Security+. (Free)",
        "url": "https://www.youtube.com/user/professormesser"
    },
    {
        "type": "youtube",
        "title": "David Bombal",
        "description": "Cisco networking tutorials and certification training. (Free and Paid)",
        "url": "https://www.youtube.com/user/davidbombal"
    },
    {
        "type": "youtube",
        "title": "CBT Nuggets",
        "description": "IT training videos for certifications and technology fundamentals. (Paid with Free Trial)",
        "url": "https://www.youtube.com/user/cbtnuggets"
    },
    {
        "type": "book",
        "title": "CompTIA A+ Certification All-in-One Exam Guide",
        "author": "Mike Meyers",
        "description": "Comprehensive preparation for IT technician certification. (Paid)",
        "url": "https://www.amazon.com/CompTIA-Certification-All-One-Guide/dp/1260454037"
    },
    {
        "type": "book",
        "title": "Networking All-in-One For Dummies",
        "author": "Doug Lowe",
        "description": "Foundational book on networking concepts and practices. (Paid)",
        "url": "https://www.amazon.com/Networking-All-One-Dummies-Computer/dp/1119471604"
    },
    {
        "type": "book",
        "title": "Windows Server 2019 & PowerShell All-in-One For Dummies",
        "author": "Sara Perrott",
        "description": "Guide to Windows Server and automation with PowerShell. (Paid)",
        "url": "https://www.amazon.com/Windows-Server-2019-PowerShell-Dummies/dp/1119557670"
    },
    {
        "type": "book",
        "title": "ITIL Foundation",
        "author": "Axelos",
        "description": "Guide to IT service management best practices and frameworks. (Paid)",
        "url": "https://www.axelos.com/store/book/itil-foundation-managing-professional-mp"
    },
    {
        "type": "book",
        "title": "Cloud Computing: Concepts, Technology & Architecture",
        "author": "Thomas Erl",
        "description": "Comprehensive understanding of cloud IT architectures. (Paid)",
        "url": "https://www.amazon.com/Cloud-Computing-Concepts-Technology-Architecture/dp/0133387526"
    },
    {
        "type": "course",
        "title": "Google IT Support Professional Certificate",
        "provider": "Coursera",
        "description": "Entry-level IT job preparation covering troubleshooting and system administration. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/professional-certificates/google-it-support"
    },
    {
        "type": "course",
        "title": "Microsoft Certified: Azure Fundamentals",
        "provider": "Microsoft Learn",
        "description": "Introduction to cloud services and core Azure solutions. (Free and Paid exams)",
        "url": "https://learn.microsoft.com/en-us/certifications/azure-fundamentals/"
    },
    {
        "type": "course",
        "title": "CompTIA Network+ Certification",
        "provider": "Udemy",
        "description": "Networking concepts and exam preparation course. (Paid)",
        "url": "https://www.udemy.com/course/comptia-network-cert-n10-008-the-total-course/"
    },
    {
        "type": "course",
        "title": "Introduction to Cyber Security Specialization",
        "provider": "Coursera, NYU",
        "description": "Basic cybersecurity concepts relevant to IT professionals. Free audit, paid certificate.",
        "url": "https://www.coursera.org/specializations/intro-cyber-security"
    },
    {
        "type": "website",
        "title": "Cisco Networking Academy",
        "description": "Free and paid courses on networking, security, and IoT. (Free and Paid)",
        "url": "https://www.netacad.com/"
    },
    {
        "type": "website",
        "title": "How-To Geek",
        "description": "Technical tutorials and IT guides for professionals and beginners. (Free)",
        "url": "https://www.howtogeek.com/"
    },
    {
        "type": "website",
        "title": "Spiceworks Community",
        "description": "IT professional community for questions, discussions, and advice. (Free)",
        "url": "https://community.spiceworks.com/"
    },
    {
        "type": "website",
        "title": "TechRepublic",
        "description": "Technology news, IT tips, and best practices for IT professionals. (Free)",
        "url": "https://www.techrepublic.com/"
    },
    {
        "type": "reddit",
        "title": "r/sysadmin",
        "description": "Community for system administrators and IT professionals. (Free)",
        "url": "https://www.reddit.com/r/sysadmin/"
    },
    {
        "type": "reddit",
        "title": "r/ITCareerQuestions",
        "description": "Advice and discussion focused on IT career development. (Free)",
        "url": "https://www.reddit.com/r/ITCareerQuestions/"
    },
    {
        "type": "discord",
        "title": "IT Support",
        "description": "Discord server for IT support professionals and learners. (Free)",
        "url": "https://discord.gg/itsupport"
    },
    {
        "type": "discord",
        "title": "SysAdmin Network",
        "description": "Community for sysadmins with resources and discussion. (Free)",
        "url": "https://discord.gg/sysadminnetwork"
    }
],
"healthcare": [
    {
        "type": "youtube",
        "title": "Armando Hasudungan",
        "description": "Detailed medical tutorials on anatomy, physiology, and pathology. (Free)",
        "url": "https://www.youtube.com/c/ArmandoHasudungan"
    },
    {
        "type": "youtube",
        "title": "MedCram",
        "description": "Medical lectures and updates on healthcare topics, including COVID-19. (Free)",
        "url": "https://www.youtube.com/c/MEDCRAMvideos"
    },
    {
        "type": "youtube",
        "title": "Healthcare Triage",
        "description": "Evidence-based healthcare information and policy explanations. (Free)",
        "url": "https://www.youtube.com/c/HealthcareTriage"
    },
    {
        "type": "youtube",
        "title": "Nursing.com",
        "description": "Study resources and tutorials for nursing professionals. (Free and Paid)",
        "url": "https://www.youtube.com/c/Nursingdotcom"
    },
    {
        "type": "youtube",
        "title": "Johns Hopkins Medicine",
        "description": "Expert healthcare lectures and informational videos. (Free)",
        "url": "https://www.youtube.com/user/JohnsHopkinsMedicine"
    },
    {
        "type": "book",
        "title": "Current Medical Diagnosis and Treatment",
        "author": "Maxine A. Papadakis et al.",
        "description": "Comprehensive reference book on diagnosis and treatment. (Paid)",
        "url": "https://www.mhprofessional.com/9781264269385-usa-current-medical-diagnosis-and-treatment-2025"
    },
    {
        "type": "book",
        "title": "Bates' Guide to Physical Examination and History Taking",
        "author": "Lynn Bickley",
        "description": "Essential physical exam guide for healthcare providers. (Paid)",
        "url": "https://www.amazon.com/Bates-Guide-Physical-Examination-History/dp/149638938X"
    },
    {
        "type": "book",
        "title": "Essentials of Family Medicine",
        "author": "Philip D. Sloane et al.",
        "description": "Overview of family medicine and primary healthcare. (Paid)",
        "url": "https://www.amazon.com/Essentials-Family-Medicine-Philip-Sloane/dp/1975145905"
    },
    {
        "type": "book",
        "title": "Robbins & Cotran Pathologic Basis of Disease",
        "author": "Vinay Kumar et al.",
        "description": "Authoritative pathology textbook. (Paid)",
        "url": "https://www.elsevier.com/books/robbins-and-cotran-pathologic-basis-of-disease/kumar/978-0-323-53113-9"
    },
    {
        "type": "book",
        "title": "Pharmacology Made Ridiculously Simple",
        "author": "James Olson",
        "description": "Concise pharmacology review for healthcare practitioners. (Paid)",
        "url": "https://www.amazon.com/Pharmacology-Made-Ridiculously-Simple-Olson/dp/0940780905"
    },
    {
        "type": "course",
        "title": "Introduction to Global Health",
        "provider": "Coursera, University of Copenhagen",
        "description": "Global healthcare challenges and systems. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/global-health"
    },
    {
        "type": "course",
        "title": "Essentials of Patient Safety",
        "provider": "edX, Johns Hopkins",
        "description": "Healthcare quality and patient safety practices. Free with paid certificate.",
        "url": "https://www.edx.org/course/essentials-of-patient-safety"
    },
    {
        "type": "course",
        "title": "Healthcare IT Support",
        "provider": "Google via Coursera",
        "description": "Training on IT applied in healthcare settings. Free audit, paid cert.",
        "url": "https://www.coursera.org/professional-certificates/google-it-automation"
    },
    {
        "type": "course",
        "title": "Nursing Informatics",
        "provider": "Udemy",
        "description": "Courses on technology and data in nursing. (Paid)",
        "url": "https://www.udemy.com/course/nursing-informatics/"
    },
    {
        "type": "website",
        "title": "CDC",
        "description": "Official health information and guidelines from the Centers for Disease Control. (Free)",
        "url": "https://www.cdc.gov/"
    },
    {
        "type": "website",
        "title": "Medscape",
        "description": "Latest clinical updates, news, and continuing education for healthcare providers. (Free)",
        "url": "https://www.medscape.com/"
    },
    {
        "type": "website",
        "title": "World Health Organization",
        "description": "International health topics, news, and resources. (Free)",
        "url": "https://www.who.int/"
    },
    {
        "type": "website",
        "title": "Nursing Times",
        "description": "Nursing news, articles, and study resources. (Free and Paid)",
        "url": "https://www.nursingtimes.net/"
    },
    {
        "type": "website",
        "title": "UpToDate",
        "description": "Clinical decision support and medical content. Subscription required.",
        "url": "https://www.uptodate.com/"
    },
    {
        "type": "reddit",
        "title": "r/medicine",
        "description": "Community for medical professionals and enthusiasts. (Free)",
        "url": "https://www.reddit.com/r/medicine/"
    },
    {
        "type": "reddit",
        "title": "r/nursing",
        "description": "Nursing professionals and students community. (Free)",
        "url": "https://www.reddit.com/r/nursing/"
    },
    {
        "type": "reddit",
        "title": "r/healthcare",
        "description": "Discussions on healthcare systems, policy, and news. (Free)",
        "url": "https://www.reddit.com/r/healthcare/"
    },
    {
        "type": "discord",
        "title": "Medical Students Community",
        "description": "Discord for healthcare students and professionals. (Free)",
        "url": "https://discord.gg/medicalstudents"
    },
    {
        "type": "discord",
        "title": "Health Professionals",
        "description": "Community for knowledge sharing and support in healthcare. (Free)",
        "url": "https://discord.gg/healthpros"
    }
],
"environmental sustainability": [
    {
        "type": "youtube",
        "title": "Our Changing Climate",
        "description": "In-depth analysis on climate change and sustainability issues. (Free)",
        "url": "https://www.youtube.com/c/OurChangingClimate"
    },
    {
        "type": "youtube",
        "title": "Climate Adam",
        "description": "Educational videos explaining climate science and solutions. (Free)",
        "url": "https://www.youtube.com/c/ClimateAdam"
    },
    {
        "type": "youtube",
        "title": "Sustainability Illustrated",
        "description": "Animated explainers on sustainability challenges and innovations. (Free)",
        "url": "https://www.youtube.com/c/SustainabilityIllustrated"
    },
    {
        "type": "youtube",
        "title": "Just Have a Think",
        "description": "Deep dive into renewable energy and sustainable technologies. (Free)",
        "url": "https://www.youtube.com/c/JustHaveaThink"
    },
    {
        "type": "youtube",
        "title": "TED Talks Environment",
        "description": "Inspiring talks on environment and sustainability topics. (Free)",
        "url": "https://www.youtube.com/playlist?list=PLsRNoUx8w3rN1bHu9UGwhwPXmu2Qs3ytB"
    },
    {
        "type": "book",
        "title": "Silent Spring",
        "author": "Rachel Carson",
        "description": "Pioneering book that raised awareness about environmental pollution. (Paid)",
        "url": "https://www.amazon.com/Silent-Spring-Rachel-Carson/dp/0618249060"
    },
    {
        "type": "book",
        "title": "This Changes Everything",
        "author": "Naomi Klein",
        "description": "Examines the political and economic aspects of climate change. (Paid)",
        "url": "https://www.amazon.com/This-Changes-Everything-Capitalism-Climate/dp/1451697392"
    },
    {
        "type": "book",
        "title": "Cradle to Cradle",
        "author": "William McDonough and Michael Braungart",
        "description": "Design principles for a sustainable, waste-free economy. (Paid)",
        "url": "https://www.amazon.com/Cradle-McDonough-William-Braungart-Michael/dp/0865475873"
    },
    {
        "type": "book",
        "title": "Drawdown",
        "author": "Paul Hawken",
        "description": "Comprehensive review of climate solutions to reverse global warming. (Paid)",
        "url": "https://www.amazon.com/Drawdown-Comprehensive-Plan-Reverse-Warming/dp/0143130447"
    },
    {
        "type": "book",
        "title": "The Uninhabitable Earth",
        "author": "David Wallace-Wells",
        "description": "A stark look at the potential future impacts of climate change. (Paid)",
        "url": "https://www.amazon.com/Uninhabitable-Earth-Life-After-Warming/dp/0525576703"
    },
    {
        "type": "course",
        "title": "Introduction to Sustainability",
        "provider": "Coursera, University of Illinois",
        "description": "Fundamentals of sustainability, environmental challenges, and solutions. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/sustainability"
    },
    {
        "type": "course",
        "title": "Climate Change: The Science",
        "provider": "edX, University of British Columbia",
        "description": "Climate science fundamentals and evidence-based research. Free with paid certificate.",
        "url": "https://www.edx.org/course/climate-change-the-science"
    },
    {
        "type": "course",
        "title": "Sustainable Development: The Post-Capitalist Order",
        "provider": "Udemy",
        "description": "Explores sustainable development goals and economic transformation. (Paid)",
        "url": "https://www.udemy.com/course/sustainable-development-post-capitalist-order/"
    },
    {
        "type": "course",
        "title": "Circular Economy - Sustainable Materials Management",
        "provider": "LinkedIn Learning",
        "description": "Principles of circular economy and waste reduction. Paid with free trial.",
        "url": "https://www.linkedin.com/learning/circular-economy-sustainable-materials-management"
    },
    {
        "type": "website",
        "title": "United Nations Sustainable Development",
        "description": "Official info and goals on global sustainability initiatives. (Free)",
        "url": "https://sdgs.un.org/goals"
    },
    {
        "type": "website",
        "title": "Environmental Protection Agency (EPA)",
        "description": "Resources on environmental regulations and sustainability programs. (Free)",
        "url": "https://www.epa.gov/"
    },
    {
        "type": "website",
        "title": "Global Footprint Network",
        "description": "Data and insights on ecological footprint and sustainability metrics. (Free)",
        "url": "https://www.footprintnetwork.org/"
    },
    {
        "type": "website",
        "title": "World Resources Institute",
        "description": "Research and solutions for sustainability and climate challenges. (Free)",
        "url": "https://www.wri.org/"
    },
    {
        "type": "reddit",
        "title": "r/sustainability",
        "description": "Discussions around sustainable living and innovations. (Free)",
        "url": "https://www.reddit.com/r/sustainability/"
    },
    {
        "type": "reddit",
        "title": "r/climate",
        "description": "Community focused on climate change news and science. (Free)",
        "url": "https://www.reddit.com/r/climate/"
    },
    {
        "type": "discord",
        "title": "Climate Change",
        "description": "Discussion and collaboration on climate action and sustainability. (Free)",
        "url": "https://discord.gg/climate"
    },
    {
        "type": "discord",
        "title": "Sustainability Network",
        "description": "Community sharing knowledge and projects on sustainability. (Free)",
        "url": "https://discord.gg/sustainability"
    }
],
"marketing": [
    {
        "type": "youtube",
        "title": "Neil Patel",
        "description": "Digital and content marketing strategies, SEO, and growth hacks. (Free)",
        "url": "https://www.youtube.com/user/neilvkpatel"
    },
    {
        "type": "youtube",
        "title": "Marketing 360",
        "description": "Comprehensive tutorials on digital marketing, social media, and advertising. (Free)",
        "url": "https://www.youtube.com/c/Marketing360"
    },
    {
        "type": "youtube",
        "title": "HubSpot",
        "description": "Inbound marketing, sales, and CRM tutorials from HubSpot pros. (Free)",
        "url": "https://www.youtube.com/user/HubSpot"
    },
    {
        "type": "youtube",
        "title": "GaryVee",
        "description": "Entrepreneurship, marketing, and social media insights. (Free)",
        "url": "https://www.youtube.com/c/GaryVaynerchuk"
    },
    {
        "type": "youtube",
        "title": "Social Media Examiner",
        "description": "Tips and trends for social media marketing. (Free)",
        "url": "https://www.youtube.com/user/socialmediaexaminer"
    },
    {
        "type": "book",
        "title": "Made to Stick",
        "author": "Chip Heath & Dan Heath",
        "description": "Principles of creating memorable marketing messages. (Paid)",
        "url": "https://www.amazon.com/Made-Stick-Why-Some-Ideas/dp/1400064287"
    },
    {
        "type": "book",
        "title": "Influence: The Psychology of Persuasion",
        "author": "Robert B. Cialdini",
        "description": "Classic on persuasion techniques in marketing. (Paid)",
        "url": "https://www.amazon.com/Influence-Psychology-Persuasion-Robert-Cialdini/dp/006124189X"
    },
    {
        "type": "book",
        "title": "Content Inc.",
        "author": "Joe Pulizzi",
        "description": "Building audiences and marketing through content strategy. (Paid)",
        "url": "https://www.amazon.com/Content-Inc-Entrepreneurs-Influencers-Founders/dp/125958965X"
    },
    {
        "type": "book",
        "title": "This Is Marketing",
        "author": "Seth Godin",
        "description": "Marketing with empathy and connection. (Paid)",
        "url": "https://www.amazon.com/This-Marketing-You-Can-t-Ignore/dp/0525540830"
    },
    {
        "type": "course",
        "title": "Fundamentals of Digital Marketing",
        "provider": "Google Digital Garage",
        "description": "Free digital marketing course with certification. (Free)",
        "url": "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing"
    },
    {
        "type": "course",
        "title": "Digital Marketing Specialization",
        "provider": "Coursera, University of Illinois",
        "description": "Comprehensive paid specialization on digital marketing. (Free to audit, paid certificate)",
        "url": "https://www.coursera.org/specializations/digital-marketing"
    },
    {
        "type": "course",
        "title": "Advanced Social Media Strategy",
        "provider": "LinkedIn Learning",
        "description": "Social media marketing tactics and analytics. Paid with free trial.",
        "url": "https://www.linkedin.com/learning/advanced-social-media-strategy"
    },
    {
        "type": "website",
        "title": "MarketingProfs",
        "description": "Expert marketing training, articles, and webinars. (Free and Paid)",
        "url": "https://www.marketingprofs.com/"
    },
    {
        "type": "website",
        "title": "Content Marketing Institute",
        "description": "Resources on content strategy and marketing trends. (Free)",
        "url": "https://contentmarketinginstitute.com/"
    },
    {
        "type": "reddit",
        "title": "r/marketing",
        "description": "Community for marketing discussions and tips. (Free)",
        "url": "https://www.reddit.com/r/marketing/"
    },
    {
        "type": "reddit",
        "title": "r/socialmedia",
        "description": "Social media marketing and trends community. (Free)",
        "url": "https://www.reddit.com/r/socialmedia/"
    },
    {
        "type": "discord",
        "title": "Digital Marketing",
        "description": "Active Discord community for digital marketing professionals. (Free)",
        "url": "https://discord.gg/digitalmarketing"
    }
],
"logistics and supply chain": [
    {
        "type": "youtube",
        "title": "Supply Chain Secrets",
        "description": "Detailed videos on supply chain and logistics management. (Free)",
        "url": "https://www.youtube.com/c/SupplyChainSecrets"
    },
    {
        "type": "youtube",
        "title": "Logistics Bureau",
        "description": "Tips and strategies on logistics operation and optimization. (Free)",
        "url": "https://www.youtube.com/user/logisticsbureau"
    },
    {
        "type": "youtube",
        "title": "SCM DOJO",
        "description": "Supply chain management tutorials and career guidance. (Free)",
        "url": "https://www.youtube.com/c/SCMDOJO"
    },
    {
        "type": "youtube",
        "title": "MIT Supply Chain",
        "description": "Research and lectures on supply chain and logistics topics. (Free)",
        "url": "https://www.youtube.com/user/MITSupplyChain"
    },
    {
        "type": "youtube",
        "title": "Supply Chain Management Review",
        "description": "Industry news, discussions, and expert insights. (Free)",
        "url": "https://www.youtube.com/c/SupplyChainManagementReview"
    },
    {
        "type": "book",
        "title": "Supply Chain Management: Strategy, Planning, and Operation",
        "author": "Sunil Chopra",
        "description": "Comprehensive textbook on supply chain concepts and strategy. (Paid)",
        "url": "https://www.amazon.com/Supply-Chain-Management-Strategy-Planning/dp/0133800202"
    },
    {
        "type": "book",
        "title": "Logistics Management and Strategy",
        "author": "Alan Harrison and Remko Van Hoek",
        "description": "Strategic approaches to logistics. (Paid)",
        "url": "https://www.amazon.com/Logistics-Management-Strategy-Alan-Harrison/dp/0273752710"
    },
    {
        "type": "book",
        "title": "The Goal",
        "author": "Eliyahu M. Goldratt",
        "description": "Classic business novel explaining constraints and throughput concepts. (Paid)",
        "url": "https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951"
    },
    {
        "type": "book",
        "title": "Introduction to Operations and Supply Chain Management",
        "author": "M. Bixby Cooper",
        "description": "Textbook for operational logistics and supply chains. (Paid)",
        "url": "https://www.amazon.com/Introduction-Operations-Supply-Chain-Management/dp/1506395400"
    },
    {
        "type": "book",
        "title": "Logistics & Supply Chain Management",
        "author": "Martin Christopher",
        "description": "Core concepts in logistics and supply chain. (Paid)",
        "url": "https://www.amazon.com/Logistics-Supply-Chain-Management-Martin/dp/1292083798"
    },
    {
        "type": "course",
        "title": "Supply Chain Fundamentals",
        "provider": "edX, MIT",
        "description": "Basic principles of supply chain management. Free with paid certificate.",
        "url": "https://www.edx.org/course/supply-chain-management"
    },
    {
        "type": "course",
        "title": "Supply Chain Analytics",
        "provider": "Coursera, Rutgers",
        "description": "Data-driven approaches to optimizing supply chains. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/supply-chain-analytics"
    },
    {
        "type": "course",
        "title": "Logistics Management",
        "provider": "Udemy",
        "description": "Operational logistics and transportation management. (Paid)",
        "url": "https://www.udemy.com/course/logistics-management/"
    },
    {
        "type": "website",
        "title": "SupplyChainDive",
        "description": "News and analysis on supply chain trends and challenges. (Free)",
        "url": "https://www.supplychaindive.com/"
    },
    {
        "type": "website",
        "title": "CSCMP",
        "description": "Council of Supply Chain Management Professionals with resources and education. (Paid membership)",
        "url": "https://cscmp.org/"
    },
    {
        "type": "website",
        "title": "Logistics Management",
        "description": "Industry news, best practices, and insights for logistics. (Free)",
        "url": "https://www.logisticsmgmt.com/"
    },
    {
        "type": "website",
        "title": "Inbound Logistics",
        "description": "Resources and information on transportation and supply chain. (Free)",
        "url": "https://www.inboundlogistics.com/"
    },
    {
        "type": "reddit",
        "title": "r/supplychain",
        "description": "Community discussing supply chain management topics. (Free)",
        "url": "https://www.reddit.com/r/supplychain/"
    },
    {
        "type": "reddit",
        "title": "r/logistics",
        "description": "Logistics industry news and discussion. (Free)",
        "url": "https://www.reddit.com/r/logistics/"
    },
    {
        "type": "discord",
        "title": "Logistics & Supply Chain",
        "description": "Community for professionals discussing supply chain and logistics. (Free)",
        "url": "https://discord.gg/logistics"
    },
    {
        "type": "discord",
        "title": "Supply Chain Experts",
        "description": "Platform for supply chain knowledge exchange. (Free)",
        "url": "https://discord.gg/supplychainexperts"
    }
],
"legal services": [
    {
        "type": "youtube",
        "title": "LegalEagle",
        "description": "Explains legal concepts, court cases, and compliance topics clearly. (Free)",
        "url": "https://www.youtube.com/c/LegalEagle"
    },
    {
        "type": "youtube",
        "title": "LawByMike",
        "description": "Simple explanations of complex legal subjects and case laws. (Free)",
        "url": "https://www.youtube.com/c/LawByMike"
    },
    {
        "type": "youtube",
        "title": "The Law Simplified",
        "description": "Concise videos on legal principles and services. (Free)",
        "url": "https://www.youtube.com/c/TheLawSimplified"
    },
    {
        "type": "youtube",
        "title": "The Legal Genealogist",
        "description": "Explains legal history and research best practices. (Free)",
        "url": "https://www.youtube.com/c/LegalGenealogist"
    },
    {
        "type": "youtube",
        "title": "ABA Law Practice Division",
        "description": "American Bar Association resources on legal practice and ethics. (Free)",
        "url": "https://www.youtube.com/user/ABALawPracDiv"
    },
    {
        "type": "book",
        "title": "Law 101",
        "author": "Jay M. Feinman",
        "description": "Introduction to the American legal system. (Paid)",
        "url": "https://www.amazon.com/Law-101-Everything-American-System/dp/0190646639"
    },
    {
        "type": "book",
        "title": "Black's Law Dictionary",
        "author": "Bryan A. Garner",
        "description": "Essential legal dictionary used in U.S. legal practice. (Paid)",
        "url": "https://www.amazon.com/Blacks-Law-Dictionary-Standard-Edition/dp/1539229753"
    },
    {
        "type": "book",
        "title": "The Essentials of Legal Writing",
        "author": "Lisa A. Kloppenberg",
        "description": "Guide on legal writing and analysis. (Paid)",
        "url": "https://www.amazon.com/Essentials-Legal-Writing-Lisa-Kloppenberg/dp/1454871630"
    },
    {
        "type": "book",
        "title": "Legal Services Corporation (LSC) Handbook",
        "author": "Legal Services Corporation",
        "description": "Resource guide for providing legal aid services. (Free)",
        "url": "https://www.lsc.gov/resources/handbook"
    },
    {
        "type": "book",
        "title": "Legal Ethics",
        "author": "Richard A. Zitrin and Carol M. Langford",
        "description": "Comprehensive guide to professional responsibility. (Paid)",
        "url": "https://www.amazon.com/Legal-Ethics-Professional-Responsibility-Zitrin/dp/1642429834"
    },
    {
        "type": "course",
        "title": "Introduction to American Law",
        "provider": "Coursera, University of Pennsylvania",
        "description": "Overview of U.S. legal system fundamentals. Free audit, paid certificate.",
        "url": "https://www.coursera.org/learn/american-law"
    },
    {
        "type": "course",
        "title": "Corporate & Commercial Law I: Contracts & Employment Law",
        "provider": "Coursera, University of Illinois",
        "description": "Legal principles applicable in business contexts. Free to audit, paid certificate.",
        "url": "https://www.coursera.org/learn/corporate-commercial-law-1"
    },
    {
        "type": "course",
        "title": "Understanding International Law",
        "provider": "edX, Université catholique de Louvain",
        "description": "Foundations of international legal systems. Free with paid certificate.",
        "url": "https://www.edx.org/course/understanding-international-law"
    },
    {
        "type": "website",
        "title": "Legal Information Institute (LII)",
        "description": "Free access to U.S. legal materials and explanations. (Free)",
        "url": "https://www.law.cornell.edu/"
    },
    {
        "type": "website",
        "title": "American Bar Association",
        "description": "Legal resources, ethics guidance, and practice tools. (Free and Paid)",
        "url": "https://www.americanbar.org/"
    },
    {
        "type": "website",
        "title": "FindLaw",
        "description": "Legal information and lawyer directory. (Free)",
        "url": "https://www.findlaw.com/"
    },
    {
        "type": "reddit",
        "title": "r/legaladvice",
        "description": "Community offering legal guidance and help. (Free)",
        "url": "https://www.reddit.com/r/legaladvice/"
    },
    {
        "type": "reddit",
        "title": "r/Law",
        "description": "General legal discussions and resources. (Free)",
        "url": "https://www.reddit.com/r/Law/"
    },
    {
        "type": "discord",
        "title": "Legal Advice",
        "description": "Discord channel for legal questions and discussions. (Free)",
        "url": "https://discord.gg/legaladvice"
    },
    {
        "type": "discord",
        "title": "Law Students & Legal Professionals",
        "description": "Community for law students and legal practitioners. (Free)",
        "url": "https://discord.gg/law"
    }
],
"jee": [
    {
        "type": "youtube",
        "title": "Physics Wallah - Alakh Pandey",
        "description": "Comprehensive JEE physics & chemistry courses with conceptual clarity and problem-solving focus. (Free and Paid)",
        "url": "https://www.youtube.com/c/PhysicsWallah"
    },
    {
        "type": "youtube",
        "title": "Unacademy JEE",
        "description": "Live classes and recorded lectures focused on JEE preparation for all subjects. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyJEE"
    },
    {
        "type": "youtube",
        "title": "Aakash Digital",
        "description": "Exam-focused tutorials and strategies for JEE and other competitive exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/AakashDigital"
    },
    {
        "type": "youtube",
        "title": "Allen Kota",
        "description": "Well-structured lectures and solved problems for JEE preparation. (Free and Paid)",
        "url": "https://www.youtube.com/c/AllenKotaOfficial"
    },
    {
        "type": "youtube",
        "title": "Vedantu JEE",
        "description": "Live and recorded sessions for JEE concepts and practice. (Free and Paid)",
        "url": "https://www.youtube.com/c/VedantuJEE"
    },
    {
        "type": "book",
        "title": "Concepts of Physics by H.C. Verma",
        "author": "H.C. Verma",
        "description": "Extensively used classic book focusing on JEE physics concepts and problem-solving. (Paid)",
        "url": "https://www.amazon.in/Concepts-Physics-Part-Vol-1/dp/8177091874"
    },
    {
        "type": "book",
        "title": "Physical Chemistry by O.P. Tandon",
        "author": "O.P. Tandon",
        "description": "Detailed and exam-relevant book for JEE physical chemistry. (Paid)",
        "url": "https://www.amazon.in/Physical-Chemistry-OP-Tandon/dp/0199450148"
    },
    {
        "type": "book",
        "title": "Mathematics for JEE Advanced",
        "author": "R.D. Sharma",
        "description": "Comprehensive JEE mathematics guide with practice problems. (Paid)",
        "url": "https://www.amazon.in/Mathematics-Complete-R-D-Sharma/dp/8177091858"
    },
    {
        "type": "book",
        "title": "Objective Chemistry by O.P. Tandon",
        "author": "O.P. Tandon",
        "description": "Objective-style question bank for JEE chemistry practice. (Paid)",
        "url": "https://www.amazon.in/Objective-Chemistry-OP-Tandon/dp/0199450156"
    },
    {
        "type": "book",
        "title": "Organic Chemistry by Morrison & Boyd",
        "author": "Robert Thornton Morrison and Robert Neilson Boyd",
        "description": "Renowned textbook for organic chemistry concepts. (Paid)",
        "url": "https://www.amazon.in/Organic-Chemistry-R-T-Morrison/dp/0134083417"
    },
    {
        "type": "course",
        "title": "Unacademy JEE Crash Course",
        "provider": "Unacademy",
        "description": "Exam-oriented crash course for rapid revision and problem solving. (Free and Paid)",
        "url": "https://unacademy.com/course/jee-main-crash-course/WJJLX7KB"
    },
    {
        "type": "course",
        "title": "Vedantu JEE Masterclass",
        "provider": "Vedantu",
        "description": "Focused live online sessions to boost JEE preparation. (Paid)",
        "url": "https://www.vedantu.com/jee"
    },
    {
        "type": "course",
        "title": "Resonance JEE Online Course",
        "provider": "Resonance",
        "description": "Online coaching classes for JEE aspirants with study materials. (Paid)",
        "url": "https://resonance.ac.in/"
    },
    {
        "type": "website",
        "title": "Embibe.com",
        "description": "AI-powered JEE preparation platform offering tests, analytics, and resources. (Free and Paid)",
        "url": "https://www.embibe.com/"
    },
    {
        "type": "website",
        "title": "Toppr",
        "description": "Personalized learning and practice for JEE and other exams. (Free and Paid)",
        "url": "https://www.toppr.com/"
    },
    {
        "type": "website",
        "title": "Byju’s JEE",
        "description": "Interactive learning modules and online coaching for JEE. (Paid)",
        "url": "https://byjus.com/jee/"
    }
],
"neet": [
    {
        "type": "youtube",
        "title": "Physics Wallah - Alakh Pandey",
        "description": "In-depth NEET focused Physics, Chemistry and Biology lectures. (Free and Paid)",
        "url": "https://www.youtube.com/c/PhysicsWallah"
    },
    {
        "type": "youtube",
        "title": "Aakash Digital",
        "description": "NEET coaching classes, question solutions, and preparation strategies. (Free and Paid)",
        "url": "https://www.youtube.com/c/AakashDigital"
    },
    {
        "type": "youtube",
        "title": "Unacademy NEET",
        "description": "Classroom lectures and expert advice for NEET aspirants. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyNEET"
    },
    {
        "type": "youtube",
        "title": "Etoos Education",
        "description": "NEET practice questions and chapter-wise explanations. (Paid)",
        "url": "https://www.youtube.com/c/EtoosEducation"
    },
    {
        "type": "youtube",
        "title": "Vedantu NEET",
        "description": "Live and recorded NEET preparation classes. (Free and Paid)",
        "url": "https://www.youtube.com/c/VedantuNEET"
    },
    {
        "type": "book",
        "title": "NCERT Biology Textbooks (Class 11 & 12)",
        "author": "NCERT",
        "description": "Standard biology textbooks for NEET preparation. (Free and Paid print)",
        "url": "https://ncert.nic.in/textbook.php"
    },
    {
        "type": "book",
        "title": "Objective Physics for NEET",
        "author": "DC Pandey",
        "description": "Comprehensive objective questions with solutions. (Paid)",
        "url": "https://www.amazon.in/Objective-Physics-Neet-D-C-Pandey/dp/9352602201"
    },
    {
        "type": "book",
        "title": "Modern's ABC of Chemistry for Class 11 & 12",
        "author": "S.P. Jauhari",
        "description": "Detailed chemistry concepts for NEET aspirants. (Paid)",
        "url": "https://www.amazon.in/Moderns-ABCs-Chemistry-Class/dp/9385531283"
    },
    {
        "type": "book",
        "title": "MTG NEET Champion Biology",
        "author": "MTG Editorial Board",
        "description": "Extensive biology practice and revision guide. (Paid)",
        "url": "https://www.amazon.in/MTG-NEET-Champion-Biology-Vol/dp/9386794407"
    },
    {
        "type": "book",
        "title": "Trueman’s Biology Vol 1 & 2",
        "author": "Delhi Trueman's Editorial",
        "description": "Popular biology guide for NEET aspirants. (Paid)",
        "url": "https://www.amazon.in/Truemans-Biology-Vol-Edition-2025/dp/B09QX2WP7F"
    },
    {
        "type": "course",
        "title": "Unacademy NEET Foundation Course",
        "provider": "Unacademy",
        "description": "Structured NEET preparation with live classes. (Free and Paid)",
        "url": "https://unacademy.com/course/neet-foundation-course/P8WOL03D"
    },
    {
        "type": "course",
        "title": "Aakash Institute NEET Online Coaching",
        "provider": "Aakash Education",
        "description": "Exam-oriented NEET online classes and test series. (Paid)",
        "url": "https://www.aakash.ac.in/online-classes-mobile-apps/neet-online-coaching"
    },
    {
        "type": "course",
        "title": "Embibe NEET Preparation",
        "provider": "Embibe",
        "description": "AI-driven NEET test prep, analytics, and coaching. (Free and Paid)",
        "url": "https://www.embibe.com/neet/"
    },
    {
        "type": "website",
        "title": "NTA NEET Official Site",
        "description": "Official exam notifications, syllabus, and practice tests. (Free)",
        "url": "https://nta.ac.in/neet"
    },
    {
        "type": "website",
        "title": "NEET Prep",
        "description": "Platform with study materials and mock tests for NEET. (Free and Paid)",
        "url": "https://www.neetprep.com/"
    }
],
"cat": [
    {
        "type": "youtube",
        "title": "Handa Ka Funda",
        "description": "Quantitative aptitude, verbal ability, and reasoning tutorials focused on CAT. (Free and Paid)",
        "url": "https://www.youtube.com/c/HandaKaFunda"
    },
    {
        "type": "youtube",
        "title": "2IIM CAT",
        "description": "Detailed strategy and concept videos for CAT and MBA entrance exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/2IIMCAT"
    },
    {
        "type": "youtube",
        "title": "Hitbullseye CAT",
        "description": "Mock tests, preparation tips, and solved problems for CAT aspirants. (Free and Paid)",
        "url": "https://www.youtube.com/c/HitbullseyeCAT"
    },
    {
        "type": "youtube",
        "title": "Takshzila Shikshak",
        "description": "Comprehensive CAT preparation videos covering all topics. (Free)",
        "url": "https://www.youtube.com/c/TakshzilaShikshak"
    },
    {
        "type": "youtube",
        "title": "Career Launcher",
        "description": "CAT strategy, sectional tips, and solved problems. (Free and Paid)",
        "url": "https://www.youtube.com/c/CareerLauncher"
    },
    {
        "type": "book",
        "title": "How to Prepare for Quantitative Aptitude for the CAT",
        "author": "Arun Sharma",
        "description": "Popular and comprehensive CAT quantitative preparation book. (Paid)",
        "url": "https://www.amazon.in/Prepare-Quantitative-Aptitude-CAT-Arun/dp/9352609717"
    },
    {
        "type": "book",
        "title": "Verbal Ability and Reading Comprehension for CAT",
        "author": "Arun Sharma and Meenakshi Upadhyay",
        "description": "Best-selling book for verbal preparation for CAT. (Paid)",
        "url": "https://www.amazon.in/Verbal-Ability-Reading-Comprehension-CAT/dp/9352609733"
    },
    {
        "type": "book",
        "title": "Logical Reasoning and Data Interpretation for CAT",
        "author": "Arun Sharma",
        "description": "Thorough practice and strategy book for LRDI. (Paid)",
        "url": "https://www.amazon.in/Logical-Reasoning-Data-Interpretation-CAT/dp/9352609725"
    },
    {
        "type": "book",
        "title": "Word Power Made Easy",
        "author": "Norman Lewis",
        "description": "Vocabulary building essential for CAT. (Paid)",
        "url": "https://www.amazon.in/Word-Power-Made-Easy/dp/0671728200"
    },
    {
        "type": "book",
        "title": "Quantitative Aptitude for Competitive Examinations",
        "author": "R.S. Aggarwal",
        "description": "Practice book for aptitude sections across exams including CAT. (Paid)",
        "url": "https://www.amazon.in/Quantitative-Aptitude-Competitive-Examinations-Aggarwal/dp/818679973X"
    },
    {
        "type": "course",
        "title": "Unacademy CAT Crash Course",
        "provider": "Unacademy",
        "description": "Exam-specific preparation course covering all CAT sections. (Free and Paid)",
        "url": "https://unacademy.com/course/cat-main-crash-course/UVGD2Q1V"
    },
    {
        "type": "course",
        "title": "2IIM CAT Preparation Course",
        "provider": "2IIM",
        "description": "Organized course with mock tests and topic-wise tutorials. (Paid)",
        "url": "https://2iim.com/"
    },
    {
        "type": "course",
        "title": "Career Launcher CAT Preparation",
        "provider": "Career Launcher",
        "description": "Live online classes and test series for CAT aspirants. (Paid)",
        "url": "https://www.careerlauncher.com/cat/"
    },
    {
        "type": "website",
        "title": "Handa Ka Funda Website",
        "description": "Practice questions, tutorials, and study plans for CAT. (Free and Paid)",
        "url": "https://www.handakafunda.com/"
    },
    {
        "type": "website",
        "title": "Pagalguy",
        "description": "CAT forums, practice, and preparation materials. (Free)",
        "url": "https://pagalguy.com/"
    },
    {
        "type": "website",
        "title": "Hitbullseye",
        "description": "CAT exam preparation materials and mock tests. (Free and Paid)",
        "url": "https://www.hitbullseye.com/cat/"
    },
    {
        "type": "reddit",
        "title": "r/CAT",
        "description": "Community discussing CAT strategies and resources. (Free)",
        "url": "https://www.reddit.com/r/CAT/"
    },
    {
        "type": "discord",
        "title": "CAT Preparation",
        "description": "Active Discord for CAT aspirants sharing resources and motivation. (Free)",
        "url": "https://discord.gg/catprep"
    }
],
"gate": [
    {
        "type": "youtube",
        "title": "NPTEL",
        "description": "High-quality lectures by IIT professors covering GATE syllabus subjects. (Free)",
        "url": "https://www.youtube.com/c/nptelhrd"
    },
    {
        "type": "youtube",
        "title": "Gate Academy",
        "description": "Focused GATE preparation tutorials and problem-solving sessions. (Free and Paid)",
        "url": "https://www.youtube.com/c/GateAcademy"
    },
    {
        "type": "youtube",
        "title": "Made Easy",
        "description": "Comprehensive coaching for GATE with detailed explanations. (Paid)",
        "url": "https://www.youtube.com/c/MadeEasy"
    },
    {
        "type": "youtube",
        "title": "Unacademy GATE",
        "description": "Lectures and strategies for GATE preparation across engineering branches. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyGATE"
    },
    {
        "type": "youtube",
        "title": "Geek's Lecture",
        "description": "Subject-wise GATE preparation videos for various streams. (Free)",
        "url": "https://www.youtube.com/c/GeeksLecture"
    },
    {
        "type": "book",
        "title": "GATE Guide",
        "author": "Made Easy Publications",
        "description": "Extensive collection of previous years' papers and study material. (Paid)",
        "url": "https://madeeasypublications.in/products/gate-guide"
    },
    {
        "type": "book",
        "title": "Engineering Mathematics for GATE",
        "author": "Prestige Books",
        "description": "Covers mathematical concepts required for GATE exams. (Paid)",
        "url": "https://www.amazon.in/Engineering-Mathematics-GATE-Disciplines-ebook/dp/B07N56XWQ7"
    },
    {
        "type": "book",
        "title": "GATE Previous Year Solved Papers",
        "author": "Arihant Experts",
        "description": "Solved questions with explanations from past GATE exams. (Paid)",
        "url": "https://www.arihantbooks.com/"
    },
    {
        "type": "book",
        "title": "GATE Electrical Engineering",
        "author": "R.K. Kanodia",
        "description": "Specialized preparation book for Electrical Engineering GATE. (Paid)",
        "url": "https://www.amazon.in/Guide-GATE-Electrical-Engineering-Kanodia/dp/938607621X"
    },
    {
        "type": "book",
        "title": "GATE Mechanical Engineering",
        "author": "R. K. Rajput",
        "description": "Focused study material for Mechanical Engineering aspirants. (Paid)",
        "url": "https://www.amazon.in/Engineering-Mechanics-Gate-R-K-Rajput/dp/813123825X"
    },
    {
        "type": "course",
        "title": "GATE Online Course",
        "provider": "Made Easy",
        "description": "Full GATE coaching with live classes and test series. (Paid)",
        "url": "https://madeeasy.in/"
    },
    {
        "type": "course",
        "title": "NPTEL Online Certification",
        "provider": "NPTEL",
        "description": "Free courses with certification for GATE related subjects. (Free)",
        "url": "https://onlinecourses.nptel.ac.in/"
    },
    {
        "type": "course",
        "title": "Unacademy GATE Courses",
        "provider": "Unacademy",
        "description": "Interactive GATE coaching and doubt clearing. (Free and Paid)",
        "url": "https://unacademy.com/exam/gate"
    },
    {
        "type": "website",
        "title": "GATE Official Website",
        "description": "Latest official announcements, syllabus, and exam details. (Free)",
        "url": "https://gate.iitb.ac.in/"
    },
    {
        "type": "website",
        "title": "Made Easy Blog",
        "description": "Exam tips, study plans, and resources for GATE aspirants. (Free)",
        "url": "https://madeeasy.in/blog/"
    },
    {
        "type": "website",
        "title": "GATE Overflow",
        "description": "Forum for doubts, discussions, and solved problems. (Free)",
        "url": "https://gateoverflow.in/"
    },
    {
        "type": "website",
        "title": "Gradeup GATE",
        "description": "Study materials, quizzes, and test series. (Free and Paid)",
        "url": "https://gradeup.co/gate"
    },
    {
        "type": "reddit",
        "title": "r/GatePrep",
        "description": "Community discussions and tips for GATE aspirants. (Free)",
        "url": "https://www.reddit.com/r/GatePrep/"
    },
    {
        "type": "discord",
        "title": "GATE Preparation",
        "description": "Discord server for sharing resources and doubts. (Free)",
        "url": "https://discord.gg/gateprep"
    }
],
"upsc": [
    {
        "type": "youtube",
        "title": "Unacademy UPSC",
        "description": "Extensive UPSC exam preparation videos, current affairs, and strategy. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyUPSC"
    },
    {
        "type": "youtube",
        "title": "Study IQ Education",
        "description": "Daily current affairs, UPSC syllabus coverage, and answer writing tips. (Free and Paid)",
        "url": "https://www.youtube.com/c/StudyIQEducation"
    },
    {
        "type": "youtube",
        "title": "Drishti IAS",
        "description": "Subject-wise UPSC preparation covering GS and optional subjects. (Free and Paid)",
        "url": "https://www.youtube.com/c/DrishtiIAS"
    },
    {
        "type": "youtube",
        "title": "Vision IAS",
        "description": "Expert lectures, mock tests, and exam strategy for UPSC. (Paid)",
        "url": "https://www.youtube.com/c/VisionIASOfficial"
    },
    {
        "type": "youtube",
        "title": "Mrunal Patel",
        "description": "Detailed explanations on economics, geography, and more for UPSC. (Free)",
        "url": "https://www.youtube.com/c/MrunalPatelOfficial"
    },
    {
        "type": "book",
        "title": "Indian Polity",
        "author": "M. Laxmikanth",
        "description": "Definitive book on Indian polity for UPSC mains and prelims. (Paid)",
        "url": "https://www.amazon.in/Indian-Polity-M-Laxmikanth/dp/9352607807"
    },
    {
        "type": "book",
        "title": "Certificate Physical and Human Geography",
        "author": "G.C. Leong",
        "description": "Popular geography book for UPSC aspirants. (Paid)",
        "url": "https://www.amazon.in/Certificate-Physical-Human-Geography-GC/dp/8121906434"
    },
    {
        "type": "book",
        "title": "Indian Economy",
        "author": "Ramesh Singh",
        "description": "Comprehensive UPSC economics preparation resource. (Paid)",
        "url": "https://www.amazon.in/Indian-Economy-Ramesh-Singh/dp/9353164326"
    },
    {
        "type": "book",
        "title": "Environment and Ecology",
        "author": "Majid Husain",
        "description": "Essential preparation book on environment and ecology. (Paid)",
        "url": "https://www.amazon.in/Environment-Ecology-Majid-Husain/dp/8131803620"
    },
    {
        "type": "book",
        "title": "India Year Book",
        "author": "Government of India",
        "description": "Official annual publication for current affairs and governance. (Paid)",
        "url": "https://www.amazon.in/India-Year-Book-2025/dp/B09NK8KGGX"
    },
    {
        "type": "course",
        "title": "Unacademy UPSC Course",
        "provider": "Unacademy",
        "description": "Live classes, current affairs, and test series for UPSC. (Free and Paid)",
        "url": "https://unacademy.com/exam/upsc"
    },
    {
        "type": "course",
        "title": "BYJU’S IAS",
        "provider": "BYJU’S",
        "description": "Structured UPSC preparation classes and study materials. (Paid)",
        "url": "https://byjus.com/ias/"
    },
    {
        "type": "course",
        "title": "Vision IAS Online Course",
        "provider": "Vision IAS",
        "description": "Test series, video lectures, and guidance for UPSC preparation. (Paid)",
        "url": "https://www.visionias.in/"
    },
    {
        "type": "website",
        "title": "Press Information Bureau",
        "description": "Government news releases important for UPSC current affairs. (Free)",
        "url": "https://pib.gov.in/"
    },
    {
        "type": "website",
        "title": "InsightsonIndia",
        "description": "Comprehensive UPSC preparation portal with test series and articles. (Free and Paid)",
        "url": "https://www.insightsonindia.com/"
    },
    {
        "type": "website",
        "title": "Mrunal",
        "description": "Expert articles and resources for UPSC preparation. (Free)",
        "url": "https://mrunal.org/"
    },
    {
        "type": "website",
        "title": "ClearIAS",
        "description": "Online study material, mock tests, and strategy for UPSC. (Free and Paid)",
        "url": "https://www.clearias.com/"
    },
    {
        "type": "reddit",
        "title": "r/UPSC",
        "description": "UPSC aspirants' community sharing strategies and resources. (Free)",
        "url": "https://www.reddit.com/r/UPSC/"
    },
    {
        "type": "discord",
        "title": "UPSC Prep",
        "description": "Active Discord server for UPSC exam preparation discussion. (Free)",
        "url": "https://discord.gg/upsc"
    }
],

"mpsc": [
    {
        "type": "youtube",
        "title": "Study IQ MPSC",
        "description": "Comprehensive MPSC exam preparation including GS, CSAT, and syllabus-specific tutorials. (Free and Paid)",
        "url": "https://www.youtube.com/c/StudyIQMPSC"
    },
    {
        "type": "youtube",
        "title": "TalentSprint MPSC",
        "description": "Focused coaching on Marathi language, General Knowledge, and current affairs for MPSC. (Free and Paid)",
        "url": "https://www.youtube.com/c/TalentSprintMPSC"
    },
    {
        "type": "youtube",
        "title": "MPSC Guru",
        "description": "MPSC General Studies and Marathi language coaching videos. (Free)",
        "url": "https://www.youtube.com/c/MPSCguru"
    },
    {
        "type": "youtube",
        "title": "Vidyalankar MPSC",
        "description": "Guided tutorials and classroom videos for MPSC preparation. (Paid)",
        "url": "https://www.youtube.com/c/VidyalankarInstitute"
    },
    {
        "type": "youtube",
        "title": "Career Point Marathi",
        "description": "Marathi medium MPSC tutorials and exam guidance. (Free)",
        "url": "https://www.youtube.com/c/CareerPointMarathi"
    },
    {
        "type": "book",
        "title": "MPSC General Studies Manual",
        "author": "Upkar Prakashan",
        "description": "Comprehensive manual covering all subjects for MPSC preliminary and mains exams. (Paid)",
        "url": "https://upkar.in/product/MPSC-General-Studies-Manual-General-Studies-Preliminary-Mains"
    },
    {
        "type": "book",
        "title": "MPSC Marathi Language Guide",
        "author": "Kiran Publications",
        "description": "Detailed guide for Maharashtra Public Service Commission Marathi language papers. (Paid)",
        "url": "https://www.amazon.in/Kiran-MPSC-Maharashtra-Marathi-Previous/dp/B08ZCJG5TC"
    },
    {
        "type": "book",
        "title": "Maharashtra GK & Current Affairs",
        "author": "Arihant Experts",
        "description": "Relevant current affairs and state-specific general knowledge for MPSC. (Paid)",
        "url": "https://www.amazon.in/Arihant-Maharashtra-GK-Current-Affairs/dp/B07P9BTBYQ"
    },
    {
        "type": "book",
        "title": "MPSC Mains Solved Papers",
        "author": "Various",
        "description": "Collection of past mains exam papers with solutions. (Paid)",
        "url": "https://upkar.in/product/MPSC-Mains-Solved-Papers"
    },
    {
        "type": "book",
        "title": "Mental Ability for MPSC",
        "author": "R.S. Aggarwal",
        "description": "Practice book for reasoning and aptitude tests. (Paid)",
        "url": "https://www.amazon.in/Mental-Ability-R-S-Aggarwal/dp/8186799756"
    },
    {
        "type": "course",
        "title": "MPSC Exam Preparation",
        "provider": "Unacademy Marathi",
        "description": "Live and recorded coaching for all MPSC exam subjects. (Free and Paid)",
        "url": "https://unacademy.com/unacademy-marathi"
    },
    {
        "type": "course",
        "title": "MPSC Online Coaching",
        "provider": "Vidyalankar",
        "description": "Paid interactive coaching programs and test series for MPSC aspirants.",
        "url": "https://www.vidyalankar.org/mpsc"
    },
    {
        "type": "course",
        "title": "MPSC Current Affairs",
        "provider": "Study IQ",
        "description": "Regular current affairs updates and quizzes for MPSC. (Free and Paid)",
        "url": "https://www.studyiq.com/courses/mpsc-current-affairs"
    },
    {
        "type": "website",
        "title": "MPSC Official Website",
        "description": "Official notifications, syllabus, and exam-related updates. (Free)",
        "url": "https://mpsc.gov.in/"
    },
    {
        "type": "website",
        "title": "Lokseva",
        "description": "MPSC preparation materials, quizzes, and exam tips. (Free and Paid)",
        "url": "https://www.lokseva.com/"
    },
    {
        "type": "reddit",
        "title": "r/MPSC",
        "description": "Community sharing resources and preparation tips for MPSC exams. (Free)",
        "url": "https://www.reddit.com/r/MPSC/"
    },
    {
        "type": "discord",
        "title": "MPSC Preparation",
        "description": "Telegram/Discord groups focused on MPSC exam prep. (Free)",
        "url": "https://discord.gg/mpsc"
    }
],
"civil service examination": [
    {
        "type": "youtube",
        "title": "Unacademy UPSC",
        "description": "High-quality UPSC IAS exam preparation including GS, CSAT, and optional subjects. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyUPSC"
    },
    {
        "type": "youtube",
        "title": "Vision IAS",
        "description": "Expert coaching videos, current affairs, and mock test discussions. (Paid)",
        "url": "https://www.youtube.com/c/VisionIASOfficial"
    },
    {
        "type": "youtube",
        "title": "Drishti IAS",
        "description": "Extensive video lessons covering all UPSC prelims and mains subjects. (Free and Paid)",
        "url": "https://www.youtube.com/c/DrishtiIAS"
    },
    {
        "type": "youtube",
        "title": "Mrunal Patel",
        "description": "Economics and current affairs for civil services exam preparation. (Free)",
        "url": "https://www.youtube.com/c/MrunalPatelOfficial"
    },
    {
        "type": "youtube",
        "title": "Shubham Kumar IAS",
        "description": "Detailed subject-wise UPSC preparation and guidance. (Free)",
        "url": "https://www.youtube.com/c/ShubhamKumarIAS"
    },
    {
        "type": "book",
        "title": "Indian Polity by M. Laxmikanth",
        "author": "M. Laxmikanth",
        "description": "Definitive guide for UPSC polity syllabus. (Paid)",
        "url": "https://www.amazon.in/Indian-Polity-M-Laxmikanth/dp/9352607807"
    },
    {
        "type": "book",
        "title": "Indian Economy by Ramesh Singh",
        "author": "Ramesh Singh",
        "description": "Comprehensive economics book for civil services exams. (Paid)",
        "url": "https://www.amazon.in/Indian-Economy-Ramesh-Singh/dp/9353164326"
    },
    {
        "type": "book",
        "title": "Geography of India by Majid Husain",
        "author": "Majid Husain",
        "description": "Popular geography reference for UPSC aspirants. (Paid)",
        "url": "https://www.amazon.in/Geography-India-Majid-Husain/dp/9350513198"
    },
    {
        "type": "course",
        "title": "UPSC Civil Services Preparation",
        "provider": "Unacademy",
        "description": "Extensive coaching classes with strategy and test series. (Free and Paid)",
        "url": "https://unacademy.com/exam/upsc"
    },
    {
        "type": "course",
        "title": "Vision IAS Classroom and Online Course",
        "provider": "Vision IAS",
        "description": "Structured offline and online coaching for current affairs and general studies. (Paid)",
        "url": "https://www.visionias.in/"
    },
    {
        "type": "website",
        "title": "UPSC Official Website",
        "description": "Exam notifications, syllabus, and official resources. (Free)",
        "url": "https://www.upsc.gov.in/"
    },
    {
        "type": "website",
        "title": "Insights on India",
        "description": "Daily current affairs and preparation resources for UPSC. (Free and Paid)",
        "url": "https://www.insightsonindia.com/"
    },
    {
        "type": "website",
        "title": "ClearIAS",
        "description": "Online learning resources, mock tests, and strategy tips. (Free and Paid)",
        "url": "https://www.clearias.com/"
    },
    {
        "type": "reddit",
        "title": "r/UPSC",
        "description": "Community for UPSC aspirants sharing resources and tips. (Free)",
        "url": "https://www.reddit.com/r/UPSC/"
    },
    {
        "type": "discord",
        "title": "UPSC Aspirants Community",
        "description": "Active Discord group for civil service exam preparation. (Free)",
        "url": "https://discord.gg/upsc"
    }
],
"gmat": [
    {
        "type": "youtube",
        "title": "Magoosh GMAT",
        "description": "Comprehensive video lessons covering GMAT quant, verbal, and strategies. (Free and Paid)",
        "url": "https://www.youtube.com/c/MagooshGMAT"
    },
    {
        "type": "youtube",
        "title": "GMAT Official",
        "description": "Official GMAT exam information, tips, and tutorials. (Free)",
        "url": "https://www.youtube.com/user/gmat"
    },
    {
        "type": "youtube",
        "title": "Manhattan Prep GMAT",
        "description": "Expert tutorials and problem-solving strategies for GMAT. (Free and Paid)",
        "url": "https://www.youtube.com/c/manhattanprep"
    },
    {
        "type": "youtube",
        "title": "Veritas Prep GMAT",
        "description": "Detailed GMAT preparation and strategy videos. (Free and Paid)",
        "url": "https://www.youtube.com/c/VeritasPrep"
    },
    {
        "type": "youtube",
        "title": "Target Test Prep",
        "description": "Quantitative focused GMAT tutorials and test strategies. (Paid)",
        "url": "https://www.youtube.com/c/TargetTestPrep"
    },
    {
        "type": "book",
        "title": "The Official Guide for GMAT Review 2025",
        "author": "GMAC",
        "description": "Official practice questions and exam information. (Paid)",
        "url": "https://www.mba.com/exam-prep/the-official-guide"
    },
    {
        "type": "book",
        "title": "GMAT Quantitative Strategy Guide",
        "author": "Manhattan Prep",
        "description": "In-depth quant review for GMAT aspirants. (Paid)",
        "url": "https://www.manhattanprep.com/gmat/"
    },
    {
        "type": "book",
        "title": "GMAT Sentence Correction",
        "author": "Manhattan Prep",
        "description": "Focused book on verbal sentence correction. (Paid)",
        "url": "https://www.manhattanprep.com/gmat/"
    },
    {
        "type": "book",
        "title": "GMAT Critical Reasoning Bible",
        "author": "PowerScore",
        "description": "Comprehensive guide to critical reasoning on GMAT. (Paid)",
        "url": "https://www.powerscore.com/gmat/"
    },
    {
        "type": "book",
        "title": "Kaplan GMAT Prep Plus",
        "author": "Kaplan Test Prep",
        "description": "All-in-one guide with practice tests and strategies. (Paid)",
        "url": "https://www.kaptest.com/gmat"
    },
    {
        "type": "course",
        "title": "Magoosh GMAT Prep",
        "provider": "Magoosh",
        "description": "Online GMAT prep with video lessons and practice questions. (Paid)",
        "url": "https://magoosh.com/gmat/"
    },
    {
        "type": "course",
        "title": "Manhattan Prep GMAT Online Course",
        "provider": "Manhattan Prep",
        "description": "Live and on-demand classes for all GMAT sections. (Paid)",
        "url": "https://www.manhattanprep.com/gmat/"
    },
    {
        "type": "course",
        "title": "GMAT Official Practice Exams",
        "provider": "GMAC",
        "description": "Free and paid official practice tests and prep resources. (Free and Paid)",
        "url": "https://www.mba.com/exam-prep/gmat-official-practice-exams"
    },
    {
        "type": "website",
        "title": "GMAT Club",
        "description": "Community, forums, and resources for GMAT test takers. (Free)",
        "url": "https://gmatclub.com/"
    },
    {
        "type": "website",
        "title": "Beat The GMAT",
        "description": "Practice questions, test strategies, and prep guides. (Free and Paid)",
        "url": "https://beatthegmat.com/"
    },
    {
        "type": "reddit",
        "title": "r/GMAT",
        "description": "Community sharing tips, questions, and resources for GMAT. (Free)",
        "url": "https://www.reddit.com/r/GMAT/"
    },
    {
        "type": "discord",
        "title": "GMAT Prep",
        "description": "Discord server for peer discussion and prep for GMAT. (Free)",
        "url": "https://discord.gg/gmat"
    }
],
"gre": [
    {
        "type": "youtube",
        "title": "Magoosh GRE",
        "description": "Expert GRE video lessons covering verbal, quant, and writing. (Free and Paid)",
        "url": "https://www.youtube.com/c/MagooshGRE"
    },
    {
        "type": "youtube",
        "title": "ETS GRE",
        "description": "Official GRE test information, tips, and tutorials. (Free)",
        "url": "https://www.youtube.com/user/GRE"
    },
    {
        "type": "youtube",
        "title": "GregMat",
        "description": "Highly popular GRE preparation channel with strategies and lessons. (Free)",
        "url": "https://www.youtube.com/c/GregMat"
    },
    {
        "type": "youtube",
        "title": "Kaplan GRE",
        "description": "GRE prep courses and useful exam strategies. (Free and Paid)",
        "url": "https://www.youtube.com/c/KaplanGRE"
    },
    {
        "type": "youtube",
        "title": "PrepScholar GRE",
        "description": "GRE prep tips and common mistakes to avoid. (Free)",
        "url": "https://www.youtube.com/c/PrepScholar"
    },
    {
        "type": "book",
        "title": "The Official Guide to the GRE General Test",
        "author": "ETS",
        "description": "Official GRE prep book with real test questions. (Paid)",
        "url": "https://www.ets.org/gre/revised_general/prepare/"
    },
    {
        "type": "book",
        "title": "Manhattan Prep GRE Set of 8 Strategy Guides",
        "author": "Manhattan Prep",
        "description": "Comprehensive guides covering all GRE sections. (Paid)",
        "url": "https://www.manhattanprep.com/gre/"
    },
    {
        "type": "book",
        "title": "Barron's GRE",
        "author": "Phyllis Dutwin",
        "description": "Popular GRE prep book with practice tests and vocab. (Paid)",
        "url": "https://www.amazon.com/Barrons-GRE-7th-Edition/dp/1438012227"
    },
    {
        "type": "book",
        "title": "GRE Vocabulary Flashcards",
        "author": "Manhattan Prep",
        "description": "Flashcards to build essential GRE vocabulary. (Paid)",
        "url": "https://www.manhattanprep.com/gre/products/gre-vocabulary-flashcards/"
    },
    {
        "type": "book",
        "title": "Kaplan GRE Prep Plus",
        "author": "Kaplan Test Prep",
        "description": "In-depth GRE prep book with practice questions. (Paid)",
        "url": "https://www.kaptest.com/"
    },
    {
        "type": "course",
        "title": "Magoosh GRE Online Prep",
        "provider": "Magoosh",
        "description": "Video lessons, practice questions, and study plans for GRE prep. (Paid)",
        "url": "https://magoosh.com/gre/"
    },
    {
        "type": "course",
        "title": "ETS GRE PowerPrep Online",
        "provider": "ETS",
        "description": "Official practice tests and preparation tools. (Free and Paid)",
        "url": "https://www.ets.org/gre/revised_general/prepare/powerprep"
    },
    {
        "type": "course",
        "title": "Kaplan GRE Prep",
        "provider": "Kaplan",
        "description": "Live and on-demand GRE prep courses and tutoring. (Paid)",
        "url": "https://www.kaptest.com/gre"
    },
    {
        "type": "website",
        "title": "GRE Prep Club",
        "description": "Discussion forums, study plans, and resources for GRE. (Free)",
        "url": "https://greprepclub.com/"
    },
    {
        "type": "website",
        "title": "CrunchPrep GRE",
        "description": "GRE prep blogs, practice problems, and tips. (Free and Paid)",
        "url": "https://www.crunchprep.com/gre"
    },
    {
        "type": "reddit",
        "title": "r/GRE",
        "description": "Popular subreddit with GRE prep tips and Q&A. (Free)",
        "url": "https://www.reddit.com/r/GRE/"
    },
    {
        "type": "discord",
        "title": "GRE Study Group",
        "description": "Supportive Discord for practice and discussion around GRE prep. (Free)",
        "url": "https://discord.gg/gre"
    }
],
"sat": [
    {
        "type": "youtube",
        "title": "Khan Academy SAT",
        "description": "Official partner providing free, high-quality SAT preparation videos. (Free)",
        "url": "https://www.youtube.com/c/KhanAcademy"
    },
    {
        "type": "youtube",
        "title": "PrepScholar SAT",
        "description": "SAT tips, strategies, and practice question explanations. (Free)",
        "url": "https://www.youtube.com/c/PrepScholar"
    },
    {
        "type": "youtube",
        "title": "Magoosh SAT",
        "description": "Video lessons and prep guidance for SAT reading, writing, and math. (Free and Paid)",
        "url": "https://www.youtube.com/c/MagooshSAT"
    },
    {
        "type": "youtube",
        "title": "College Board",
        "description": "Official SAT information, sample questions, and test day tips. (Free)",
        "url": "https://www.youtube.com/user/collegeboard"
    },
    {
        "type": "youtube",
        "title": "SuperTutorTV",
        "description": "Test prep tutorials with focus on SAT verbal and math. (Free)",
        "url": "https://www.youtube.com/c/SuperTutorTV"
    },
    {
        "type": "book",
        "title": "The Official SAT Study Guide",
        "author": "College Board",
        "description": "Official practice tests and preparation for the SAT exam. (Paid)",
        "url": "https://collegereadiness.collegeboard.org/sat/practice-preparation"
    },
    {
        "type": "book",
        "title": "Barron's SAT",
        "author": "Sharon Weiner Green and Ira K. Wolf",
        "description": "Comprehensive SAT prep including practice questions. (Paid)",
        "url": "https://www.amazon.com/Barrons-SAT-Sharon-Weiner-Green/dp/1438012138"
    },
    {
        "type": "book",
        "title": "Kaplan SAT Prep Plus",
        "author": "Kaplan Test Prep",
        "description": "In-depth prep book with strategies and practice tests. (Paid)",
        "url": "https://www.kaptest.com/sat"
    },
    {
        "type": "book",
        "title": "SAT Prep Black Book",
        "author": "Mike Barrett",
        "description": "Strategic approach and test tactics for SAT. (Paid)",
        "url": "https://www.amazon.com/SAT-Prep-Black-Book-Official/dp/1935700001"
    },
    {
        "type": "book",
        "title": "Dr. John Chung's SAT Math",
        "author": "John Chung",
        "description": "Challenging math problems and solutions for SAT. (Paid)",
        "url": "https://www.amazon.com/Dr-John-Chungs-SAT-Math/dp/0975276190"
    },
    {
        "type": "course",
        "title": "Khan Academy Official SAT Prep",
        "provider": "Khan Academy",
        "description": "Personalized SAT prep with full practice tests. (Free)",
        "url": "https://www.khanacademy.org/test-prep/sat"
    },
    {
        "type": "course",
        "title": "Magoosh SAT Online Prep",
        "provider": "Magoosh",
        "description": "Video lessons and practice questions for SAT preparation. (Paid)",
        "url": "https://magoosh.com/sat/"
    },
    {
        "type": "course",
        "title": "PrepScholar SAT Prep",
        "provider": "PrepScholar",
        "description": "Comprehensive SAT prep courses and diagnostics. (Paid)",
        "url": "https://www.prepscholar.com/sat/s/"
    },
    {
        "type": "website",
        "title": "College Board",
        "description": "Official SAT information, practice questions, and registration. (Free)",
        "url": "https://collegereadiness.collegeboard.org/sat"
    },
    {
        "type": "website",
        "title": "The Princeton Review",
        "description": "Practice tests, tutoring, and online prep resources for SAT. (Free and Paid)",
        "url": "https://www.princetonreview.com/college/sat-test-prep"
    },
    {
        "type": "reddit",
        "title": "r/SAT",
        "description": "Community discussing SAT strategies and queries. (Free)",
        "url": "https://www.reddit.com/r/SAT/"
    },
    {
        "type": "discord",
        "title": "SAT Study Group",
        "description": "Peer group for SAT preparation and resource sharing. (Free)",
        "url": "https://discord.gg/satprep"
    }
],
"act": [
    {
        "type": "youtube",
        "title": "ACT Official",
        "description": "Official ACT test information, tips, and tutorials. (Free)",
        "url": "https://www.youtube.com/user/GOACT"
    },
    {
        "type": "youtube",
        "title": "The Princeton Review ACT",
        "description": "ACT prep videos covering all sections of the exam. (Free and Paid)",
        "url": "https://www.youtube.com/c/ThePrincetonReviewACT"
    },
    {
        "type": "youtube",
        "title": "Magoosh ACT",
        "description": "Detailed ACT prep lessons and strategies. (Free and Paid)",
        "url": "https://www.youtube.com/c/MagooshACT"
    },
    {
        "type": "youtube",
        "title": "PrepScholar ACT",
        "description": "Comprehensive ACT advice, practice, and strategies. (Free)",
        "url": "https://www.youtube.com/c/PrepScholarACT"
    },
    {
        "type": "youtube",
        "title": "Test Prep Nerds",
        "description": "General test prep strategies including ACT focused videos. (Free)",
        "url": "https://www.youtube.com/c/TestPrepNerds"
    },
    {
        "type": "book",
        "title": "The Official ACT Prep Guide 2025-2026",
        "author": "ACT, Inc.",
        "description": "Official ACT practice tests and test-taking strategies. (Paid)",
        "url": "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation.html"
    },
    {
        "type": "book",
        "title": "Kaplan's ACT Prep Plus",
        "author": "Kaplan Test Prep",
        "description": "Comprehensive ACT preparation guide. (Paid)",
        "url": "https://www.kaptest.com/college-prep/act-prep"
    },
    {
        "type": "book",
        "title": "The Real ACT Prep Guide",
        "author": "Real ACT",
        "description": "Practice tests and strategies from third-party experts. (Paid)",
        "url": "https://www.amazon.com/Real-ACT-Prep-Guide/dp/0976718237"
    },
    {
        "type": "book",
        "title": "ACT Prep Black Book",
        "author": "Mike Barrett",
        "description": "Strategic approaches and problem-solving tactics for ACT. (Paid)",
        "url": "https://www.amazon.com/ACT-Prep-Black-Book-Dissecting/dp/1609710306"
    },
    {
        "type": "book",
        "title": "Barron's ACT",
        "author": "Irene Mayes",
        "description": "Practice questions and review for each section of the ACT. (Paid)",
        "url": "https://www.amazon.com/Barrons-ACT-Irene-Mayes/dp/1506260349"
    },
    {
        "type": "course",
        "title": "Magoosh ACT Online Prep",
        "provider": "Magoosh",
        "description": "Video lessons and quizzes for all ACT sections. (Paid)",
        "url": "https://magoosh.com/act/"
    },
    {
        "type": "course",
        "title": "Kaplan ACT Prep Courses",
        "provider": "Kaplan",
        "description": "Live and on-demand ACT prep options. (Paid)",
        "url": "https://www.kaptest.com/act"
    },
    {
        "type": "course",
        "title": "The Princeton Review ACT Courses",
        "provider": "The Princeton Review",
        "description": "Comprehensive preparation classes and test simulations. (Paid)",
        "url": "https://www.princetonreview.com/college/act-test-prep"
    },
    {
        "type": "website",
        "title": "ACT Official Site",
        "description": "Official test registration, prep materials, and updates. (Free)",
        "url": "https://www.act.org/"
    },
    {
        "type": "website",
        "title": "PrepScholar ACT",
        "description": "Practice questions, prep tips, and study plans. (Free and Paid)",
        "url": "https://www.prepscholar.com/act/s/"
    },
    {
        "type": "reddit",
        "title": "r/ACT",
        "description": "Community for sharing ACT exam tips and experiences. (Free)",
        "url": "https://www.reddit.com/r/ACT/"
    },
    {
        "type": "discord",
        "title": "ACT Test Prep",
        "description": "Discord server for ACT prep discussion and peer support. (Free)",
        "url": "https://discord.gg/act"
    }
],
"ielts": [
    {
        "type": "youtube",
        "title": "IELTS Official",
        "description": "Official IELTS test tips, sample tests, and updates. (Free)",
        "url": "https://www.youtube.com/user/IELTSOfficial"
    },
    {
        "type": "youtube",
        "title": "IELTS Liz",
        "description": "Detailed strategies and sample answers for IELTS writing and speaking. (Free)",
        "url": "https://www.youtube.com/c/ieltsliz"
    },
    {
        "type": "youtube",
        "title": "E2 IELTS",
        "description": "Comprehensive IELTS practice and exam techniques. (Free and Paid)",
        "url": "https://www.youtube.com/c/E2Language"
    },
    {
        "type": "youtube",
        "title": "AcademicEnglishHelp",
        "description": "IELTS writing and speaking tips for academic modules. (Free)",
        "url": "https://www.youtube.com/c/AcademicEnglishHelp"
    },
    {
        "type": "youtube",
        "title": "British Council IELTS",
        "description": "Official British Council IELTS preparation and guidance. (Free)",
        "url": "https://www.youtube.com/user/BritishCouncilLE"
    },
    {
        "type": "book",
        "title": "The Official Cambridge Guide to IELTS",
        "author": "University of Cambridge ESOL Examinations",
        "description": "Comprehensive guide with practice materials for all IELTS sections. (Paid)",
        "url": "https://www.cambridge.org/elt/catalogue/subject/project/item6669660/The-Official-Cambridge-Guide-to-IELTS/"
    },
    {
        "type": "book",
        "title": "Barron's IELTS",
        "author": "Lin Lougheed",
        "description": "Test prep book covering listening, reading, writing, and speaking. (Paid)",
        "url": "https://www.amazon.com/Barrons-IELTS-6th-Lougheed/dp/1438012111"
    },
    {
        "type": "book",
        "title": "Target Band 7",
        "author": "Simone Braverman",
        "description": "Strategies and practice exercises to achieve high IELTS scores. (Paid)",
        "url": "https://www.amazon.com/Target-Band-7-Simon-Braverman/dp/0956766926"
    },
    {
        "type": "book",
        "title": "Cambridge IELTS Practice Tests",
        "author": "Cambridge English",
        "description": "Official practice tests with answer keys. (Paid)",
        "url": "https://www.cambridgeenglish.org/learning-english/exams/ielts/"
    },
    {
        "type": "book",
        "title": "Grammar for IELTS",
        "author": "Diane Hopkins and Pauline Cullen",
        "description": "Grammar exercises tailored for IELTS tests. (Paid)",
        "url": "https://www.cambridge.org/gb/cambridgeenglish/catalog/grammar-vocabulary-and-pronunciation/grammar-ielts"
    },
    {
        "type": "course",
        "title": "EdX IELTS Academic Preparation",
        "provider": "edX, IDP Education",
        "description": "Free preparation for IELTS Academic with option for verified certificate. (Free and Paid)",
        "url": "https://www.edx.org/course/ielts-academic-preparation"
    },
    {
        "type": "course",
        "title": "Magoosh IELTS",
        "provider": "Magoosh",
        "description": "Online video lessons and practice tests for IELTS. (Paid)",
        "url": "https://magoosh.com/ielts/"
    },
    {
        "type": "course",
        "title": "IELTS Prep Online",
        "provider": "British Council",
        "description": "Free online IELTS practice and skill-building course. (Free)",
        "url": "https://learnenglish.britishcouncil.org/ielts"
    },
    {
        "type": "website",
        "title": "IELTS.org",
        "description": "Official IELTS information and preparation resources. (Free)",
        "url": "https://www.ielts.org/"
    },
    {
        "type": "website",
        "title": "Road to IELTS",
        "description": "Official British Council online practice tests and resources. (Free and Paid)",
        "url": "https://roadtoielts.com/"
    },
    {
        "type": "reddit",
        "title": "r/IELTS",
        "description": "Community for sharing IELTS preparation tips and experiences. (Free)",
        "url": "https://www.reddit.com/r/IELTS/"
    },
    {
        "type": "discord",
        "title": "IELTS Prep",
        "description": "Discord server for peer support and resource sharing in IELTS exam preparation. (Free)",
        "url": "https://discord.gg/ielts"
    }
],
"toefl": [
    {
        "type": "youtube",
        "title": "TOEFL TV",
        "description": "Official TOEFL test tips, sample answers, and updates. (Free)",
        "url": "https://www.youtube.com/user/TOEFLtv"
    },
    {
        "type": "youtube",
        "title": "Notefull TOEFL Mastery",
        "description": "Detailed TOEFL preparation videos for reading, listening, speaking, and writing. (Free and Paid)",
        "url": "https://www.youtube.com/c/NotefullTOEFLMastery"
    },
    {
        "type": "youtube",
        "title": "Magoosh TOEFL",
        "description": "TOEFL test strategies and practice lessons. (Free and Paid)",
        "url": "https://www.youtube.com/c/MagooshTOEFL"
    },
    {
        "type": "youtube",
        "title": "English with Max",
        "description": "English language skills and TOEFL practice speaking exercises. (Free)",
        "url": "https://www.youtube.com/c/EnglishwithMax"
    },
    {
        "type": "youtube",
        "title": "TST Prep",
        "description": "TOEFL tips and practice focusing on score improvement. (Free)",
        "url": "https://www.youtube.com/c/TSTPrep"
    },
    {
        "type": "book",
        "title": "Official TOEFL iBT Tests Volume 2",
        "author": "ETS",
        "description": "Official practice tests and sample questions. (Paid)",
        "url": "https://www.ets.org/toefl/test-takers/ibt/prepare/tests/"
    },
    {
        "type": "book",
        "title": "Cambridge Preparation for the TOEFL Test",
        "author": "J. L. Lombardi",
        "description": "Practice tests and exam strategies. (Paid)",
        "url": "https://www.cambridge.org/elt/catalogue/subject/project/item1234567"
    },
    {
        "type": "book",
        "title": "Kaplan's TOEFL iBT Prep Plus",
        "author": "Kaplan Test Prep",
        "description": "Comprehensive test prep book with practice tests. (Paid)",
        "url": "https://www.kaptest.com/toefl"
    },
    {
        "type": "book",
        "title": "Barron's TOEFL iBT",
        "author": "Pamela J. Sharpe",
        "description": "Practice questions and audio CDs for listening and speaking. (Paid)",
        "url": "https://www.amazon.com/Barrons-TOEFL-iBT-Pamela-Sharpe/dp/1438077337"
    },
    {
        "type": "book",
        "title": "Delta's Key to the TOEFL iBT",
        "author": "Nancy Gallagher",
        "description": "Practice tests and skill-building exercises. (Paid)",
        "url": "https://www.amazon.com/Deltas-Key-TOEFL-iBT-Nancy-Gallagher/dp/0615891827"
    },
    {
        "type": "course",
        "title": "ETS TOEFL Online Preparation",
        "provider": "ETS",
        "description": "Official online practice materials and prep courses. (Free and Paid)",
        "url": "https://www.ets.org/toefl/test-takers/ibt/prepare/"
    },
    {
        "type": "course",
        "title": "Magoosh TOEFL Online Course",
        "provider": "Magoosh",
        "description": "Online prep with video lessons and practice questions. (Paid)",
        "url": "https://magoosh.com/toefl/"
    },
    {
        "type": "course",
        "title": "English Grammar and Vocabulary for TOEFL",
        "provider": "Udemy",
        "description": "Focused courses on English language skills for TOEFL. (Paid)",
        "url": "https://www.udemy.com/course/english-for-toefl/"
    },
    {
        "type": "website",
        "title": "Official TOEFL Website",
        "description": "Registration, test format, and prep resources from ETS. (Free)",
        "url": "https://www.ets.org/toefl"
    },
    {
        "type": "website",
        "title": "Test Guide TOEFL Resources",
        "description": "Free TOEFL practice tests and tips. (Free)",
        "url": "https://www.test-guide.com/free-toefl-practice-tests.html"
    },
    {
        "type": "reddit",
        "title": "r/TOEFL",
        "description": "Community discussing TOEFL preparation and questions. (Free)",
        "url": "https://www.reddit.com/r/TOEFL/"
    },
    {
        "type": "discord",
        "title": "TOEFL Preparation",
        "description": "Supportive Discord community for TOEFL study and resources. (Free)",
        "url": "https://discord.gg/toeflprep"
    }
],
"clat": [
    {
        "type": "youtube",
        "title": "LegalEdge Tutorials",
        "description": "Comprehensive CLAT preparation covering legal aptitude, reasoning, and current affairs. (Free and Paid)",
        "url": "https://www.youtube.com/c/LegalEdgeTutorials"
    },
    {
        "type": "youtube",
        "title": "CLATapult",
        "description": "Focused tutorials for CLAT preparation including English and general knowledge. (Free)",
        "url": "https://www.youtube.com/c/Clatapult"
    },
    {
        "type": "youtube",
        "title": "Aakash Law Academy",
        "description": "CLAT coaching with live classes and exam strategy. (Paid)",
        "url": "https://www.youtube.com/c/AakashLawAcademy"
    },
    {
        "type": "youtube",
        "title": "Eduncle CLAT",
        "description": "Subject-wise CLAT preparation videos and mock tests. (Free and Paid)",
        "url": "https://www.youtube.com/c/EduncleCLAT"
    },
    {
        "type": "youtube",
        "title": "Career Launcher CLAT",
        "description": "CLAT exam tips, coaching, and doubt solving sessions. (Paid)",
        "url": "https://www.youtube.com/c/careerlauncherofficial"
    },
    {
        "type": "book",
        "title": "Legal Awareness and Legal Reasoning",
        "author": "A.P. Bhardwaj",
        "description": "Popular CLAT preparation book focusing on legal aptitude. (Paid)",
        "url": "https://www.amazon.in/Legal-Awareness-Reasoning-CLAT-Books/dp/9388926371"
    },
    {
        "type": "book",
        "title": "Word Power Made Easy",
        "author": "Norman Lewis",
        "description": "Vocabulary preparation essential for CLAT. (Paid)",
        "url": "https://www.amazon.in/Word-Power-Made-Easy/dp/0671728200"
    },
    {
        "type": "book",
        "title": "Analytical Reasoning by MK Pandey",
        "author": "M.K. Pandey",
        "description": "Comprehensive guide for reasoning section in CLAT. (Paid)",
        "url": "https://www.amazon.in/Logical-Reasoning-M-K-Pandey/dp/9332515523"
    },
    {
        "type": "book",
        "title": "Objective General Knowledge by Arihant",
        "author": "Arihant Experts",
        "description": "General knowledge and current affairs book relevant for CLAT. (Paid)",
        "url": "https://www.amazon.in/Objective-General-Knowledge-Arihant-Experts/dp/9313172117"
    },
    {
        "type": "book",
        "title": "CLAT Solved Papers",
        "author": "Various",
        "description": "Previous years' solved question papers. (Paid)",
        "url": "https://www.amazon.in/CLAT-Solved-Papers-Exam-Guide/dp/B08D6X4VND"
    },
    {
        "type": "course",
        "title": "CLAT Aspirant Course",
        "provider": "LegalEdge Tutorials",
        "description": "Live classes and comprehensive CLAT preparation course. (Paid)",
        "url": "https://www.legaledge.in/"
    },
    {
        "type": "course",
        "title": "CLAT Online Coaching",
        "provider": "Career Launcher",
        "description": "Online test series, lectures, and doubt-clearing for CLAT. (Paid)",
        "url": "https://www.careerlauncher.com/clat/"
    },
    {
        "type": "website",
        "title": "CLAT Official Website",
        "description": "Notifications, syllabus, and official guidelines for CLAT exam. (Free)",
        "url": "https://consortiumofnlus.ac.in/"
    },
    {
        "type": "website",
        "title": "CLATapult",
        "description": "Prep material, quizzes, and video tutorials for CLAT aspirants. (Free and Paid)",
        "url": "https://clatapult.com/"
    },
    {
        "type": "reddit",
        "title": "r/CLAT",
        "description": "Community sharing preparation tips and study resources for CLAT. (Free)",
        "url": "https://www.reddit.com/r/CLAT/"
    },
    {
        "type": "discord",
        "title": "CLAT Preparation",
        "description": "Discord server for peer interaction and preparation resources. (Free)",
        "url": "https://discord.gg/clat"
    }
],
"ssc": [
    {
        "type": "youtube",
        "title": "Study IQ SSC",
        "description": "SSC exam preparation including General Studies, Quant, and reasoning classes. (Free and Paid)",
        "url": "https://www.youtube.com/c/StudyIQSSC"
    },
    {
        "type": "youtube",
        "title": "Adda247 SSC",
        "description": "Live coaching and tutorials specifically for SSC exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/Adda247SSC"
    },
    {
        "type": "youtube",
        "title": "SSC Adda",
        "description": "Exam tips, mock tests, and updated SSC syllabus content. (Free)",
        "url": "https://www.youtube.com/c/SSCAddaOfficial"
    },
    {
        "type": "youtube",
        "title": "Unacademy SSC",
        "description": "Structured live classes for SSC CGL, CHSL, and other exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademySSC"
    },
    {
        "type": "youtube",
        "title": "Wifistudy",
        "description": "Free SSC preparation videos and quizzes covering all subjects. (Free)",
        "url": "https://www.youtube.com/c/WifistudyOfficial"
    },
    {
        "type": "book",
        "title": "Lucent's General Knowledge",
        "author": "Lucent",
        "description": "Popular book for SSC General Knowledge and current affairs. (Paid)",
        "url": "https://www.amazon.in/Lucents-General-Knowledge-English/dp/9389422637"
    },
    {
        "type": "book",
        "title": "Magical Book on Quicker Maths",
        "author": "M. Tyra",
        "description": "Speed math techniques useful for SSC quant section. (Paid)",
        "url": "https://www.amazon.in/Magical-Book-Quicker-Maths/dp/9352060016"
    },
    {
        "type": "book",
        "title": "Objective General English",
        "author": "S.P. Bakshi",
        "description": "Grammar and vocabulary for SSC English section. (Paid)",
        "url": "https://www.amazon.in/Objective-General-English-SP-Bakshi/dp/8174465130"
    },
    {
        "type": "book",
        "title": "Kiran's SSC Guide",
        "author": "Kiran Prakashan",
        "description": "Comprehensive guide for SSC Preliminary and Mains exams. (Paid)",
        "url": "https://www.amazon.in/Kirans-SSC-CGL-Guide-English/dp/9391125783"
    },
    {
        "type": "book",
        "title": "Fast Track Objective Arithmetic",
        "author": "Rajesh Verma",
        "description": "Quick arithmetic practice book for SSC exams. (Paid)",
        "url": "https://www.amazon.in/Fast-Track-Objective-Arithmetic-Mathematics/dp/9352874144"
    },
    {
        "type": "course",
        "title": "Adda247 SSC Crash Course",
        "provider": "Adda247",
        "description": "Intense prep for SSC exams covering all subjects. (Paid)",
        "url": "https://www.adda247.com/ssc"
    },
    {
        "type": "course",
        "title": "Unacademy SSC Comprehensive Course",
        "provider": "Unacademy",
        "description": "Live coaching and doubt solving for SSC exams. (Free and Paid)",
        "url": "https://unacademy.com/exam/ssc-cgl"
    },
    {
        "type": "course",
        "title": "SSC Online Coaching",
        "provider": "Testbook",
        "description": "Online tests and coaching for SSC elite exams. (Free and Paid)",
        "url": "https://testbook.com/ssc"
    },
    {
        "type": "website",
        "title": "SSC Official Website",
        "description": "Exam notifications, syllabus, and official updates. (Free)",
        "url": "https://ssc.nic.in/"
    },
    {
        "type": "website",
        "title": "Gradeup SSC",
        "description": "Preparation notes, quizzes, and live classes for SSC exams. (Free and Paid)",
        "url": "https://gradeup.co/ssc-cgl"
    },
    {
        "type": "reddit",
        "title": "r/SSCExam",
        "description": "Community discussions and resource sharing for SSC exam aspirants. (Free)",
        "url": "https://www.reddit.com/r/SSCExam/"
    },
    {
        "type": "discord",
        "title": "SSC Exam Prep",
        "description": "Discord community providing study materials and peer support. (Free)",
        "url": "https://discord.gg/ssc"
    }
],
"ca": [
    {
        "type": "youtube",
        "title": "CA Ravi Taori",
        "description": "Detailed lectures and problem-solving for CA CPT, IPCC, and Final exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/CARaviTaori"
    },
    {
        "type": "youtube",
        "title": "CAclubindia",
        "description": "Lectures, webinars, and exam tips for CA aspirants. (Free and Paid)",
        "url": "https://www.youtube.com/c/CAclubindia"
    },
    {
        "type": "youtube",
        "title": "EDUCBA CA",
        "description": "CA exam coaching videos covering all relevant subjects. (Free and Paid)",
        "url": "https://www.youtube.com/c/EDUCBA"
    },
    {
        "type": "youtube",
        "title": "CA Harsh Roongta",
        "description": "Conceptual clarity and exam strategy videos for CA exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/CAHarshRoongta"
    },
    {
        "type": "youtube",
        "title": "CA Parveen Sharma",
        "description": "Simplified CA foundation and IPCC subjects lectures. (Free)",
        "url": "https://www.youtube.com/c/CaParveenSharma"
    },
    {
        "type": "book",
        "title": "CA Foundation Kit by ICAI",
        "author": "Institute of Chartered Accountants of India (ICAI)",
        "description": "Official ICAI books for CA foundation exam. (Paid)",
        "url": "https://www.icai.org/"
    },
    {
        "type": "book",
        "title": "Taxmann CA Books",
        "author": "Taxmann Publication",
        "description": "Comprehensive books for CA taxation and law. (Paid)",
        "url": "https://www.taxmann.com/"
    },
    {
        "type": "book",
        "title": "V.K. Gaba CA Final Accounts",
        "author": "V.K. Gaba",
        "description": "Popular CA final accounts textbook. (Paid)",
        "url": "https://internationalbookhouse.in/store/author/7861/v-k-gaba"
    },
    {
        "type": "book",
        "title": "M P Vijaykumar CA Final Costing",
        "author": "M P Vijaykumar",
        "description": "Costing and financial management guide for CA aspirants. (Paid)",
        "url": "https://www.amazon.in/Cost-Management-CA-Final-Vijaykumar/dp/B098QZ64MS"
    },
    {
        "type": "course",
        "title": "CA Foundation Online Classes",
        "provider": "SuperProfs",
        "description": "Video lectures for CA Foundation and other levels. (Paid)",
        "url": "https://superprofs.com/ca-foundation/"
    },
    {
        "type": "course",
        "title": "CA Final Preparation",
        "provider": "EduPristine",
        "description": "Structured classes and test series for CA final exams. (Paid)",
        "url": "https://www.edupristine.com/ca-training-course"
    },
    {
        "type": "website",
        "title": "ICAI Official Website",
        "description": "Exam dates, syllabus, and official circulars for CA exams. (Free)",
        "url": "https://www.icai.org/"
    },
    {
        "type": "website",
        "title": "CAclubindia",
        "description": "Online forum and resources for CA students. (Free)",
        "url": "https://www.caclubindia.com/"
    },
    {
        "type": "reddit",
        "title": "r/CA_Forum",
        "description": "Community discussing CA exam tips and study materials. (Free)",
        "url": "https://www.reddit.com/r/CA_Forum/"
    }
],
"hsc": [
    {
        "type": "youtube",
        "title": "Marathi Tuition Classes",
        "description": "HSC coaching in all subjects for Maharashtra board exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/MarathiTuitionClasses"
    },
    {
        "type": "youtube",
        "title": "ExamFear",
        "description": "Conceptual videos and exam tips for HSC and other boards. (Free)",
        "url": "https://www.youtube.com/c/ExamFearEducation"
    },
    {
        "type": "youtube",
        "title": "Unacademy HSC",
        "description": "Comprehensive preparation for HSC exams with study plans. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyHSC"
    },
    {
        "type": "youtube",
        "title": "Physics Galaxy",
        "description": "Detailed physics lectures ideal for HSC board exams. (Free)",
        "url": "https://www.youtube.com/c/PhysicsGalaxyLectures"
    },
    {
        "type": "youtube",
        "title": "KopyKitab",
        "description": "Study materials, notes, and videos for HSC board exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/KopyKitab"
    },
    {
        "type": "book",
        "title": "HSC Maharashtra Board Textbooks",
        "author": "Maharashtra State Board",
        "description": "Official syllabus books for various subjects. (Free and Paid print)",
        "url": "https://mahahsscboard.in/"
    },
    {
        "type": "book",
        "title": "HSC Maths Standard",
        "author": "Prachi Publications",
        "description": "Popular guide for Maharashtra HSC Mathematics standard level. (Paid)",
        "url": "https://www.amazon.in/Prachi-HSC-Paper-Maths-Standard/dp/B08N26G7R6"
    },
    {
        "type": "book",
        "title": "HSC Biology",
        "author": "Pradeep Publication",
        "description": "Detailed biology textbook and practice guide. (Paid)",
        "url": "https://www.amazon.in/Pradeep-Biology-Class/dp/B00724ZIYM"
    },
    {
        "type": "book",
        "title": "HSC Physics",
        "author": "S. Chand Publication",
        "description": "Physics theory and numerical problems for HSC students. (Paid)",
        "url": "https://www.amazon.in/Physics-Textbook-Class-S-Chand/dp/8121929632"
    },
    {
        "type": "course",
        "title": "HSC Board Exam Prep",
        "provider": "Unacademy Marathi",
        "description": "Live classes and guidance for Maharashtra HSC exam preparation. (Free and Paid)",
        "url": "https://unacademy.com/unacademy-marathi"
    },
    {
        "type": "course",
        "title": "HSC Online Coaching Classes",
        "provider": "KopyKitab",
        "description": "Interactive lessons and practice for Maharashtra HSC syllabus. (Paid)",
        "url": "https://www.kopykitab.com/"
    },
    {
        "type": "website",
        "title": "Maharashtra State Board",
        "description": "Official site for syllabus, exam dates, and resources. (Free)",
        "url": "https://mahahsscboard.in/"
    },
    {
        "type": "website",
        "title": "Examfear",
        "description": "Free study materials and video lessons for HSC exams. (Free)",
        "url": "https://www.examfear.com/"
    },
    {
        "type": "reddit",
        "title": "r/IndianEducation",
        "description": "General education discussions, including HSC exam tips. (Free)",
        "url": "https://www.reddit.com/r/IndianEducation/"
    },
    {
        "type": "discord",
        "title": "HSC Exam Prep",
        "description": "Community for HSC students to share study resources. (Free)",
        "url": "https://discord.gg/hscprep"
    }
],
"banking exams": [
    {
        "type": "youtube",
        "title": "Adda247 Bank",
        "description": "Comprehensive coaching for banking exams like IBPS, SBI, RBI including reasoning and quant. (Free and Paid)",
        "url": "https://www.youtube.com/c/Adda247Bank"
    },
    {
        "type": "youtube",
        "title": "Bankersadda",
        "description": "Daily current affairs, quant, reasoning, and English tutorials for banking exams. (Free)",
        "url": "https://www.youtube.com/c/Bankersadda"
    },
    {
        "type": "youtube",
        "title": "Study IQ Bank",
        "description": "Detailed lectures and preparation tips for banking aspirants. (Free and Paid)",
        "url": "https://www.youtube.com/c/StudyIQBank"
    },
    {
        "type": "youtube",
        "title": "Oliveboard Bank Exam Preparation",
        "description": "Mock tests, live classes, and study planning for banking exams. (Free and Paid)",
        "url": "https://www.youtube.com/c/Oliveboard"
    },
    {
        "type": "youtube",
        "title": "Gradeup Bank Exam",
        "description": "Banking preparation tips, quizzes, and live test series. (Free and Paid)",
        "url": "https://www.youtube.com/c/GradeupEdu"
    },
    {
        "type": "book",
        "title": "Quantitative Aptitude for Bank Exams",
        "author": "R.S. Aggarwal",
        "description": "Extensive practice book for quantitative section of banking exams. (Paid)",
        "url": "https://www.amazon.in/Quantitative-Aptitude-Bank-Exams-Aggarwal/dp/818679973X"
    },
    {
        "type": "book",
        "title": "Objective English for Bank Exams",
        "author": "S.P. Bakshi",
        "description": "English language skills for bank exam aspirants. (Paid)",
        "url": "https://www.amazon.in/Objective-English-Bank-S-P-Bakshi/dp/8183618079"
    },
    {
        "type": "book",
        "title": "A Modern Approach to Verbal & Non-Verbal Reasoning",
        "author": "R.S. Aggarwal",
        "description": "Reasoning concepts and practice for banking and competitive exams. (Paid)",
        "url": "https://www.amazon.in/Modern-Approach-Verbal-Non-Verbal-Reasoning/dp/818679973X"
    },
    {
        "type": "book",
        "title": "Banking Awareness",
        "author": "Arihant Experts",
        "description": "Current affairs and banking knowledge book for exams. (Paid)",
        "url": "https://www.amazon.in/Banking-Awareness-Arihant-Experts/dp/9391399267"
    },
    {
        "type": "course",
        "title": "Banking Exam Preparation",
        "provider": "Adda247",
        "description": "Live classes and test series for all major banking exams. (Free and Paid)",
        "url": "https://www.adda247.com/banking"
    },
    {
        "type": "course",
        "title": "Oliveboard Bank Exam Course",
        "provider": "Oliveboard",
        "description": "Online study materials and mock tests. (Paid)",
        "url": "https://www.oliveboard.in/banking-exam-preparation/"
    },
    {
        "type": "website",
        "title": "IBPS Official",
        "description": "Official notifications, syllabus, and exam details for IBPS exams. (Free)",
        "url": "https://www.ibps.in/"
    },
    {
        "type": "website",
        "title": "SBI Clerk & PO Official",
        "description": "State Bank of India official exam updates and information. (Free)",
        "url": "https://sbi.co.in/web/careers/current-openings"
    },
    {
        "type": "reddit",
        "title": "r/BankingPrep",
        "description": "Community offering tips, study plans, and resources for banking exams. (Free)",
        "url": "https://www.reddit.com/r/BankingPrep/"
    },
    {
        "type": "discord",
        "title": "Banking Exam Preparation",
        "description": "Active Discord group for discussions and resource sharing. (Free)",
        "url": "https://discord.gg/banking"
    }
],
"xat": [
    {
        "type": "youtube",
        "title": "XAT Exam Preparation",
        "description": "Focused tutorials on XAT exam strategy and key sections. (Free and Paid)",
        "url": "https://www.youtube.com/c/XATExamPreparation"
    },
    {
        "type": "youtube",
        "title": "Handa Ka Funda XAT",
        "description": "Quant, verbal, and LRDI preparation specifically for XAT. (Free)",
        "url": "https://www.youtube.com/c/HandaKaFunda"
    },
    {
        "type": "youtube",
        "title": "Career Launcher XAT",
        "description": "XAT coaching with subject-wise lessons and mock tests. (Paid)",
        "url": "https://www.youtube.com/c/CareerLauncher"
    },
    {
        "type": "book",
        "title": "XAT Solved Papers",
        "author": "Arihant Experts",
        "description": "Previous years' solved XAT question papers. (Paid)",
        "url": "https://www.amazon.in/XAT-Solved-Papers-Arihant-Experts/dp/9313122201"
    },
    {
        "type": "book",
        "title": "Verbal Ability for XAT",
        "author": "Arun Sharma",
        "description": "Focused guide on verbal section for XAT. (Paid)",
        "url": "https://www.amazon.in/Verbal-Ability-xat-Arun-Sharma/dp/9352609733"
    },
    {
        "type": "course",
        "title": "XAT Complete Course",
        "provider": "Career Launcher",
        "description": "Extensive online coaching for XAT exam preparation. (Paid)",
        "url": "https://www.careerlauncher.com/xat/"
    },
    {
        "type": "website",
        "title": "XLRI XAT Official",
        "description": "Official exam details, syllabus, and updates for XAT. (Free)",
        "url": "https://xatonline.in/"
    },
    {
        "type": "website",
        "title": "Pagalguy XAT",
        "description": "Forum and resources for XAT aspirants. (Free)",
        "url": "https://www.pagalguy.com/xat"
    },
    {
        "type": "reddit",
        "title": "r/XAT",
        "description": "Discussion forum for XAT preparation tips and advice. (Free)",
        "url": "https://www.reddit.com/r/XAT/"
    },
    {
        "type": "discord",
        "title": "XAT Prep",
        "description": "Discord server for peer learning and doubt clearing for XAT. (Free)",
        "url": "https://discord.gg/xatprep"
    }
],
"mat": [
    {
        "type": "youtube",
        "title": "Handa Ka Funda MAT Preparation",
        "description": "Detailed videos for MAT exam preparation including reasoning and quant sections. (Free)",
        "url": "https://www.youtube.com/c/HandaKaFunda"
    },
    {
        "type": "youtube",
        "title": "Career Launcher MAT",
        "description": "MAT coaching videos, tips, and practice sessions. (Paid)",
        "url": "https://www.youtube.com/c/CareerLauncher"
    },
    {
        "type": "youtube",
        "title": "IMS MAT Preparation",
        "description": "Focused tutorials and strategies for MAT exam sections. (Paid)",
        "url": "https://www.youtube.com/c/IMSIndiaLtd"
    },
    {
        "type": "book",
        "title": "MAT Exam Guide",
        "author": "Arihant Experts",
        "description": "Comprehensive book covering MAT syllabus and mock tests. (Paid)",
        "url": "https://www.amazon.in/MAT-Exam-Guide-Arihant-Experts/dp/931312390X"
    },
    {
        "type": "book",
        "title": "Quantitative Aptitude for MAT",
        "author": "R.S. Aggarwal",
        "description": "Practice book for quant section of MAT. (Paid)",
        "url": "https://www.amazon.in/Quantitative-Aptitude-Competitive-Examinations-Aggarwal/dp/818679973X"
    },
    {
        "type": "course",
        "title": "MAT Online Coaching",
        "provider": "Career Launcher",
        "description": "Live and recorded classes for MAT preparation. (Paid)",
        "url": "https://www.careerlauncher.com/mat/"
    },
    {
        "type": "website",
        "title": "AIMA MAT Official",
        "description": "Official exam notifications, syllabus, and admit cards. (Free)",
        "url": "https://www.aima.in/tests/mat.html"
    },
    {
        "type": "website",
        "title": "Pagalguy MAT",
        "description": "Community and preparation material for MAT aspirants. (Free)",
        "url": "https://www.pagalguy.com/mat"
    },
    {
        "type": "reddit",
        "title": "r/MATExam",
        "description": "Subreddit for MAT exam tips and peer support. (Free)",
        "url": "https://www.reddit.com/r/MATExam/"
    }
],
"lsat": [
    {
        "type": "youtube",
        "title": "LSAT Uncovered",
        "description": "LSAT prep strategies, question breakdowns, and tips. (Free and Paid)",
        "url": "https://www.youtube.com/c/LSATUncovered"
    },
    {
        "type": "youtube",
        "title": "7Sage LSAT Prep",
        "description": "Logical reasoning and analytical reasoning LSAT tutorials. (Free and Paid)",
        "url": "https://www.youtube.com/c/7SageLSATPrep"
    },
    {
        "type": "youtube",
        "title": "Manhattan Prep LSAT",
        "description": "Expert strategies and practice for all LSAT sections. (Free and Paid)",
        "url": "https://www.youtube.com/c/ManhattanPrep"
    },
    {
        "type": "youtube",
        "title": "PowerScore LSAT",
        "description": "LSAT prep videos focusing on test-taking skills. (Free and Paid)",
        "url": "https://www.youtube.com/c/PowerScoreLSAT"
    },
    {
        "type": "youtube",
        "title": "Varsity Tutors LSAT",
        "description": "Comprehensive LSAT tutoring videos. (Free)",
        "url": "https://www.youtube.com/c/VarsityTutorsLSAT"
    },
    {
        "type": "book",
        "title": "The LSAT Trainer",
        "author": "Mike Kim",
        "description": "Highly rated guide for LSAT preparation strategies. (Paid)",
        "url": "https://www.amazon.com/LSAT-Trainer-Mike-Kim/dp/0997795702"
    },
    {
        "type": "book",
        "title": "10 Actual, Official LSAT PrepTests",
        "author": "LSAC",
        "description": "Official LSAT practice tests. (Paid)",
        "url": "https://www.lsac.org/lsat/prep"
    },
    {
        "type": "book",
        "title": "PowerScore LSAT Logic Games Bible",
        "author": "David M. Killoran",
        "description": "Comprehensive guide for LSAT logic games section. (Paid)",
        "url": "https://www.powerscore.com/lsat/help/books/bibles/lg-bible/index.cfm"
    },
    {
        "type": "book",
        "title": "Kaplan LSAT Prep Plus",
        "author": "Kaplan",
        "description": "Includes practice tests and strategies for LSAT. (Paid)",
        "url": "https://www.kaptest.com/lsat"
    },
    {
        "type": "course",
        "title": "7Sage LSAT Course",
        "provider": "7Sage",
        "description": "Online LSAT preparation course with videos and practice problems. (Paid)",
        "url": "https://7sage.com/"
    },
    {
        "type": "course",
        "title": "Manhattan Prep LSAT",
        "provider": "Manhattan Prep",
        "description": "Online and in-person classes for LSAT exam preparation. (Paid)",
        "url": "https://www.manhattanprep.com/lsat/"
    },
    {
        "type": "website",
        "title": "LSAC Official Website",
        "description": "Official information, registration, and prep materials for LSAT. (Free)",
        "url": "https://www.lsac.org/"
    },
    {
        "type": "website",
        "title": "7Sage",
        "description": "LSAT prep platform with a large question database and solutions. (Paid)",
        "url": "https://7sage.com/"
    },
    {
        "type": "reddit",
        "title": "r/LSAT",
        "description": "Community focused on LSAT prep and law school admissions. (Free)",
        "url": "https://www.reddit.com/r/LSAT/"
    },
    {
        "type": "discord",
        "title": "LSAT Prep",
        "description": "Active Discord server for LSAT aspirants sharing tips and resources. (Free)",
        "url": "https://discord.gg/lsat"
    }
],
"nda": [
    {
        "type": "youtube",
        "title": "NDA Study Circle",
        "description": "Focused NDA exam preparation including physics, maths, and general knowledge. (Free)",
        "url": "https://www.youtube.com/c/NDAStudyCircle"
    },
    {
        "type": "youtube",
        "title": "Sudarshan NDA Academy",
        "description": "Complete NDA preparation tutorials and exam strategy. (Free and Paid)",
        "url": "https://www.youtube.com/c/SudarshanNDACademy"
    },
    {
        "type": "youtube",
        "title": "Unacademy NDA",
        "description": "Live classes and recorded tutorials for NDA entrance exam preparation. (Free and Paid)",
        "url": "https://www.youtube.com/c/UnacademyNDA"
    },
    {
        "type": "youtube",
        "title": "Defence Adda",
        "description": "Defence exam preparation including NDA test tips and practice sessions. (Free and Paid)",
        "url": "https://www.youtube.com/c/DefenceAdda"
    },
    {
        "type": "youtube",
        "title": "NDA Guru",
        "description": "Focused NDA exam guidance and question solutions. (Free)",
        "url": "https://www.youtube.com/c/NDAGuru"
    },
    {
        "type": "book",
        "title": "Pathfinder for NDA & NA",
        "author": "Arihant Experts",
        "description": "Comprehensive guide for NDA & Naval Academy exams. (Paid)",
        "url": "https://www.amazon.in/Pathfinder-NDA-Naval-Academy-Arihant/dp/8194732925"
    },
    {
        "type": "book",
        "title": "NDA/NA Entrance Exam Guide",
        "author": "R. Gupta",
        "description": "Subject-wise preparation material for NDA aptitude test. (Paid)",
        "url": "https://www.amazon.in/NDA-Entrance-Exam-Guide-Mathematics/dp/8182091015"
    },
    {
        "type": "book",
        "title": "General Knowledge Capsule for NDA",
        "author": "Disha Experts",
        "description": "Quick revision for general knowledge section of NDA. (Paid)",
        "url": "https://www.amazon.in/General-Knowledge-Capsule-Examinations/dp/9390023910"
    },
    {
        "type": "book",
        "title": "Mathematics for NDA & NA",
        "author": "R.S. Aggarwal",
        "description": "Popular maths practice book for NDA exam. (Paid)",
        "url": "https://www.amazon.in/Mathematics-NDA-R-S-Aggarwal/dp/8186799949"
    },
    {
        "type": "book",
        "title": "English for NDA & NA",
        "author": "S. P. Bakshi",
        "description": "English language preparation for NDA exams. (Paid)",
        "url": "https://www.amazon.in/English-NDA-NA-SP-Bakshi/dp/8183617160"
    },
    {
        "type": "course",
        "title": "NDA Crash Course",
        "provider": "Adda247",
        "description": "Fast-track online coaching and test series for NDA exam. (Paid)",
        "url": "https://www.adda247.com/nda"
    },
    {
        "type": "course",
        "title": "Unacademy NDA Preparation",
        "provider": "Unacademy",
        "description": "Live classes and quizzes focused on NDA entrance syllabus. (Free and Paid)",
        "url": "https://unacademy.com/exam/nda"
    },
    {
        "type": "course",
        "title": "NDA Online Coaching",
        "provider": "Gradeup",
        "description": "Video lectures and mock tests for NDA exam preparation. (Free and Paid)",
        "url": "https://gradeup.co/nda"
    },
    {
        "type": "website",
        "title": "Join Indian Army NDA Official",
        "description": "Official portal for NDA exam notifications, results, and syllabus. (Free)",
        "url": "https://joinindianarmy.nic.in/"
    },
    {
        "type": "website",
        "title": "NDA Exam Preparation Portal",
        "description": "Study materials, mock tests, and preparation tips for NDA. (Free and Paid)",
        "url": "https://www.ndaexam.com/"
    },
    {
        "type": "reddit",
        "title": "r/NDAExam",
        "description": "Community for NDA aspirants to discuss strategies and resources. (Free)",
        "url": "https://www.reddit.com/r/NDAExam/"
    },
    {
        "type": "discord",
        "title": "NDA Preparation",
        "description": "Discord group offering peer support and study materials for NDA exam. (Free)",
        "url": "https://discord.gg/nda"
    }
]

  // Add more topics with curated recommendations
};

// Fetch recommendations
export async function fetchRecommendations(query: string): Promise<Recommendation[]> {
  const lowerQuery = query.toLowerCase();

  // Return curated if available
  if (curatedResources[lowerQuery]) {
    return curatedResources[lowerQuery];
  }

  // If topic not allowed, return empty
  if (!allowedTopics.includes(lowerQuery)) {
    return [];
  }

  const recommendations: Recommendation[] = [];

  // 1️⃣ Fetch top YouTube channels (fallback)
  try {
    const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        type: "channel",
        order: "relevance", // most relevant channels
        maxResults: 5
      },
    });

    ytRes.data.items.forEach((item: any) => {
      recommendations.push({
        type: "youtube",
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/channel/${item.id.channelId}`
      });
    });
  } catch (error) {
    console.error("YouTube API Error:", error);
  }

  // 2️⃣ Fetch Google Books (fallback)
  try {
    const booksRes = await axios.get(GOOGLE_BOOKS_API, {
      params: { q: query, maxResults: 5 }
    });

    booksRes.data.items?.forEach((item: any) => {
      recommendations.push({
        type: "book",
        title: item.volumeInfo.title,
        description: item.volumeInfo.description,
        author: item.volumeInfo.authors?.join(", "),
        url: item.volumeInfo.infoLink,
        rating: item.volumeInfo.averageRating
      });
    });
  } catch (error) {
    console.error("Google Books API Error:", error);
  }

  // 3️⃣ Optional: You can integrate other APIs (Udemy, Reddit, Discord) for real-time recommendations

  return recommendations;
}

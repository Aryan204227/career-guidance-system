const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');
const Career = require('./models/Career');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/career_guidance')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const questions = [
  // Logical
  { category: 'Logical', difficulty: 'Easy', questionText: 'What comes next in the sequence: 2, 4, 8, 16, ?', options: ['24', '32', '64', '20'], correctAnswer: '32', explanation: 'The sequence doubles each time. 16 * 2 = 32.' },
  { category: 'Logical', difficulty: 'Medium', questionText: 'If all cats are animals, and some animals are pets, are all cats pets?', options: ['Yes', 'No', 'Maybe', 'Cannot Determine'], correctAnswer: 'Cannot Determine', explanation: 'The statements do not provide enough overlap to definitively say all cats are pets.' },
  { category: 'Logical', difficulty: 'Hard', questionText: 'Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?', options: ['7', '10', '12', '13'], correctAnswer: '10', explanation: 'This is a simple alternating addition and subtraction series. First, 3 is added, then 2 is subtracted.' },
  { category: 'Logical', difficulty: 'Medium', questionText: 'Which word does NOT belong with the others?', options: ['Parsley', 'Basil', 'Dill', 'Mayonnaise'], correctAnswer: 'Mayonnaise', explanation: 'Parsley, basil, and dill are types of herbs. Mayonnaise is not an herb.' },
  { category: 'Logical', difficulty: 'Hard', questionText: 'If A is the brother of B; B is the sister of C; and C is the father of D, how D is related to A?', options: ['Brother', 'Sister', 'Nephew', 'Cannot be determined'], correctAnswer: 'Cannot be determined', explanation: 'Since the gender of D is not given, we cannot say whether D is a nephew or niece.' },
  
  // Analytical
  { category: 'Analytical', difficulty: 'Easy', questionText: 'If a train travels 60 miles in 1 hour, how far will it travel in 2.5 hours?', options: ['120 miles', '150 miles', '180 miles', '90 miles'], correctAnswer: '150 miles', explanation: 'Distance = Speed * Time. 60 * 2.5 = 150 miles.' },
  { category: 'Analytical', difficulty: 'Medium', questionText: 'If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', options: ['5 minutes', '100 minutes', '50 minutes', '1 minute'], correctAnswer: '5 minutes', explanation: 'It takes exactly 1 machine 5 minutes to make 1 widget. Thus, 100 machines working in parallel take 5 minutes.' },
  { category: 'Analytical', difficulty: 'Hard', questionText: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$0.15', '$1.00'], correctAnswer: '$0.05', explanation: 'Ball = x. Bat = x + 1. x + (x + 1) = 1.10 -> 2x = 0.10 -> x = $0.05.' },
  { category: 'Analytical', difficulty: 'Medium', questionText: 'A factory produces 400 cars per day. If efficiency increases by 15%, how many cars will it produce?', options: ['415', '460', '500', '480'], correctAnswer: '460', explanation: '15% of 400 is 60. 400 + 60 = 460.' },
  { category: 'Analytical', difficulty: 'Hard', questionText: 'If it takes 8 men 10 days to build a wall, how many days would it take 4 men to build the same wall?', options: ['5 days', '10 days', '20 days', '15 days'], correctAnswer: '20 days', explanation: 'Work = Men * Days. 8 * 10 = 80 man-days. For 4 men: 80 / 4 = 20 days.' },

  // Verbal
  { category: 'Verbal', difficulty: 'Easy', questionText: 'Choose the synonym for "Eloquent"', options: ['Silent', 'Articulate', 'Messy', 'Strong'], correctAnswer: 'Articulate', explanation: 'Eloquent means fluent or persuasive in speaking or writing, which is synonymous with articulate.' },
  { category: 'Verbal', difficulty: 'Medium', questionText: 'Which is the antonym of "Obscure"?', options: ['Hidden', 'Clear', 'Dark', 'Complex'], correctAnswer: 'Clear', explanation: 'Obscure means not discovered or known about; uncertain. The opposite is Clear.' },
  { category: 'Verbal', difficulty: 'Medium', questionText: 'Identify the correctly spelled word.', options: ['Accommodate', 'Acommodate', 'Accomodate', 'Acomodate'], correctAnswer: 'Accommodate', explanation: 'The correct spelling is Accommodate (two Cs, two Ms).' },
  { category: 'Verbal', difficulty: 'Hard', questionText: 'Choose the word that best fits: The politician’s speech was so ____ that the audience was captivated.', options: ['Mundane', 'Riveting', 'Tedious', 'Vapid'], correctAnswer: 'Riveting', explanation: 'Riveting means completely engrossing or compelling, which fits a captivating speech.' },
  { category: 'Verbal', difficulty: 'Hard', questionText: 'What does the idiom "Bite the bullet" mean?', options: ['To endure a painful situation', 'To act aggressively', 'To avoid a problem', 'To speak harshly'], correctAnswer: 'To endure a painful situation', explanation: 'Bite the bullet means to force yourself to do something difficult or unpleasant.' },

  // Technical
  { category: 'Technical', difficulty: 'Easy', questionText: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctAnswer: 'Stack', explanation: 'LIFO stands for Last In, First Out, which is the defining characteristic of a Stack.' },
  { category: 'Technical', difficulty: 'Medium', questionText: 'Which algorithm is used to find the shortest path in a graph?', options: ['Bubble Sort', 'Dijkstra', 'Binary Search', 'DFS'], correctAnswer: 'Dijkstra', explanation: "Dijkstra's algorithm is specifically designed to find the shortest path between nodes in a graph." },
  { category: 'Technical', difficulty: 'Hard', questionText: 'What is the time complexity of Binary Search?', options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'], correctAnswer: 'O(log N)', explanation: 'Binary search halves the search space at each step, resulting in logarithmic time complexity.' },
  { category: 'Technical', difficulty: 'Medium', questionText: 'In relational databases, what does ACID stand for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Computing, Integration, Data', 'Array, Code, Int, Double', 'None of the above'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability', explanation: 'ACID refers to the set of properties that guarantee database transactions are processed reliably.' },
  { category: 'Technical', difficulty: 'Hard', questionText: 'What is the purpose of a Docker container?', options: ['To create virtual machines', 'To package applications with their dependencies', 'To write code', 'To manage databases'], correctAnswer: 'To package applications with their dependencies', explanation: 'Containers isolate software from its environment and ensure it works uniformly.' }
];

const careers = [
  {
    title: 'Software Engineer',
    description: 'Software Engineers architect, develop, and maintain robust software systems. You will solve complex computational problems and build applications that serve millions of users.',
    skills: ['Algorithms', 'System Architecture', 'Data Structures', 'Version Control'],
    tools: ['Git', 'VS Code', 'Docker', 'AWS', 'Kubernetes'],
    weights: { Logical: 0.30, Analytical: 0.20, Verbal: 0.05, Technical: 0.45 },
    salary: { fresher: '₹6,00,000', experienced: '₹25,00,000+' },
    futureScope: 'Extremely high demand driven by the global transition to cloud computing, AI integrations, and mobile-first businesses.',
    roadmap: [
      { step: 'Class 10', description: 'Focus heavily on Mathematics and start learning basic programming (Python/C++).' },
      { step: 'Stream', description: 'Science with PCM (Physics, Chemistry, Math).' },
      { step: 'Entrance Exams', description: 'JEE Main, JEE Advanced, BITSAT.' },
      { step: 'Degree', description: 'B.Tech in Computer Science or Information Technology.' },
      { step: 'Skills', description: 'Master Data Structures, Algorithms, and System Design.' },
      { step: 'Job', description: 'Join a tech firm as a Junior Developer or SDE I, focusing on code quality and debugging.' }
    ]
  },
  {
    title: 'AI / ML Engineer',
    description: 'AI/ML Engineers build and train predictive models and neural networks. You will enable machines to learn from data and perform tasks that typically require human intelligence.',
    skills: ['Statistical Modeling', 'Deep Learning', 'Calculus & Linear Algebra', 'Natural Language Processing'],
    tools: ['TensorFlow', 'PyTorch', 'Jupyter', 'Scikit-Learn', 'Pandas'],
    weights: { Logical: 0.25, Analytical: 0.35, Verbal: 0.05, Technical: 0.35 },
    salary: { fresher: '₹8,00,000', experienced: '₹35,00,000+' },
    futureScope: 'Unprecedented growth. AI is revolutionizing healthcare, finance, automotive, and practically every major sector.',
    roadmap: [
      { step: 'Class 10', description: 'Master advanced Mathematics (Calculus, Probability, Matrices).' },
      { step: 'Stream', description: 'Science with PCM.' },
      { step: 'Entrance Exams', description: 'JEE Main/Advanced.' },
      { step: 'Degree', description: 'B.Tech in CSE with a specialization in Artificial Intelligence, or a degree in Statistics/Mathematics.' },
      { step: 'Skills', description: 'Participate in Kaggle competitions and publish research papers on neural networks.' },
      { step: 'Job', description: 'Join as an ML Researcher or Junior AI Engineer focusing on data pipelines and model tuning.' }
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Cybersecurity Analysts protect networks, systems, and data from digital attacks. You will monitor security breaches, investigate violations, and implement defensive protocols.',
    skills: ['Network Security', 'Cryptography', 'Risk Management', 'Penetration Testing'],
    tools: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Splunk'],
    weights: { Logical: 0.35, Analytical: 0.20, Verbal: 0.05, Technical: 0.40 },
    salary: { fresher: '₹5,00,000', experienced: '₹20,00,000+' },
    futureScope: 'Critical necessity. As cyber threats become more sophisticated, governments and corporations are exponentially increasing security budgets.',
    roadmap: [
      { step: 'Class 10', description: 'Learn the fundamentals of computer hardware and operating systems (Linux).' },
      { step: 'Stream', description: 'Science with PCM.' },
      { step: 'Entrance Exams', description: 'JEE Main, State CETs.' },
      { step: 'Degree', description: 'B.Tech in CSE/IT.' },
      { step: 'Skills', description: 'Clear the Certified Ethical Hacker (CEH) or CompTIA Security+ exams.' },
      { step: 'Job', description: 'Start as a Security Operations Center (SOC) Analyst monitoring network traffic.' }
    ]
  },
  {
    title: 'Data Scientist',
    description: 'Data Scientists extract actionable insights from raw data. You will clean datasets, build predictive models, and help businesses make data-driven strategic decisions.',
    skills: ['Data Wrangling', 'Machine Learning', 'Data Visualization', 'Hypothesis Testing'],
    tools: ['Python', 'SQL', 'Tableau', 'Apache Spark', 'Excel'],
    weights: { Logical: 0.20, Analytical: 0.45, Verbal: 0.05, Technical: 0.30 },
    salary: { fresher: '₹7,00,000', experienced: '₹30,00,000+' },
    futureScope: 'Very strong. Data is the new oil, and companies rely entirely on data science to optimize pricing, logistics, and user experience.',
    roadmap: [
      { step: 'Class 10', description: 'Develop a strong foundation in Probability and Statistics.' },
      { step: 'Stream', description: 'Science with PCM or Commerce with Core Math.' },
      { step: 'Entrance Exams', description: 'University specific entrances or JEE.' },
      { step: 'Degree', description: 'B.Tech, B.Sc in Statistics, or Data Science.' },
      { step: 'Skills', description: 'Analyze public datasets and build dashboards to showcase your findings.' },
      { step: 'Job', description: 'Enter the industry as a Data Analyst or Junior Data Scientist.' }
    ]
  },
  {
    title: 'Web Developer',
    description: 'Web Developers create and maintain websites and web applications. You will handle frontend interfaces, backend logic, and database management.',
    skills: ['Responsive Design', 'API Integration', 'Database Management', 'Client-side Routing'],
    tools: ['React.js', 'Node.js', 'MongoDB', 'Figma', 'Postman'],
    weights: { Logical: 0.20, Analytical: 0.15, Verbal: 0.15, Technical: 0.50 },
    salary: { fresher: '₹4,00,000', experienced: '₹18,00,000+' },
    futureScope: 'Stable and evolving. The shift towards Progressive Web Apps (PWAs) and Web3 ensures constant demand for web engineers.',
    roadmap: [
      { step: 'Class 10', description: 'Learn the core building blocks: HTML, CSS, and basic JavaScript.' },
      { step: 'Stream', description: 'Any stream (PCM preferred).' },
      { step: 'Entrance Exams', description: 'CUET, State CETs, JEE.' },
      { step: 'Degree', description: 'B.Tech, BCA, or even self-taught pathways via coding bootcamps.' },
      { step: 'Skills', description: 'Build and deploy complete e-commerce or social media clones.' },
      { step: 'Job', description: 'Join as a Frontend or Backend Developer at a startup or IT agency.' }
    ]
  },
  {
    title: 'Cloud / DevOps Engineer',
    description: 'DevOps Engineers bridge the gap between software development and IT operations. You will automate deployment pipelines and manage scalable cloud infrastructure.',
    skills: ['CI/CD Automation', 'Infrastructure as Code (IaC)', 'Cloud Architecture', 'Linux Administration'],
    tools: ['AWS/Azure', 'Jenkins', 'Terraform', 'Docker', 'Linux'],
    weights: { Logical: 0.25, Analytical: 0.25, Verbal: 0.05, Technical: 0.45 },
    salary: { fresher: '₹7,00,000', experienced: '₹28,00,000+' },
    futureScope: 'Massive growth. Every company is migrating to the cloud, making DevOps the backbone of modern software delivery.',
    roadmap: [
      { step: 'Class 10', description: 'Master Linux operating system internals and shell scripting.' },
      { step: 'Stream', description: 'Science with PCM.' },
      { step: 'Entrance Exams', description: 'JEE Main.' },
      { step: 'Degree', description: 'B.Tech in CSE or IT. Understand how web servers and databases operate at scale.' },
      { step: 'Skills', description: 'Obtain AWS Solutions Architect or Azure Fundamentals certifications.' },
      { step: 'Job', description: 'Start as a Cloud Support Associate or Junior DevOps Engineer.' }
    ]
  },
  {
    title: 'Business Analyst',
    description: 'Business Analysts analyze an organization’s operations and document processes. You will identify business problems and propose data-driven, technological solutions.',
    skills: ['Requirement Gathering', 'Process Modeling', 'Stakeholder Management', 'Data Analysis'],
    tools: ['JIRA', 'Microsoft Visio', 'Excel', 'PowerBI', 'Confluence'],
    weights: { Logical: 0.25, Analytical: 0.40, Verbal: 0.25, Technical: 0.10 },
    salary: { fresher: '₹5,00,000', experienced: '₹15,00,000+' },
    futureScope: 'Consistent demand. Organizations continually need analysts to bridge the gap between business requirements and technical execution.',
    roadmap: [
      { step: 'Class 10', description: 'Focus on business studies, economics, and mathematics.' },
      { step: 'Stream', description: 'Commerce or Science stream.' },
      { step: 'Entrance Exams', description: 'CUET, IPMAT.' },
      { step: 'Degree', description: 'BBA, B.Com, or B.Tech, ideally followed by an MBA.' },
      { step: 'Skills', description: 'Learn SQL and data visualization tools to support your business arguments.' },
      { step: 'Job', description: 'Join an IT or consulting firm as a Junior Business Analyst.' }
    ]
  },
  {
    title: 'Financial Analyst',
    description: 'Financial Analysts evaluate investment opportunities and business performance. You will build financial models, forecast revenues, and guide corporate strategy.',
    skills: ['Financial Modeling', 'Valuation', 'Risk Assessment', 'Accounting Principles'],
    tools: ['Advanced Excel', 'Bloomberg Terminal', 'ERP Software', 'Python (for quantitative finance)'],
    weights: { Logical: 0.35, Analytical: 0.45, Verbal: 0.15, Technical: 0.05 },
    salary: { fresher: '₹6,00,000', experienced: '₹20,00,000+' },
    futureScope: 'Highly lucrative. Investment banks, hedge funds, and corporate finance departments rely on analysts to maximize capital returns.',
    roadmap: [
      { step: 'Class 10', description: 'Master Accountancy, Economics, and Financial Mathematics.' },
      { step: 'Stream', description: 'Commerce stream (with Math).' },
      { step: 'Entrance Exams', description: 'CUET.' },
      { step: 'Degree', description: 'B.Com (Hons), BBA (Finance), or Economics.' },
      { step: 'Skills', description: 'Enroll in the Chartered Financial Analyst (CFA) program and clear Level 1.' },
      { step: 'Job', description: 'Join an investment bank or equity research firm as a Junior Analyst.' }
    ]
  },
  {
    title: 'Product Manager',
    description: 'Product Managers oversee the lifecycle of a product from ideation to launch. You will define product vision, prioritize features, and align engineering with business goals.',
    skills: ['Product Strategy', 'User Research', 'Agile Methodologies', 'Cross-functional Leadership'],
    tools: ['Figma', 'JIRA', 'Mixpanel', 'Notion', 'Google Analytics'],
    weights: { Logical: 0.25, Analytical: 0.30, Verbal: 0.30, Technical: 0.15 },
    salary: { fresher: '₹10,00,000', experienced: '₹35,00,000+' },
    futureScope: 'Explosive growth. Product Managers are the "CEOs of the product" and are highly sought after by tech startups and unicorns.',
    roadmap: [
      { step: 'Class 10', description: 'Gain exposure to both technical concepts and business fundamentals.' },
      { step: 'Stream', description: 'Any stream.' },
      { step: 'Entrance Exams', description: 'JEE / CUET followed by CAT later.' },
      { step: 'Degree', description: 'B.Tech or BBA, highly recommended to follow up with an MBA from a premier institute.' },
      { step: 'Skills', description: 'Work as a software engineer, designer, or business analyst for 2-3 years.' },
      { step: 'Job', description: 'Start as an Associate Product Manager (APM) in a technology company.' }
    ]
  },
  {
    title: 'Management Consultant',
    description: 'Management Consultants solve complex organizational problems. You will advise top executives on strategy, mergers, cost-cutting, and operational efficiency.',
    skills: ['Strategic Frameworks', 'Problem Solving', 'Executive Communication', 'Financial Acumen'],
    tools: ['PowerPoint', 'Excel', 'ThinkCell', 'Tableau'],
    weights: { Logical: 0.25, Analytical: 0.35, Verbal: 0.30, Technical: 0.10 },
    salary: { fresher: '₹12,00,000', experienced: '₹40,00,000+' },
    futureScope: 'Elite and highly competitive. Top global firms (McKinsey, BCG, Bain) constantly recruit sharp analytical minds for high-stakes advisory.',
    roadmap: [
      { step: 'Class 10', description: 'Maintain an impeccable academic record and show leadership in extracurriculars.' },
      { step: 'Stream', description: 'Any stream.' },
      { step: 'Entrance Exams', description: 'CAT, GMAT (post-graduation).' },
      { step: 'Degree', description: 'Degree from a top-tier college (IIT/SRCC/St. Stephen’s), followed by a top-tier MBA (IIMs).' },
      { step: 'Skills', description: 'Participate in consulting clubs and case competitions.' },
      { step: 'Job', description: 'Join a consulting firm as a Business Analyst or Associate.' }
    ]
  },
  {
    title: 'Entrepreneur / Startup Founder',
    description: 'Founders build companies from scratch. You will identify market gaps, build a Minimum Viable Product (MVP), pitch to investors, and scale operations.',
    skills: ['Vision & Leadership', 'Sales & Pitching', 'Resource Management', 'Resilience'],
    tools: ['Lean Canvas', 'Pitch Decks', 'CRM Software', 'Financial Projections'],
    weights: { Logical: 0.25, Analytical: 0.30, Verbal: 0.25, Technical: 0.20 },
    salary: { fresher: '₹0', experienced: 'Highly Variable / Multi-millions' },
    futureScope: 'India has the 3rd largest startup ecosystem globally. Support from VC funds and government initiatives makes it a golden era for founders.',
    roadmap: [
      { step: 'Class 10', description: 'Observe inefficiencies in the market and brainstorm scalable solutions.' },
      { step: 'Stream', description: 'Any stream.' },
      { step: 'Entrance Exams', description: 'None required, though business knowledge helps.' },
      { step: 'Degree', description: 'No strict educational path, though engineering or business degrees are common.' },
      { step: 'Skills', description: 'Talk to potential customers and validate the demand before building anything. Build a basic prototype.' },
      { step: 'Job', description: 'Pitch to angel investors or VCs for seed funding to grow your user base.' }
    ]
  },
  {
    title: 'UI/UX Designer',
    description: 'UI/UX Designers create seamless digital experiences. You will design user interfaces (UI) and ensure the user journey (UX) is intuitive, accessible, and visually appealing.',
    skills: ['Wireframing', 'Prototyping', 'User Research', 'Information Architecture'],
    tools: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Miro'],
    weights: { Logical: 0.15, Analytical: 0.35, Verbal: 0.25, Technical: 0.25 },
    salary: { fresher: '₹5,00,000', experienced: '₹20,00,000+' },
    futureScope: 'Very strong. As software becomes commoditized, superior design and user experience are the primary differentiators for successful apps.',
    roadmap: [
      { step: 'Class 10', description: 'Learn the principles of color theory, typography, and human psychology.' },
      { step: 'Stream', description: 'Any stream.' },
      { step: 'Entrance Exams', description: 'NID DAT, UCEED.' },
      { step: 'Degree', description: 'B.Des (Bachelor of Design) or a degree in Human-Computer Interaction.' },
      { step: 'Skills', description: 'Become highly proficient in Figma. Redesign existing bad apps or create concept apps.' },
      { step: 'Job', description: 'Join an agency or tech startup as a Junior Product Designer.' }
    ]
  },
  {
    title: 'Graphic Designer',
    description: 'Graphic Designers create visual content to communicate messages. You will design logos, marketing materials, packaging, and brand identities.',
    skills: ['Typography', 'Color Theory', 'Branding', 'Layout Design'],
    tools: ['Adobe Illustrator', 'Adobe Photoshop', 'InDesign', 'CorelDRAW'],
    weights: { Logical: 0.15, Analytical: 0.30, Verbal: 0.30, Technical: 0.25 },
    salary: { fresher: '₹3,00,000', experienced: '₹12,00,000+' },
    futureScope: 'Steady demand. Every brand, influencer, and corporation requires continuous visual assets for digital marketing and print media.',
    roadmap: [
      { step: 'Class 10', description: 'Develop your artistic skills. Start sketching and exploring digital art software.' },
      { step: 'Stream', description: 'Arts or Commerce stream preferred.' },
      { step: 'Entrance Exams', description: 'NID DAT, NIFT Entrance.' },
      { step: 'Degree', description: 'BFA (Bachelor of Fine Arts) or a diploma in visual communication.' },
      { step: 'Skills', description: 'Take up small gigs on platforms like Upwork or Fiverr to build a diverse portfolio.' },
      { step: 'Job', description: 'Work at an advertising agency or as an in-house designer for a brand.' }
    ]
  },
  {
    title: 'Content Strategist',
    description: 'Content Strategists plan, write, and manage content. You will align digital content (blogs, copy, videos) with business goals to drive traffic and engagement.',
    skills: ['Copywriting', 'SEO Principles', 'Content Auditing', 'Audience Analytics'],
    tools: ['Google Analytics', 'Ahrefs', 'WordPress', 'Grammarly', 'SEMrush'],
    weights: { Logical: 0.15, Analytical: 0.25, Verbal: 0.50, Technical: 0.10 },
    salary: { fresher: '₹4,00,000', experienced: '₹15,00,000+' },
    futureScope: 'Growing rapidly. Quality content is the core of inbound marketing, and companies heavily invest in strategists to rank higher on search engines.',
    roadmap: [
      { step: 'Class 10', description: 'Read extensively and write daily. Start a personal blog on a topic you love.' },
      { step: 'Stream', description: 'Humanities/Arts stream.' },
      { step: 'Entrance Exams', description: 'CUET for mass communication.' },
      { step: 'Degree', description: 'BA in English, Journalism, or Mass Communication.' },
      { step: 'Skills', description: 'Learn SEO (Search Engine Optimization) and how to write for the web.' },
      { step: 'Job', description: 'Start as a Content Writer or SEO Executive, eventually moving into strategy.' }
    ]
  },
  {
    title: 'Video Editor / Filmmaker',
    description: 'Video Editors and Filmmakers construct narratives through moving images. You will direct, shoot, and edit footage for films, YouTube, and corporate campaigns.',
    skills: ['Storyboarding', 'Color Grading', 'Audio Mixing', 'Visual Pacing'],
    tools: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects'],
    weights: { Logical: 0.15, Analytical: 0.30, Verbal: 0.30, Technical: 0.25 },
    salary: { fresher: '₹3,50,000', experienced: '₹15,00,000+' },
    futureScope: 'Booming. The explosion of OTT platforms (Netflix, Amazon Prime) and the creator economy demands high-quality video production.',
    roadmap: [
      { step: 'Class 10', description: 'Shoot short films using your smartphone. Learn basic editing cuts.' },
      { step: 'Stream', description: 'Any stream (Arts preferred).' },
      { step: 'Entrance Exams', description: 'FTII Entrance, NID DAT.' },
      { step: 'Degree', description: 'Degree in Film Studies, Mass Media, or specialized film school diplomas.' },
      { step: 'Skills', description: 'Edit music videos, short films, or vlogs. Build a showreel highlighting your best work.' },
      { step: 'Job', description: 'Join a production house as an Assistant Editor or work as a freelance videographer.' }
    ]
  },
  {
    title: 'Lawyer / Advocate',
    description: 'Lawyers advise clients and represent them in legal proceedings. You will draft contracts, negotiate settlements, and argue cases in courts of law.',
    skills: ['Legal Drafting', 'Argumentation', 'Statutory Interpretation', 'Negotiation'],
    tools: ['Legal Databases (SCC Online)', 'Case Management Software', 'Drafting Templates'],
    weights: { Logical: 0.35, Analytical: 0.15, Verbal: 0.45, Technical: 0.05 },
    salary: { fresher: '₹4,00,000', experienced: '₹30,00,000+' },
    futureScope: 'Highly stable. Corporate law, intellectual property, and cyber law are experiencing massive growth alongside traditional litigation.',
    roadmap: [
      { step: 'Class 10', description: 'Focus on Political Science and History. Prepare rigorously for the CLAT examination.' },
      { step: 'Stream', description: 'Humanities or Commerce stream.' },
      { step: 'Entrance Exams', description: 'CLAT, AILET, LSAT India.' },
      { step: 'Degree', description: '5-year integrated BA LLB or BBA LLB program at a National Law University (NLU).' },
      { step: 'Skills', description: 'Intern under senior advocates, NGOs, and top-tier corporate law firms (Tier-1).' },
      { step: 'Job', description: 'Clear the All India Bar Examination (AIBE) and join a firm or start litigation practice.' }
    ]
  },
  {
    title: 'Journalist / Author',
    description: 'Journalists report on news and events, while Authors write long-form books. You will research facts, conduct interviews, and craft stories that inform the public.',
    skills: ['Investigative Research', 'Interviewing', 'Fact-Checking', 'Editorial Writing'],
    tools: ['Voice Recorders', 'Publishing CMS', 'Social Media Monitors', 'Word Processors'],
    weights: { Logical: 0.15, Analytical: 0.20, Verbal: 0.55, Technical: 0.10 },
    salary: { fresher: '₹3,00,000', experienced: '₹12,00,000+' },
    futureScope: 'Transforming. Traditional print media is declining, but digital journalism, newsletters (Substack), and independent publishing are thriving.',
    roadmap: [
      { step: 'Class 10', description: 'Read diverse news sources. Participate in school debates and the editorial board.' },
      { step: 'Stream', description: 'Humanities stream.' },
      { step: 'Entrance Exams', description: 'IIMC Entrance, CUET.' },
      { step: 'Degree', description: 'Degree in Journalism, Mass Communication, or English Literature.' },
      { step: 'Skills', description: 'Intern at news channels or digital media outlets. Publish articles regularly.' },
      { step: 'Job', description: 'Start as a Junior Reporter, Desk Editor, or freelance contributor.' }
    ]
  },
  {
    title: 'Human Resources Manager',
    description: 'HR Managers oversee employee relations, recruitment, and organizational culture. You will ensure the company hires the right talent and complies with labor laws.',
    skills: ['Talent Acquisition', 'Conflict Resolution', 'Labor Law Compliance', 'Performance Management'],
    tools: ['Workday', 'BambooHR', 'LinkedIn Recruiter', 'Applicant Tracking Systems (ATS)'],
    weights: { Logical: 0.25, Analytical: 0.20, Verbal: 0.45, Technical: 0.10 },
    salary: { fresher: '₹6,00,000', experienced: '₹25,00,000+' },
    futureScope: 'Crucial function. As companies scale, maintaining a healthy workplace culture and retaining top talent requires skilled HR leadership.',
    roadmap: [
      { step: 'Class 10', description: 'Understand human behavior and develop interpersonal skills.' },
      { step: 'Stream', description: 'Commerce or Humanities.' },
      { step: 'Entrance Exams', description: 'XAT, TISSNET, CAT.' },
      { step: 'Degree', description: 'BBA/BA, followed by an MBA in Human Resource Management (e.g., XLRI, TISS).' },
      { step: 'Skills', description: 'Intern in the HR department of a corporate firm to understand payroll and recruitment.' },
      { step: 'Job', description: 'Join as an HR Generalist or Talent Acquisition Specialist.' }
    ]
  },
  {
    title: 'Marketing Manager',
    description: 'Marketing Managers build brand identity and drive product adoption. You will conduct market research, design campaigns, and manage advertising budgets.',
    skills: ['Market Segmentation', 'Brand Strategy', 'Budgeting', 'Consumer Behavior Analysis'],
    tools: ['Salesforce', 'HubSpot', 'Google Analytics', 'Hootsuite'],
    weights: { Logical: 0.20, Analytical: 0.30, Verbal: 0.35, Technical: 0.15 },
    salary: { fresher: '₹7,00,000', experienced: '₹30,00,000+' },
    futureScope: 'Highly competitive and lucrative. Companies heavily rely on marketing leaders to gain market share in crowded industries.',
    roadmap: [
      { step: 'Class 10', description: 'Learn the fundamentals of marketing, economics, and communication.' },
      { step: 'Stream', description: 'Commerce or Humanities.' },
      { step: 'Entrance Exams', description: 'CAT, XAT, MAT.' },
      { step: 'Degree', description: 'BBA or B.Com, followed by an MBA in Marketing.' },
      { step: 'Skills', description: 'Work in sales or digital marketing to understand ground-level consumer behavior.' },
      { step: 'Job', description: 'Join as an Assistant Brand Manager or Marketing Executive.' }
    ]
  },
  {
    title: 'Research Scientist',
    description: 'Research Scientists conduct controlled experiments to advance knowledge in fields like physics, chemistry, or biology. You will publish findings and develop new technologies.',
    skills: ['Experimental Design', 'Data Analysis', 'Academic Writing', 'Critical Thinking'],
    tools: ['Laboratory Equipment', 'Statistical Software (SPSS/R)', 'Scientific Journals', 'MATLAB'],
    weights: { Logical: 0.35, Analytical: 0.40, Verbal: 0.10, Technical: 0.15 },
    salary: { fresher: '₹6,00,000', experienced: '₹20,00,000+' },
    futureScope: 'Steady and prestigious. Government labs (ISRO, DRDO) and private R&D sectors (pharma, materials) constantly require specialized scientists.',
    roadmap: [
      { step: 'Class 10', description: 'Build a deep conceptual understanding of core sciences.' },
      { step: 'Stream', description: 'Science stream (PCM/PCB).' },
      { step: 'Entrance Exams', description: 'NEST, IISER Aptitude Test, IIT JAM.' },
      { step: 'Degree', description: 'B.Sc, M.Sc, and eventually a Ph.D. in a specialized scientific field.' },
      { step: 'Skills', description: 'Participate in academic research projects. Publish papers.' },
      { step: 'Job', description: 'Join a university as a Postdoctoral Researcher or an R&D lab as a Scientist.' }
    ]
  },
  {
    title: 'Psychologist / Counselor',
    description: 'Psychologists study human behavior and mental processes. You will diagnose mental health issues, provide therapy, and help individuals navigate emotional distress.',
    skills: ['Active Listening', 'Cognitive Behavioral Therapy (CBT)', 'Psychological Assessment', 'Empathy'],
    tools: ['Psychometric Tests', 'DSM-5', 'Therapy Management Software'],
    weights: { Logical: 0.20, Analytical: 0.30, Verbal: 0.40, Technical: 0.10 },
    salary: { fresher: '₹3,50,000', experienced: '₹15,00,000+' },
    futureScope: 'Rapidly growing. Awareness around mental health is increasing globally, leading to high demand for clinical psychologists and corporate counselors.',
    roadmap: [
      { step: 'Class 10', description: 'Opt for Psychology as a subject if available. Develop strong interpersonal skills.' },
      { step: 'Stream', description: 'Humanities or Science stream.' },
      { step: 'Entrance Exams', description: 'CUET, University specific tests.' },
      { step: 'Degree', description: 'BA/B.Sc in Psychology, followed by an MA/M.Sc and M.Phil.' },
      { step: 'Skills', description: 'Complete an M.A/M.Sc in Clinical Psychology. Obtain RCI licensing in India.' },
      { step: 'Job', description: 'Work in a hospital, school, or start your private counseling practice.' }
    ]
  },
  {
    title: 'Civil Services / IAS Officer',
    description: 'IAS Officers are the top administrators of the Indian government. You will implement public policies, manage district affairs, and oversee government infrastructure.',
    skills: ['Public Administration', 'Policy Analysis', 'Crisis Management', 'Leadership'],
    tools: ['E-Governance Portals', 'Legal Frameworks', 'Government Databases'],
    weights: { Logical: 0.35, Analytical: 0.25, Verbal: 0.30, Technical: 0.10 },
    salary: { fresher: '₹6,70,000', experienced: '₹30,00,000+' },
    futureScope: 'The most prestigious and secure career in India. Offers unmatched authority and the ability to create systemic social impact.',
    roadmap: [
      { step: 'Class 10', description: 'Start reading daily newspapers (The Hindu) to build current affairs knowledge.' },
      { step: 'Stream', description: 'Any stream (Humanities highly preferred).' },
      { step: 'Entrance Exams', description: 'UPSC Civil Services Examination.' },
      { step: 'Degree', description: 'Pursue a BA in subjects like History, Political Science, or Geography.' },
      { step: 'Skills', description: 'Dedicate 1-2 years strictly to UPSC CSE preparation (Prelims, Mains, Interview).' },
      { step: 'Job', description: 'Upon clearing, undergo training at LBSNAA before your first posting as a Sub-Divisional Magistrate (SDM).' }
    ]
  }
];

const seedDB = async () => {
  try {
    await Question.deleteMany({});
    await Career.collection.drop().catch(err => console.log('Career collection not found, skipping drop.'));
    console.log('Existing questions and careers cleared.');
    
    await Question.insertMany(questions);
    console.log('20 Quality Questions Seeded successfully!');

    await Career.insertMany(careers);
    console.log('22 Real Indian Careers Seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

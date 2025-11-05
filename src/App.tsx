/// <reference path="./figma-assets.d.ts" />
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PortfolioCanvas } from './components/PortfolioCanvas';
import { SelectorCard } from './components/SelectorCard';
import { SelectorRow } from './components/SelectorRow';
import { GalleryPage } from './components/GalleryPage';
import svgPaths from "./imports/svg-l5xrq5oncm";
import imgBestofWorld from "./assets/bestofworlds.png";
import imgMatchify from "./assets/matchify.png";
import imgPokerProject from "figma:asset/c0feeedc61399adf999eecc3ee140f7108498d2c.png";
import imgCounselorProject from "figma:asset/5e4f91a6b95f53e1f2bf62dc485a3805b66a4c43.png";
import imgGlioblastomaProject from "figma:asset/d2f820611a2776c5b87e5d775b4b2bb6715445ad.png";
import imgQualcommProject from "figma:asset/ad70de70e0640e2258d4bd1b57fd5d505386294b.png";
import imgAutoNinjasProject from "figma:asset/f97eaa6ce929be884a05e6ca5db0eddcc17f1115.png";
import imgExelonProject from "figma:asset/1da863aca58c82705ae383374cf8bee7714f9d57.png";
import imgGetBetterProject from "figma:asset/1fa976c6c730b39310ef9f648677a4ae1f6cacf5.png";
import imgCrashInterviewProject from "figma:asset/f81573be7ae30b0202ff9632ddb80d193f59a42a.png";
import imgAboutMe from "figma:asset/0d9e2eea5f16e643c419d99d67b27229ea218c42.png";
import imgGallery1 from "figma:asset/1778a160699c2fbf672deb6726a2625a25c0483d.png";
import imgGallery2 from "figma:asset/26704691a83b5170e1c2cdf2ad100091d9d3f8f6.png";
import imgGallery3 from "figma:asset/6fa2ba442cfbe24265d023ba41f4c5dc90e1cb67.png";
import imgGallery4 from "figma:asset/bd0abfa090014e0cac923a11aa66db9286dac31b.png";
import imgGallery5 from "figma:asset/116bd499ce5b76633c4291d773e9518a9ff10a80.png";

// Dynamically import all images from src/assets/images folder
const photographyImagesModules = import.meta.glob('./assets/images/*.{jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const photographyImages = Object.values(photographyImagesModules) as string[];

// Debug: Log the number of images loaded
console.log('Photography images loaded:', photographyImages.length, photographyImages);
import Frame1 from './imports/Frame1';
import Frame2 from './imports/Frame2';
import Frame3 from './imports/Frame3';
import Frame4 from './imports/Frame4';
import Frame5 from './imports/Frame5';
import Frame6 from './imports/Frame6';
import Frame7 from './imports/Frame7';
import Frame8 from './imports/Frame8';
import Frame9 from './imports/Frame9';
import Frame10 from './imports/Frame10';
import Frame11 from './imports/Frame11';
import Frame12 from './imports/Frame12';
import Frame13 from './imports/Frame13';
import Frame14 from './imports/Frame14';
import Frame15 from './imports/Frame15';
import Frame16 from './imports/Frame16';
import Frame17 from './imports/Frame17';
import Frame18 from './imports/Frame18';
import Frame19 from './imports/Frame19-16-450';
import Frame20 from './imports/Frame20-16-457';
import Frame21 from './imports/Frame21-16-464';
import Frame22 from './imports/Frame22';
import Frame23 from './imports/Frame23';
import Frame24 from './imports/Frame24';
import Frame25 from './imports/Frame25';
import Frame43 from './imports/Frame43';
import Frame44 from './imports/Frame44';
import Frame45 from './imports/Frame45';
import Frame46 from './imports/Frame46-16-165';
import Frame47 from './imports/Frame47-16-172';
import Frame48 from './imports/Frame48-16-179';
import Frame49 from './imports/Frame49';
import Frame50 from './imports/Frame50';
import Frame51 from './imports/Frame51';
import Frame52 from './imports/Frame52';
import Frame53 from './imports/Frame53';
import Frame54 from './imports/Frame54';
import Frame55 from './imports/Frame55';
import Frame56 from './imports/Frame56';
import { ChevronDown, ChevronUp } from 'lucide-react';
import html2canvas from 'html2canvas';
import { ProjectDetailsView, ProjectDetails } from './components/ProjectDetailsView';
import { TechnologyProjectsModal } from './components/TechnologyProjectsModal';
import { ProjectTechnologiesModal } from './components/ProjectTechnologiesModal';

// Technologies (replacing Body/Projects)
const technologyOptions = [
  { id: 'python', type: 'python', category: 'technology', name: 'Python' },
  { id: 'react', type: 'react', category: 'technology', name: 'React' },
  { id: 'aws-lambda', type: 'aws-lambda', category: 'technology', name: 'AWS Lambda' },
  { id: 'aws-sagemaker', type: 'aws-sagemaker', category: 'technology', name: 'AWS SageMaker' },
  { id: 'aws-rekognition', type: 'aws-rekognition', category: 'technology', name: 'AWS Rekognition' },
  { id: 'aws-comprehend', type: 'aws-comprehend', category: 'technology', name: 'AWS Comprehend' },
  { id: 'aws-bedrock', type: 'aws-bedrock', category: 'technology', name: 'AWS Bedrock' },
  { id: 'aws-ec2', type: 'aws-ec2', category: 'technology', name: 'AWS EC2' },
  { id: 'aws-api-gateway', type: 'aws-api-gateway', category: 'technology', name: 'AWS API Gateway' },
  { id: 'aws-iam', type: 'aws-iam', category: 'technology', name: 'AWS IAM' },
  { id: 'cpp', type: 'cpp', category: 'technology', name: 'C++' },
  { id: 'openmp', type: 'openmp', category: 'technology', name: 'OpenMP' },
  { id: 'thread-local-storage', type: 'thread-local-storage', category: 'technology', name: 'Thread-Local Storage' },
  { id: 'monte-carlo', type: 'monte-carlo', category: 'technology', name: 'Monte Carlo Simulation' },
  { id: 'tensorflow', type: 'tensorflow', category: 'technology', name: 'TensorFlow'},
  { id: 'keras', type: 'keras', category: 'technology', name: 'Keras' },
  { id: 'opencv', type: 'opencv', category: 'technology', name: 'OpenCV' },
  { id: 'scikit-learn', type: 'scikit-learn', category: 'technology', name: 'Scikit-learn' },
  { id: 'kotlin', type: 'kotlin', category: 'technology', name: 'Kotlin' },
  { id: 'openai-api', type: 'openai-api', category: 'technology', name: 'OpenAI API' },
  { id: 'html', type: 'html', category: 'technology', name: 'HTML' },
  { id: 'css', type: 'css', category: 'technology', name: 'CSS' },
  { id: 'javascript', type: 'javascript', category: 'technology', name: 'JavaScript' },
  { id: 'ux-research', type: 'ux-research', category: 'technology', name: 'UX Research' },
  { id: 'usability-testing', type: 'usability-testing', category: 'technology', name: 'Usability Testing' },
  { id: 'llama3', type: 'llama3', category: 'technology', name: 'Llama3' },
  { id: 'langchain', type: 'langchain', category: 'technology', name: 'LangChain' },
  { id: 'flask', type: 'flask', category: 'technology', name: 'Flask' },
  { id: 'pydub', type: 'pydub', category: 'technology', name: 'PyDub' },
  { id: 'tts', type: 'tts', category: 'technology', name: 'Text-to-Speech (TTS)' },
  { id: 'stt', type: 'stt', category: 'technology', name: 'Speech-to-Text (STT)' },
  { id: 'rag', type: 'rag', category: 'technology', name: 'Retrieval-Augmented Generation (RAG)' },
  { id: 'csharp', type: 'csharp', category: 'technology', name: 'C#' },
  { id: 'uipath', type: 'uipath', category: 'technology', name: 'UIPath Orchestrator' },
  { id: 'vb', type: 'vb', category: 'technology', name: 'Visual Basic (VB)' },
  { id: 'typescript', type: 'typescript', category: 'technology', name: 'TypeScript' },
  { id: 'quarkus', type: 'quarkus', category: 'technology', name: 'Quarkus' },
  { id: 'pandas', type: 'pandas', category: 'technology', name: 'Pandas' },
  { id: 'react-native', type: 'react-native', category: 'technology', name: 'React Native' },
  { id: 'phaser', type: 'phaser', category: 'technology', name: 'Phaser' },
  { id: 'webpack', type: 'webpack', category: 'technology', name: 'Webpack' },
  { id: 'firebase', type: 'firebase', category: 'technology', name: 'Firebase' },
  { id: 'angularjs', type: 'angularjs', category: 'technology', name: 'AngularJS' },
  { id: 'spotify-api', type: 'spotify-api', category: 'technology', name: 'Spotify API' },
];

// Projects metadata with images and PDFs
const projectsData = [
  {
    id: 'getbetter',
    title: 'GetBetter - Mobile Health Coach',
    image: imgGetBetterProject,
    description: "I teamed up once again with my favorite teammates—this time, we went all in with AWS resources. Together, we built a personalized health tracker designed for users who care about both their mental and physical well-being.Our platform uses AI as a supportive agent that can respond to your worries and uplift you through reflective journaling. On the physical side, we implemented computer vision to analyze workout form and provide real-time encouragement. We also built a camera-based heart rate monitor for quick vital checks, along with a learning system that adapts to your preferences over time. We’re proud to have won the top prize at this year’s AWS Hackathon!",
    pdfUrl: 'https://drive.google.com/file/d/1f-ULRgM-lwyroTpNVa89KfSN2R71GewT/preview',
    technologies: [
      'AWS Lambda',
      'AWS SageMaker',
      'AWS Rekognition',
      'AWS Comprehend',
      'AWS Bedrock',
      'AWS EC2',
      'AWS API Gateway',
      'AWS IAM',
      'Python'
    ]
  },
  {
    id: 'poker-prediction',
    title: 'Parallel Poker Simulation',
    image: imgPokerProject,
    description: "This project was a collaboration with two other students to build an optimization system. Since I love poker, I wanted to explore the complex interplay between probability and player behavior—how effectively someone can conceal information, make decisions under uncertainty, and influence outcomes. While poker isn't just about probabilities, I thought it would be fascinating to create a neutral, unbiased system that could help calculate the probability of losing in real-time.",
    pdfUrl: 'https://drive.google.com/file/d/14DbwldZgpKZhe4DiJ4Avd_tB7_EJ4Xxt/preview',
    technologies: [
      'C++',
      'OpenMP',
      'Thread-Local Storage',
      'Monte Carlo simulation'
    ]
  },
  {
    id: 'glioblastoma',
    title: 'Glioblastoma MRI Classifier',
    image: imgGlioblastomaProject,
    pdfUrl: 'https://drive.google.com/file/d/1r-Jm5KPFyZWgN37ox9pygYPfINbK6Zh1/preview',
    description: "In one of my favorite classes—Computer Vision—I chose to work on detecting glioblastoma, a type of brain cancer, for my final project. I wanted to contribute to a cause with real-world impact, and this project taught me a lot about using tech in healthcare: from data analysis and model selection to parameter tuning, training, and interpreting results.",
    technologies: [
      'TensorFlow',
      'Keras',
      'OpenCV',
      'Scikit-learn',
      'Python'
    ]
  },
  {
    id: 'ai-counselor',
    title: 'AI Counselor (Voice Chat)',
    image: imgCounselorProject,
    pdfUrl: 'https://drive.google.com/file/d/1vZ9-m7j6mq3Ka6wfmPiCzYcVZW0DlXiD/preview',
    description: "This project was an independent study under Professor Chuah at Lehigh University. We explored how to generate neutral and supportive advice for students' mental health concerns. Our team developed a custom model using a combination of survey data, synthetic responses, and online sources. We also learned how to benchmark the model against human-level responses in NLP.",
    technologies: [
      'Kotlin',
      'OpenAI API'
    ]
  },
  {
    id: 'crash-interview',
    title: 'Crash That Interview',
    image: imgCrashInterviewProject,
    pdfUrl: 'https://drive.google.com/file/d/1JLBVqEJc6--UQKVs0BGxyv1zuF135NSl/preview',
    websiteUrl: 'https://teamsalsa.netlify.app/',
    description: "This project was part of my HCI course, where we studied how people subconsciously interact with website design. From wireframes to user testing and multiple feedback cycles, we built a website from scratch that helps users prepare for interviews. Throughout the process, I learned a lot about composition, decomposition, and how to make thoughtful, coordinated design decisions.",
    technologies: [
      'HTML',
      'CSS',
      'JavaScript',
      'UX Research',
      'Usability Testing'
    ]
  },
  {
    id: 'qualcomm',
    title: 'Qualcomm - AI Engineer Intern',
    image: imgQualcommProject,
    pdfUrl: '', 
    description: "At Qualcomm, I focused on AI systems, developing and optimizing speech recognition and NLP endpoints that reduced latency by 30% and improved accuracy by 15%. I also tested and refined user interfaces through teammate feedback, directly improving user experience while adhering to clean, maintainable coding standards.",
    technologies: [
      'Llama3',
      'LangChain',
      'Flask',
      'PyDub',
      'Speech-to-Text (STT)',
      'Text-to-Speech (TTS)',
      'RAG (Retrieval-Augmented Generation)',
      'Python'
    ]
  },
  {
    id: 'exelon',
    title: 'Exelon - Software Engineer Intern',
    image: imgExelonProject,
    pdfUrl: '', 
    description: "At Exelon, I led the development of a large-scale automation pipeline in Python and C#, integrating three enterprise platforms to streamline real-time data retrieval and discrepancy detection. This project not only saved over $200K annually and improved processing speeds by 400%, but also taught me the value of cross-functional collaboration with business analysts and the importance of clear, PDQ-standard documentation for long-term software maintenance.",
    technologies: [
      'Python',
      'C#',
      'UIPath Orchestrator',
      'Visual Basic (VB)',
      'Pandas'
    ]
  },
  {
    id: 'auto-ninjas',
    title: 'The Auto Ninjas - Software Engineer Intern',
    image: imgAutoNinjasProject,
    description: "At The Auto Ninjas, I enhanced website performance by identifying and fixing front-end bottlenecks, resulting in a 20% faster load time and 15% higher user retention. This experience strengthened my debugging and performance optimization skills, as well as my ability to translate technical improvements into measurable business impact.",
    technologies: [
      'React',
      'TypeScript',
      'Quarkus',
      'Pandas'
    ]
  },
  {
    id: 'best-of-worlds',
    title: 'Best of Worlds',
    image: imgBestofWorld, 
    pdfUrl: 'https://drive.google.com/file/d/1CQkjJT5CFvV-9q8fimcqtnBzs48TzrOI/preview',
    description: "The theme of the hackathon was “The Fight for Justice”, and as a team of Asian and Hispanic immigrants, we chose to focus on the immigrant experience. Inspired by the struggles our parents faced—like language barriers and complex paperwork—we designed a game that simulates the real-life journey of immigration, where each decision affects the final outcome. Our project won the Best UI award at this year’s Google Hackathon! Best of Worlds is an interactive mobile game application that combines engaging gameplay with modern mobile development. Built with React Native for cross-platform compatibility, the project leverages Phaser game framework for smooth 2D game mechanics, Node.js for backend services, and Webpack for efficient bundling and optimization. ",
    technologies: [
      'React Native',
      'Node.js',
      'Phaser',
      'Webpack',
      'JavaScript'
    ]
  },
  {
    id: 'matchify',
    title: 'Matchify',
    image: imgMatchify, // Placeholder - replace with actual image
    description: "Matchify is a music compatibility platform that helps users discover their musical compatibility with others. By integrating the Spotify API, the application analyzes users' listening habits and preferences to find musical matches. Built with React for the frontend, Node.js for backend services, Firebase for real-time database and authentication, and AngularJS for additional frontend functionality.",
    websiteUrl: 'https://match-ify.netlify.app/',
    technologies: [
      'React',
      'Spotify API',
      'Node.js',
      'Firebase',
      'AngularJS'
    ]
  }
];

// Technology to Projects mapping
const technologyToProjects: Record<string, string[]> = {
  'Python': ['getbetter', 'glioblastoma', 'qualcomm', 'exelon'],
  'C++': ['poker-prediction', 'exelon'],
  'React': ['auto-ninjas', 'getbetter', 'ai-counselor', 'matchify'],
  'AWS Lambda': ['getbetter'],
  'AWS SageMaker': ['getbetter'],
  'AWS Rekognition': ['getbetter'],
  'AWS Comprehend': ['getbetter'],
  'AWS Bedrock': ['getbetter'],
  'AWS EC2': ['getbetter'],
  'AWS API Gateway': ['getbetter'],
  'AWS IAM': ['getbetter'],
  'OpenMP': ['poker-prediction'],
  'Thread-Local Storage': ['poker-prediction'],
  'Monte Carlo simulation': ['poker-prediction'],
  'TensorFlow': ['glioblastoma'],
  'Keras': ['glioblastoma'],
  'OpenCV': ['glioblastoma', 'exelon'],
  'Scikit-learn': ['glioblastoma'],
  'Kotlin': ['ai-counselor'],
  'OpenAI API': ['ai-counselor','qualcomm'],
  'HTML': ['crash-interview','auto-ninjas'],
  'CSS': ['crash-interview','auto-ninjas'],
  'JavaScript': ['crash-interview', 'auto-ninjas', 'best-of-worlds'],
  'UX Research': ['crash-interview','auto-ninjas'],
  'Usability Testing': ['crash-interview','auto-ninjas'],
  'Llama3': ['qualcomm', 'getbetter'],
  'LangChain': ['qualcomm', 'getbetter'],
  'Flask': ['qualcomm', 'getbetter'],
  'PyDub': ['qualcomm', 'getbetter'],
  'Speech-to-Text (STT)': ['qualcomm'],
  'Text-to-Speech (TTS)': ['qualcomm'],
  'RAG (Retrieval-Augmented Generation)': ['qualcomm', 'getbetter'],
  'C#': ['exelon', 'poker-prediction'],
  'UIPath Orchestrator': ['exelon'],
  'Visual Basic (VB)': ['exelon'],
  'TypeScript': ['auto-ninjas', 'crash-interview'],
  'Quarkus': ['auto-ninjas'],
  'Pandas': ['auto-ninjas', 'exelon'],
  'React Native': ['best-of-worlds'],
  'Phaser': ['best-of-worlds'],
  'Webpack': ['best-of-worlds'],
  'Firebase': ['matchify'],
  'AngularJS': ['matchify'],
  'Spotify API': ['matchify'],
  'Node.js': ['best-of-worlds', 'matchify']
};

// About Me text content
const aboutMeText = `Hi! My name is Ivory. You've probably already read my resume or found me through LinkedIn. Either way, this platform was originally built as my photo gallery—you should definitely check it out! I love taking street photography and capturing moments with my beloved ones. I travel a lot, so this is also a way for me to revive those memories. Besides that, I also have a workspace that archives my previous projects. Let's get in touch if you think any of this sounds cool!

Oh I also love music, i put my playlist down there, if it is your vibe, hit the button and i might be able to recommend you some songs based on my still-working-on algorithm :)`;


// Get in Touch social links
const socialLinks = [
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/in/ivory-le/', icon: '💼' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/Ivoryle82', icon: '💻' },
];

// Gallery Photos Data - mapping gallery categories to their photo collections
const galleryPhotosData: Record<string, string[]> = {
  'Archives of Moments': photographyImages,
  'UI Designs': [imgGallery1, imgGallery2],
  'Illustrations': [imgGallery3, imgGallery4],
  'Digital Art': [imgGallery1, imgGallery5],
  'Wireframes': [imgGallery2, imgGallery3],
  'Prototypes': [imgGallery4, imgGallery1],
  'Sketches': [imgGallery5, imgGallery2],
  'Icons': [imgGallery1, imgGallery3],
  'Logos': [imgGallery2, imgGallery4],
  'Typography': [imgGallery3, imgGallery5],
  'Patterns': [imgGallery4, imgGallery2],
  'Mockups': [imgGallery1, imgGallery5],
  '3D Renders': [imgGallery2, imgGallery1],
  'Animations': [imgGallery3, imgGallery4],
  'Case Studies': [imgGallery5, imgGallery3],
  'Experiments': [imgGallery1, imgGallery2],
};

// Project Details Data
const projectDetailsData: Record<string, ProjectDetails> = {
  'poker-prediction': {
    id: 'poker-prediction',
    title: 'Parallel Poker Simulation',
    technologies: 'C++, OpenMP, Thread-Local Storage, Monte Carlo simulation',
    accomplishments: [
      'Optimized poker hand evaluation runtime by 3x while preserving accuracy by parallelizing Monte Carlo simulations with OpenMP, supporting large-scale probabilistic experiments.',
      'Ensured reliable multi-threaded performance by implementing thread-local storage, parallel reduction, and batch computations, preventing race conditions, optimizing cache usage, and enabling 18 poker hand types simulations.'
    ],
    narrative: `This is my final project for our Advanced Parallel Computing class, where I collaborated with two other students to build an optimization system. Since I love poker, I wanted to explore the complex interplay between probability and player behavior—how effectively someone can conceal information, make decisions under uncertainty, and influence outcomes. While poker isn't just about probabilities, I thought it would be fascinating to create a neutral, unbiased system that could help calculate the probability of losing in real-time.

Through this project, I discovered ways to optimize the computation process using Intel TBB by chunking tasks and employing parallelism. I also learned how to prevent race conditions and gained hands-on experience designing low-level systems for real-world applications. Overall, it was a great opportunity to deepen my understanding of both algorithms and practical parallel system design.`
  }
};

// Dropdown button component
function DropdownButton({ 
  title, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
}) {
  return (
    <button
      onClick={onToggle}
      className={`bg-[#ffffff] h-14 relative rounded-[56px] shrink-0 w-full transition-all duration-200 ${
        isOpen 
          ? 'border border-[#000000]' 
          : 'border border-[#dbe0e5] hover:border-gray-300'
      }`}
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-3 h-14 items-center justify-start overflow-clip px-[13px] py-[17px] relative">
        <div className="css-n9fx09 font-['Space_Grotesk'] font-normal leading-[0] relative shrink-0 text-[#61758a] text-[16px] text-nowrap">
          <p className="block leading-[24px] whitespace-pre">{title}</p>
        </div>
        <div className="flex-1" />
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-black" />
        ) : (
          <ChevronDown className="h-5 w-5 text-black" />
        )}
      </div>
    </button>
  );
}

function AppContent() {
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [canvasParts, setCanvasParts] = useState<any[]>([]);
  const [selectedTechnology, setSelectedTechnology] = useState('python'); // Default technology
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [viewingProjectDetails, setViewingProjectDetails] = useState<string | null>(null);
  const [technologyModalOpen, setTechnologyModalOpen] = useState(false);
  const [selectedTechnologyForModal, setSelectedTechnologyForModal] = useState<string | null>(null);
  const [selectedProjectForCanvas, setSelectedProjectForCanvas] = useState<typeof projectsData[0] | null>(null);
  const [projectTechModalOpen, setProjectTechModalOpen] = useState(false);
  const [showAboutMe, setShowAboutMe] = useState(true); // Default to showing About Me
  const [viewingGallery, setViewingGallery] = useState<{ name: string; photos: string[] } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Single accordion behavior
  const toggleSection = (section: string) => {
    setOpenSection(current => current === section ? null : section);
  };

  // Handle technology click to show projects modal
  const handleTechnologyClick = (technologyName: string) => {
    setSelectedTechnologyForModal(technologyName);
    setTechnologyModalOpen(true);
  };

  // Get projects for a technology
  const getProjectsForTechnology = (technologyName: string) => {
    const projectIds = technologyToProjects[technologyName] || [];
    return projectIds.map(id => projectsData.find(p => p.id === id)).filter(Boolean) as typeof projectsData;
  };

  // Handle project click from technology modal
  const handleProjectClick = (project: { id: string; title: string; image?: string; description?: string; websiteUrl?: string; pdfUrl?: string; technologies: string[] }) => {
    setSelectedProjectForCanvas(project);
    setProjectTechModalOpen(true);
    setShowAboutMe(false); // Hide About Me when viewing a project
  };

  // Handle gallery click to open gallery page
  const handleGalleryClick = (galleryName: string) => {
    const photos = galleryPhotosData[galleryName] || [];
    setViewingGallery({ name: galleryName, photos });
  };

  // Enhanced keyboard functionality - Delete/Backspace and ESC
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedPart) {
        handlePartRemove(selectedPart);
        setSelectedPart(null);
      }
    } else if (event.key === 'Escape') {
      // ESC key deselects current selection
      if (selectedPart) {
        setSelectedPart(null);
      }
    }
  }, [selectedPart]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const addPartToCanvas = (part: any) => {
    // Add part to center of canvas with some random offset
    const centerX = 250 + (Math.random() - 0.5) * 100;
    const centerY = 200 + (Math.random() - 0.5) * 100;
    
    // Create new part with Asset Wrapper frame data
    const newPart = {
      ...part,
      id: `${part.category}-${Date.now()}-${Math.random()}`,
      x: centerX,
      y: centerY,
      scale: 1.0,
      // Preserve Asset Wrapper frame properties
      wrapperFrame: true,
      clipContent: false,
      transparentPadding: true
    };
    setCanvasParts(prev => [...prev, newPart]);
    setSelectedPart(newPart.id); // Auto-select new part
  };

  const handlePartDrop = (part: any, position: { x: number; y: number }) => {
    // Create new part with Asset Wrapper frame data (not rasterized crop)
    const newPart = {
      ...part,
      id: `${part.category}-${Date.now()}-${Math.random()}`,
      x: position.x,
      y: position.y,
      scale: 1.0,
      // Preserve Asset Wrapper frame properties
      wrapperFrame: true,
      clipContent: false,
      transparentPadding: true
    };
    setCanvasParts(prev => [...prev, newPart]);
    setSelectedPart(newPart.id); // Auto-select dropped part
  };

  const handlePartMove = (partId: string, position: { x: number; y: number }) => {
    setCanvasParts(prev => 
      prev.map(part => 
        part.id === partId ? { ...part, x: position.x, y: position.y } : part
      )
    );
  };

  const handlePartScale = (partId: string, scale: number) => {
    // Min scale: 50%, Max scale: 400% of original wrapper
    setCanvasParts(prev => 
      prev.map(part => 
        part.id === partId ? { ...part, scale: Math.max(0.5, Math.min(4.0, scale)) } : part
      )
    );
  };

  const handlePartRemove = (partId: string) => {
    setCanvasParts(prev => prev.filter(part => part.id !== partId));
    if (selectedPart === partId) {
      setSelectedPart(null);
    }
  };

  const handlePartSelect = (partId: string) => {
    setSelectedPart(partId);
  };

  const handlePartDeselect = () => {
    setSelectedPart(null);
  };

  const handleRandomize = () => {
    // Select a random project
    const randomProject = projectsData[Math.floor(Math.random() * projectsData.length)];
    
    // Display the random project
    setSelectedProjectForCanvas(randomProject);
    setProjectTechModalOpen(true);
    setShowAboutMe(false);
  };

  const getSelectedTechnology = () => {
    return technologyOptions.find(option => option.id === selectedTechnology) || null;
  };

  const portfolioParts = {
    body: getSelectedTechnology(),
    color: { id: 'default', name: 'Default', hue: 0, saturation: 1 },
    background: { id: 'gradient', type: 'gradient', category: 'background', name: 'Teal Gradient' }
  };

  // Capture canvas as PNG and either download or share
  const handleSharePortfolio = async () => {
    const canvasElement = document.querySelector('[data-canvas="portfolio-canvas"]') as HTMLElement;
    
    if (!canvasElement) {
      alert('Please create your portfolio layout first!');
      return;
    }

    try {
      // First, temporarily hide any selection overlays
      const selectionOverlays = document.querySelectorAll('.selection-overlay, [data-selection-overlay]');
      const originalDisplays: string[] = [];
      
      selectionOverlays.forEach((overlay, index) => {
        const element = overlay as HTMLElement;
        originalDisplays[index] = element.style.display;
        element.style.display = 'none';
      });

      // Capture the canvas as PNG with improved compatibility
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#fefdfa', // Use standard hex color instead of CSS variable
        width: 522,
        height: 522,
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        foreignObjectRendering: false, // Avoid some CSS parsing issues
        ignoreElements: (element) => {
          // Skip elements that might have problematic CSS
          return element.classList?.contains('selection-overlay') || 
                 element.classList?.contains('resize-handle') ||
                 element.hasAttribute('data-selection-overlay');
        },
        onclone: (clonedDoc) => {
          // Convert any remaining OKLCH colors to hex equivalents in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              --foreground: #121417 !important;
              --background: #ffffff !important;
              --primary: #030213 !important;
              --muted: #ececf0 !important;
              --muted-foreground: #717182 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Restore selection overlays
      selectionOverlays.forEach((overlay, index) => {
        const element = overlay as HTMLElement;
        element.style.display = originalDisplays[index];
      });

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const fileName = `${portfolioTitle || 'portfolio'}-${Date.now()}.png`;

        // Check if Web Share API is supported and has share capability for files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
          try {
            const file = new File([blob], fileName, { type: 'image/png' });
            await navigator.share({
              title: `Check out my portfolio: ${portfolioTitle || 'My Portfolio'}!`,
              text: 'Created with Portfolio Builder!',
              files: [file]
            });
          } catch (shareError) {
            console.log('Share cancelled or failed:', shareError);
            // Fallback to download
            downloadImage(blob, fileName);
          }
        } else {
          // Fallback: download the image
          downloadImage(blob, fileName);
        }
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('Error capturing canvas:', error);
      
      // Provide more specific error handling
      if (error instanceof Error && error.message.includes('oklch')) {
        alert('There was an issue with color formatting. Please try again or contact support if the problem persists.');
      } else {
        alert('Sorry, there was an error capturing your portfolio. Please try again!');
      }
    }
  };

  // Download image fallback
  const downloadImage = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Gallery Page - Full Screen */}
      {viewingGallery && (
        <GalleryPage
          galleryName={viewingGallery.name}
          photos={viewingGallery.photos}
          onClose={() => setViewingGallery(null)}
        />
      )}

      {/* Project Details Modal */}
      {viewingProjectDetails && projectDetailsData[viewingProjectDetails] && (
        <ProjectDetailsView
          project={projectDetailsData[viewingProjectDetails]}
          onClose={() => setViewingProjectDetails(null)}
        />
      )}

      {/* Technology Projects Modal */}
      <TechnologyProjectsModal
        isOpen={technologyModalOpen}
        onClose={() => setTechnologyModalOpen(false)}
        technology={selectedTechnologyForModal}
        projects={selectedTechnologyForModal ? getProjectsForTechnology(selectedTechnologyForModal) : []}
      />

      <div
        className="bg-[#ffffff] box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full overflow-y-auto"
        data-name="Portfolio Builder"
      >
      <div className="bg-[#ffffff] min-h-screen relative shrink-0 w-full" data-name="Main Container">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start min-h-inherit p-0 relative w-full">
          
          {/* Header */}
          <div className="relative shrink-0 w-full" data-name="Header">
            <div
              aria-hidden="true"
              className="absolute border-[#e5e8eb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
            />
            <div className="flex flex-row items-center relative size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-between pb-[13px] pt-3 px-10 relative w-full">
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-4 items-center justify-start p-0 relative">
                    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-4">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full overflow-clip relative w-4">
                        <div className="absolute left-0 size-4 top-0">
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                            <g id="Vector - 0"></g>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start min-w-inherit p-0 relative">
                        <div className="css-q66wrl font-['Space_Grotesk'] font-bold leading-[0] relative shrink-0 text-[#121417] text-[18px] text-nowrap w-full">
                          <p className="block leading-[23px] whitespace-pre">IvoryLe</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="basis-0 grow h-10 min-h-px min-w-px relative shrink-0" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row justify-center relative size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-center pb-20 pt-5 px-8 relative w-full">
                <div className="basis-0 grow max-w-[960px] min-h-px min-w-px relative shrink-0">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start max-w-inherit overflow-clip p-0 relative w-full space-y-6">
                    
                    {/* Hero Section */}
                    <div className="relative shrink-0 w-full">
                      <div className="flex flex-row items-center relative size-full">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-center flex flex-wrap gap-8 items-center justify-start p-[16px] relative w-full">
                          <div className="min-w-72 relative shrink-0">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start min-w-inherit p-0 relative">
                              <div className="css-q66wrl font-['Space_Grotesk'] font-bold leading-[0] relative shrink-0 text-[#121417] text-[18px] text-nowrap w-full">
                                <p className="block leading-[23px] whitespace-pre text-[32px]">Build A Project with me</p>
                              </div>
                            </div>
                          </div>
                          <div className="basis-0 grow min-h-px min-w-40 relative shrink-0">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start min-w-inherit p-0 relative w-full">
                              <div className="bg-[#ffffff] relative rounded-[56px] shrink-0 w-full">
                                <div className="flex flex-row items-center overflow-clip relative size-full">
                                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-start px-[41px] py-[17px] relative w-full px-[24px] py-[17px] py-[16px] px-[24px] py-[17px] px-[24px] py-[16px]">
                                    <input
                                      placeholder="Pick a technology and see what project I have built with it"
                                      value={portfolioTitle}
                                      onChange={(e) => setPortfolioTitle(e.target.value)}
                                      className="basis-0 css-n9fx09 font-['Space_Grotesk'] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#61758a] text-[16px] bg-transparent border-none outline-none leading-[20px]"
                                    />
                                  </div>
                                </div>
                                <div
                                  aria-hidden="true"
                                  className="absolute border border-[#dbe0e5] border-solid inset-0 pointer-events-none rounded-[56px]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Canvas */}
                    <div className="relative shrink-0 w-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
                        <PortfolioCanvas
                          canvasParts={canvasParts}
                          portfolioData={portfolioParts}
                          characterName={portfolioTitle}
                          selectedPart={selectedPart}
                          selectedProject={selectedProjectForCanvas}
                          aboutMeImage={showAboutMe ? imgAboutMe : undefined}
                          onPartDrop={handlePartDrop}
                          onPartMove={handlePartMove}
                          onPartRemove={handlePartRemove}
                          onPartScale={handlePartScale}
                          onPartSelect={handlePartSelect}
                          onPartDeselect={handlePartDeselect}
                        />
                      </div>
                    </div>

                    {/* Dropdown Controls */}
                    <div className="relative shrink-0 w-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-4 items-start justify-start px-4 py-3 relative w-full flex-wrap">
                        
                        {/* Technologies Dropdown */}
                        <div className="flex-1 min-w-[120px]">
                          <DropdownButton
                            title="Technologies"
                            isOpen={openSection === 'body'}
                            onToggle={() => toggleSection('body')}
                          />
                        </div>

                        {/* About Me Dropdown */}
                        <div className="flex-1 min-w-[120px]">
                          <DropdownButton
                            title="About Me"
                            isOpen={showAboutMe}
                            onToggle={() => {
                              setShowAboutMe(!showAboutMe);
                              if (!showAboutMe) {
                                // Clear any selected project when showing About Me
                                setSelectedProjectForCanvas(null);
                                setProjectTechModalOpen(false);
                                setTechnologyModalOpen(false);
                              }
                            }}
                          />
                        </div>

                        {/* My Gallery Dropdown */}
                        <div className="flex-1 min-w-[120px]">
                          <DropdownButton
                            title="My Gallery"
                            isOpen={openSection === 'mouth'}
                            onToggle={() => toggleSection('mouth')}
                          />
                        </div>

                        {/* Get in Touch Dropdown */}
                        <div className="flex-1 min-w-[120px]">
                          <DropdownButton
                            title="Get in Touch"
                            isOpen={openSection === 'accessories'}
                            onToggle={() => toggleSection('accessories')}
                          />
                        </div>

                      </div>

                      {/* Tutorial Box - Shows when no dropdown is open */}
                      {!openSection && !showAboutMe && (
                        <div className="bg-[#f8f9fa] border-t border-[#e5e8eb] px-10 py-6 mx-4 mt-4">
                          <div className="max-w-3xl mx-auto text-center">
                            <p className="text-[#121417] leading-relaxed">
                              Hey there! You can explore this site by clicking on one of these 4 boxes: <span className="font-bold">Technologies</span>, <span className="font-bold">About Me</span>, <span className="font-bold">My Gallery</span>, or <span className="font-bold">Get in Touch</span>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Standardized Selector Rows with exact Figma specifications */}
                      <SelectorRow isOpen={openSection === 'body'} sectionName="body">
                        {technologyOptions.map((tech) => (
                          <SelectorCard
                            key={tech.id}
                            option={tech}
                            category="body"
                            isSelected={selectedTechnology === tech.id}
                            onSelect={() => setSelectedTechnology(tech.id)}
                            onTechnologyClick={() => handleTechnologyClick(tech.name)}
                          />
                        ))}
                      </SelectorRow>

                      <SelectorRow isOpen={openSection === 'eyes'} sectionName="eyes">
                        <div className="bg-[#f8f9fa] border-t border-[#e5e8eb] px-10 py-6 w-full">
                          <div className="max-w-3xl">
                            <p className="text-[#121417] leading-relaxed whitespace-pre-line">
                              {aboutMeText}
                            </p>
                          </div>
                        </div>
                      </SelectorRow>

                      {/* Gallery Section - Button Bar instead of dropdown */}
                      <SelectorRow isOpen={openSection === 'mouth'} sectionName="mouth">
                        <div className="bg-[#f8f9fa] border-t border-[#e5e8eb] px-10 py-8 w-full">
                          <div className="max-w-4xl mx-auto text-center">
                            <button
                              onClick={() => handleGalleryClick('Archives of Moments')}
                              className="bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] px-12 py-4 rounded-[48px] font-bold transition-all duration-200"
                            >
                              See the worlds with me
                            </button>
                          </div>
                        </div>
                      </SelectorRow>

                      <SelectorRow isOpen={openSection === 'accessories'} sectionName="accessories">
                        <div className="bg-[#f8f9fa] border-t border-[#e5e8eb] px-10 py-6 w-full">
                          <div className="flex gap-4">
                            {socialLinks.map((social) => (
                              <a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-[#000000] text-[#ffffff] rounded-[48px] hover:bg-gray-800 transition-colors"
                              >
                                <span className="text-xl">{social.icon}</span>
                                <span className="font-['Space_Grotesk'] font-bold">{social.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </SelectorRow>
                    </div>

                    {/* Action Buttons */}
                    <div className="relative shrink-0 w-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-start flex flex-wrap gap-3 items-start justify-between px-4 py-3 relative w-full">
                        <button
                          onClick={handleRandomize}
                          className="bg-[#f0f2f5] max-w-[480px] min-w-[84px] relative rounded-[48px] shrink-0 hover:bg-[#e8eaed] transition-colors"
                        >
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center max-w-inherit min-w-inherit overflow-clip px-6 py-4 relative">
                            <div className="relative shrink-0">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative">
                                <div className="css-gdsj5n font-['Space_Grotesk'] font-bold leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#121417] text-[16px] text-center text-nowrap w-full">
                                  <p className="[text-overflow:inherit] block leading-[21px] overflow-inherit whitespace-pre"> See one of my projects</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                        
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Technology Projects Modal (Left Side) */}
    <TechnologyProjectsModal
      isOpen={technologyModalOpen}
      onClose={() => setTechnologyModalOpen(false)}
      technology={selectedTechnologyForModal}
      projects={selectedTechnologyForModal ? getProjectsForTechnology(selectedTechnologyForModal) : []}
      onProjectClick={handleProjectClick}
    />

    {/* Project Technologies Modal (Right Side) */}
    <ProjectTechnologiesModal
      isOpen={projectTechModalOpen}
      onClose={() => {
        setProjectTechModalOpen(false);
        setSelectedProjectForCanvas(null);
        setShowAboutMe(true); // Return to About Me when closing project
      }}
      project={selectedProjectForCanvas}
    />
    </>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContent />
    </DndProvider>
  );
}
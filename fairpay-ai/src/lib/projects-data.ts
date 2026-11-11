export type Project = {
    id: number;
    title: string;
    client: string;
    clientRating: number;
    clientJoined: string;
    clientLocation: string;
    clientJobsPosted: number;
    category: string;
    budget: string;
    duration: string;
    location: string;
    proposals: number;
    skills: string[];
    desc: string;
    fullDesc: string;
    requirements: string[];
    deliverables: string[];
    posted: string;
    featured: boolean;
};

export const projects: Project[] = [
    {
        id: 1,
        title: 'Full-Stack SaaS Dashboard',
        client: 'CloudBase Inc.',
        clientRating: 4.9,
        clientJoined: 'Jan 2024',
        clientLocation: 'San Francisco, USA',
        clientJobsPosted: 12,
        category: 'Web Dev',
        budget: '$3,500–$5,000',
        duration: '6 weeks',
        location: 'Remote',
        proposals: 8,
        skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
        desc: 'We need a senior full-stack developer to build a beautiful SaaS analytics dashboard integrated with our existing REST API. Must have strong UI/UX sense.',
        fullDesc: 'CloudBase Inc. is looking for an experienced full-stack developer to design and build a data-rich SaaS analytics dashboard. The dashboard will be the primary interface for our B2B clients to visualize usage metrics, billing, and account health.\n\nYou will work closely with our product and engineering teams to understand requirements, iterate on designs, and deliver a polished, production-ready application. The codebase is in TypeScript using React on the frontend and Node.js on the backend, connected to a PostgreSQL database via REST APIs.',
        requirements: [
            'Minimum 3 years of experience with React and TypeScript',
            'Strong proficiency in Node.js and RESTful API design',
            'PostgreSQL or similar relational database experience',
            'Portfolio showing previous SaaS or dashboard projects',
            'Strong English communication skills',
        ],
        deliverables: [
            'Responsive dashboard UI with chart components',
            'Deployed backend API connected to existing database',
            'Unit and integration tests (>70% coverage)',
            'Full documentation and handoff notes',
        ],
        posted: '2h ago',
        featured: true,
    },
    {
        id: 2,
        title: 'React Native Banking App',
        client: 'FinCore Ltd.',
        clientRating: 4.7,
        clientJoined: 'Mar 2023',
        clientLocation: 'London, UK',
        clientJobsPosted: 7,
        category: 'Mobile',
        budget: '$5,000–$8,000',
        duration: '10 weeks',
        location: 'Remote',
        proposals: 14,
        skills: ['React Native', 'Expo', 'Firebase', 'Redux'],
        desc: 'Build a cross-platform mobile banking application with real-time transaction tracking, biometric auth, and push notifications.',
        fullDesc: 'FinCore Ltd. requires a skilled React Native developer to build a cross-platform banking application for iOS and Android. The app should allow users to view account balances, send money, track transactions, and receive push notifications for account activity.\n\nBiometric authentication (Face ID / Fingerprint) is a must-have. The app will integrate with Firebase for real-time data and push notifications, and Redux for state management.',
        requirements: [
            '3+ years of React Native development experience',
            'Experience with Expo-managed workflow',
            'Familiarity with biometric auth libraries',
            'Redux or similar state management experience',
            'Prior fintech app experience preferred',
        ],
        deliverables: [
            'iOS and Android production builds',
            'Firebase integration for real-time data',
            'Biometric auth implementation',
            'Transaction history screen with filtering',
            'Push notification setup',
        ],
        posted: '5h ago',
        featured: false,
    },
    {
        id: 3,
        title: 'AI Chatbot UI/UX Design',
        client: 'BotLabs AI',
        clientRating: 5.0,
        clientJoined: 'Aug 2024',
        clientLocation: 'Berlin, Germany',
        clientJobsPosted: 4,
        category: 'UI/UX Design',
        budget: '$1,200–$2,000',
        duration: '3 weeks',
        location: 'Remote',
        proposals: 5,
        skills: ['Figma', 'Prototyping', 'Design Systems', 'AI UX'],
        desc: 'Design a conversational AI interface for enterprise clients. Focus on clarity, trust, and smooth interactions. Provide wireframes and high-fidelity Figma files.',
        fullDesc: 'BotLabs AI is building the next generation of enterprise AI assistants and we need a talented UI/UX designer to shape the user experience.\n\nThe scope includes designing the full conversation interface — message bubbles, typing indicators, file attachments, quick replies, and an onboarding flow. The design must feel trustworthy, clean, and modern. You will deliver wireframes first for approval, then move to high-fidelity Figma designs with a component library.',
        requirements: [
            'Strong Figma skills with component-based design',
            'Experience designing chat or messaging interfaces',
            'Understanding of AI/LLM product UX patterns',
            'Ability to create and document a design system',
        ],
        deliverables: [
            'Low-fidelity wireframes (3 screens)',
            'High-fidelity Figma designs (full flow)',
            'Interactive prototype',
            'Exported component library',
        ],
        posted: '1d ago',
        featured: false,
    },
    {
        id: 4,
        title: 'E-Commerce Platform (Next.js)',
        client: 'ShopNow Inc.',
        clientRating: 4.6,
        clientJoined: 'Jun 2022',
        clientLocation: 'Toronto, Canada',
        clientJobsPosted: 21,
        category: 'Web Dev',
        budget: '$2,500–$4,000',
        duration: '8 weeks',
        location: 'Remote',
        proposals: 19,
        skills: ['Next.js', 'Stripe', 'Tailwind CSS', 'Shopify API'],
        desc: 'Rebuild our e-commerce storefront with modern stack. Must integrate Stripe payments, product catalog, wishlist, and order tracking.',
        fullDesc: 'ShopNow Inc. is rebuilding its customer-facing storefront from scratch using a modern tech stack. We currently run on a dated platform and need a developer who can migrate us to Next.js with a clean, conversion-optimized design.\n\nThe new storefront will integrate with our existing Shopify backend via the Storefront API, use Stripe for payments, and include features like wishlists, product reviews, and real-time order tracking.',
        requirements: [
            'Proficient in Next.js (App Router)',
            'Stripe integration experience',
            'Shopify Storefront API experience preferred',
            'Strong CSS skills (Tailwind preferred)',
            'Performance optimization know-how (Core Web Vitals)',
        ],
        deliverables: [
            'Full Next.js storefront (product listing, PDP, cart, checkout)',
            'Stripe payment integration',
            'Shopify API integration',
            'Wishlist and order tracking features',
            'SEO optimized pages',
        ],
        posted: '2d ago',
        featured: false,
    },
    {
        id: 5,
        title: 'DevOps & CI/CD Pipeline Setup',
        client: 'TechFlux Ltd.',
        clientRating: 4.8,
        clientJoined: 'Nov 2023',
        clientLocation: 'Amsterdam, Netherlands',
        clientJobsPosted: 9,
        category: 'DevOps',
        budget: '$800–$1,500',
        duration: '2 weeks',
        location: 'Remote',
        proposals: 3,
        skills: ['Docker', 'GitHub Actions', 'AWS', 'Terraform'],
        desc: 'Set up automated CI/CD pipelines using GitHub Actions and deploy to AWS ECS with Docker. Include staging and production environments.',
        fullDesc: 'TechFlux Ltd. needs an experienced DevOps engineer to set up our entire CI/CD infrastructure from scratch. We are a startup moving from manual deployments to a fully automated pipeline.\n\nThe work involves containerizing our existing Node.js application with Docker, setting up GitHub Actions workflows for testing and deployment, provisioning AWS infrastructure (ECS, RDS, S3, CloudFront) with Terraform, and configuring staging and production environments with proper secrets management.',
        requirements: [
            '3+ years of DevOps / infrastructure experience',
            'Strong experience with Docker and container orchestration',
            'AWS certification or proven AWS project history',
            'Terraform infrastructure-as-code experience',
            'GitHub Actions CI/CD pipeline setup',
        ],
        deliverables: [
            'Dockerized application with multi-stage builds',
            'GitHub Actions pipeline (lint, test, build, deploy)',
            'Terraform scripts for AWS infrastructure',
            'Staging and production environment setup',
            'Documentation and runbook',
        ],
        posted: '3d ago',
        featured: false,
    },
    {
        id: 6,
        title: 'Machine Learning Recommendation Engine',
        client: 'DataEdge Co.',
        clientRating: 4.9,
        clientJoined: 'Apr 2023',
        clientLocation: 'New York, USA',
        clientJobsPosted: 6,
        category: 'AI/ML',
        budget: '$4,000–$7,000',
        duration: '8 weeks',
        location: 'Remote',
        proposals: 6,
        skills: ['Python', 'TensorFlow', 'FastAPI', 'SQL'],
        desc: 'Build a product recommendation system for our platform using collaborative filtering. Need clean API endpoints and performance benchmarks.',
        fullDesc: 'DataEdge Co. is an e-commerce analytics company looking to build a recommendation engine to power personalized product suggestions for our clients.\n\nThe model should use collaborative filtering (and optionally content-based filtering) trained on historical user interaction data. The trained model needs to be served via FastAPI with low-latency endpoints. We require thorough benchmarking, A/B test infrastructure, and clean Python code following ML engineering best practices.',
        requirements: [
            'Strong Python skills with ML libraries (TensorFlow, scikit-learn)',
            'Experience with collaborative filtering algorithms',
            'FastAPI or similar framework for model serving',
            'SQL proficiency for data preprocessing',
            'Familiarity with MLOps and model evaluation metrics',
        ],
        deliverables: [
            'Trained recommendation model',
            'FastAPI endpoints for real-time recommendations',
            'Performance benchmarks and evaluation report',
            'A/B testing infrastructure',
            'Jupyter notebooks for data exploration',
        ],
        posted: '4d ago',
        featured: true,
    },
];

export function getProjectById(id: number): Project | undefined {
    return projects.find(p => p.id === id);
}

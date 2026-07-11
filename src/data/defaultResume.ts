import type { Resume } from '../types/resume'
import { DEFAULT_PHOTO_CROP } from '../types/resume'

export const DEFAULT_PHOTO_URL = '/profile-photo.jpg'

export const defaultResume: Resume = {
  customLinks: [],
  personal: {
    fullName: 'Anthony Joshua T. Uy',
    title: 'Senior Full Stack Developer',
    phone: '+63 9475963451',
    email: 'anthonyjosh_uy@outlook.com',
    location: 'Davao City, PH',
    linkedin: 'https://linkedin.com/in/anthony-joshua-uy-7606141a6',
    github: 'https://github.com/pixelDigitTony',
    portfolio: '',
    photoUrl: DEFAULT_PHOTO_URL,
    photoOriginalUrl: DEFAULT_PHOTO_URL,
    photoCrop: DEFAULT_PHOTO_CROP,
  },
  summary:
    'Full Stack Developer with 3+ years of experience building production web applications using React, TypeScript, Node.js, Java/Spring Boot, PHP/Laravel, MySQL, and MongoDB. Experienced in multi-tenant business platforms, workflow automation, payroll and timekeeping systems, CRM integrations, secure authentication, and microservice support. Known for translating business needs into reliable software that improves operations and supports better decisions.',
  highlights: [
    'Built and maintained business-critical web applications across React, TypeScript, Node.js, Java/Spring Boot, PHP/Laravel, MySQL, and MongoDB stacks.',
    'Owned full-stack delivery for multi-tenant operating software, from architecture and MVP development through production-ready feature iterations.',
    'Developed payroll, timekeeping, CRM, and workflow automation features that reduced manual work for HR, sales, and operations teams.',
    'Supported secure authentication, authorization, testing, deployment, monitoring, and microservice automation for production systems.',
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Sparkle Star International Corporation',
      location: 'Davao City, PH',
      title: 'Senior Full Stack Developer',
      startDate: '08/2023',
      endDate: 'Present',
      bullets: [
        'Designed and implemented multi-tenant EOS-style business operating software using React, TypeScript, Node.js, and MongoDB.',
        'Led full-stack delivery for core product modules, including architecture, implementation, iteration, and deployment coordination.',
        'Translated stakeholder feedback into MVP enhancements aligned with business priorities and daily operational needs.',
        'Built pipeline automations and CRM integrations that streamlined sales, follow-up, and operations workflows.',
        'Developed timekeeping and payroll features that reduced manual HR processing and improved payroll workflow reliability.',
        'Improved freelancer onboarding through targeted UX and workflow updates that made setup and task management easier.',
      ],
    },
    {
      id: 'exp-2',
      company: 'ChatChatABC Philippines Inc.',
      location: 'Davao City, PH',
      title: 'Java Developer',
      startDate: '10/2022',
      endDate: '07/2023',
      bullets: [
        'Developed JUnit 5 tests that improved code quality, maintainability, and compliance with development standards.',
        'Implemented secure authentication and authorization flows using Spring Security 5.',
        'Built and deployed a location-specific Java application to a live production server.',
        'Led microservice automation work for ECS instances supporting a banking client environment.',
        'Collaborated on code reviews, production deployment, monitoring, troubleshooting, and maintenance.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Apollo Lighting',
      location: 'Davao City',
      title: 'PHP Developer',
      startDate: '02/2022',
      endDate: '08/2022',
      bullets: [
        'Maintained internal and client-facing POS and ERP web modules using PHP and Laravel.',
        'Resolved client-reported input and data issues, improving accuracy across operational workflows.',
        'Collaborated with teammates to troubleshoot production issues and complete post-maintenance deliverables.',
      ],
    },
  ],
  projects: [
    {
      id: 'project-operations-platform',
      name: 'Multi-Tenant Business Operating Platform',
      description:
        'SaaS-style operating software for coordinating company goals, workflows, users, and operational modules.',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      bullets: [
        'Designed full-stack modules for multi-tenant business workflows, user-facing screens, and data persistence.',
        'Iterated MVP features based on stakeholder feedback, business priorities, and usability improvements.',
      ],
    },
    {
      id: 'project-payroll-timekeeping',
      name: 'Timekeeping and Payroll Workflow System',
      description:
        'Internal HR workflow features for attendance tracking, payroll preparation, and manual-process reduction.',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      bullets: [
        'Built timekeeping and payroll features to reduce repetitive HR work and improve processing reliability.',
        'Improved workflow clarity for staff through cleaner data entry, review, and task flows.',
      ],
    },
  ],
  skillGroups: [
    {
      id: 'skills-languages',
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
      id: 'skills-backend',
      label: 'Backend & APIs',
      skills: [
        'Spring Boot',
        'Spring Data JPA',
        'Node.js',
        'ExpressJS',
        'Laravel',
        'CodeIgniter',
        'REST APIs',
        'GraphQL',
        'Microservices',
        'Spring Security',
      ],
    },
    {
      id: 'skills-frontend',
      label: 'Frontend',
      skills: [
        'React',
        'Vue 2/3',
        'Vite',
        'Thymeleaf',
        'jQuery',
        'AJAX',
        'HTML',
        'CSS',
      ],
    },
    {
      id: 'skills-ui-design-systems',
      label: 'UI & Design Systems',
      skills: ['Figma', 'shadcn/ui', 'Material UI (MUI)', 'Mantine UI'],
    },
    {
      id: 'skills-data-messaging',
      label: 'Data & Messaging',
      skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Kafka', 'RabbitMQ'],
    },
    {
      id: 'skills-cloud-deployment',
      label: 'Cloud & Deployment',
      skills: ['Render', 'Vercel', 'Cloudflare', 'Docker', 'Git', 'PuTTY'],
    },
    {
      id: 'skills-testing',
      label: 'Testing & Build Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman', 'Maven'],
    },
    {
      id: 'skills-cross-platform',
      label: 'Cross-Platform Apps',
      skills: ['Electron', 'Expo', 'Flutter', 'React Native', 'Android XML'],
    },
    {
      id: 'skills-domains',
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  education: {
    institution: 'Ateneo de Davao University',
    location: 'Davao City',
    degree: 'Bachelor of Science in Information Technology',
    graduationYear: '',
  },
  languages: ['English', 'Tagalog', 'Cebuano'],
}

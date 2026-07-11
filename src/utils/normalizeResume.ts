import { defaultResume } from '../data/defaultResume'
import { DEFAULT_PHOTO_CROP, type Resume } from '../types/resume'

const legacyDefaultSkillGroupSignatures = [
  [
    {
      label: 'Core Stack',
      skills: ['React', 'TypeScript', 'Node.js', 'Java', 'Spring Boot', 'PHP', 'Laravel'],
    },
    {
      label: 'Databases',
      skills: ['MySQL', 'MongoDB', 'SQL'],
    },
    {
      label: 'Engineering',
      skills: [
        'REST APIs',
        'Microservices',
        'Spring Security',
        'JUnit 5',
        'Maven',
        'Git',
        'API Integrations',
      ],
    },
    {
      label: 'Business Domains',
      skills: ['SaaS', 'Multi-tenant Systems', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  [
    {
      label: 'Backend',
      skills: ['Java', 'Spring Boot', 'Spring', 'PHP', 'Laravel', 'ExpressJS'],
    },
    {
      label: 'Frontend',
      skills: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Thymeleaf'],
    },
    {
      label: 'Data & DevOps',
      skills: ['MySQL', 'MongoDB', 'SQL', 'Git', 'Maven', 'Docker', 'Kafka', 'RabbitMQ'],
    },
    {
      label: 'Testing Tools & Unit Testing Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'Postman', 'JUnit 5'],
    },
  ],
  [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
      label: 'Backend & APIs',
      skills: [
        'Spring Boot',
        'Spring',
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
      label: 'Data & Infrastructure',
      skills: [
        'MySQL',
        'MongoDB',
        'Firebase',
        'Docker',
        'Kafka',
        'RabbitMQ',
        'Maven',
        'Git',
        'PuTTY',
      ],
    },
    {
      label: 'Testing & API Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman'],
    },
    {
      label: 'Mobile',
      skills: ['Flutter', 'React Native', 'Android XML'],
    },
    {
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
      label: 'Backend & APIs',
      skills: [
        'Spring Boot',
        'Spring',
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
      label: 'Data & Messaging',
      skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Kafka', 'RabbitMQ'],
    },
    {
      label: 'Cloud & Deployment',
      skills: ['Render', 'Cloudflare', 'Docker', 'Git', 'Maven', 'PuTTY'],
    },
    {
      label: 'Testing & API Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman'],
    },
    {
      label: 'Mobile',
      skills: ['Flutter', 'React Native', 'Android XML'],
    },
    {
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
      label: 'Backend & APIs',
      skills: [
        'Spring Boot',
        'Spring',
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
      label: 'UI & Design Systems',
      skills: ['Figma', 'shadcn/ui', 'Material UI (MUI)', 'Mantine UI'],
    },
    {
      label: 'Data & Messaging',
      skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Kafka', 'RabbitMQ'],
    },
    {
      label: 'Cloud & Deployment',
      skills: ['Render', 'Cloudflare', 'Docker', 'Git', 'Maven', 'PuTTY'],
    },
    {
      label: 'Testing & API Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman'],
    },
    {
      label: 'Mobile',
      skills: ['Flutter', 'React Native', 'Android XML'],
    },
    {
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
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
      label: 'UI & Design Systems',
      skills: ['Figma', 'shadcn/ui', 'Material UI (MUI)', 'Mantine UI'],
    },
    {
      label: 'Data & Messaging',
      skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Kafka', 'RabbitMQ'],
    },
    {
      label: 'Cloud & Deployment',
      skills: ['Render', 'Cloudflare', 'Docker', 'Git', 'PuTTY'],
    },
    {
      label: 'Testing & Build Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman', 'Maven'],
    },
    {
      label: 'Mobile',
      skills: ['Flutter', 'React Native', 'Android XML'],
    },
    {
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
  [
    {
      label: 'Languages',
      skills: ['TypeScript', 'JavaScript', 'Java', 'PHP', 'SQL', 'C#', 'C++', 'Kotlin'],
    },
    {
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
      label: 'UI & Design Systems',
      skills: ['Figma', 'shadcn/ui', 'Material UI (MUI)', 'Mantine UI'],
    },
    {
      label: 'Data & Messaging',
      skills: ['MySQL', 'MongoDB', 'Firebase', 'Supabase', 'Kafka', 'RabbitMQ'],
    },
    {
      label: 'Cloud & Deployment',
      skills: ['Render', 'Cloudflare', 'Docker', 'Git', 'PuTTY'],
    },
    {
      label: 'Testing & Build Tools',
      skills: ['Playwright', 'Vitest', 'Jest', 'JUnit 5', 'Postman', 'Maven'],
    },
    {
      label: 'Cross-Platform Apps',
      skills: ['Electron', 'Expo', 'Flutter', 'React Native', 'Android XML'],
    },
    {
      label: 'Product Domains',
      skills: ['Multi-tenant SaaS', 'CRM', 'Payroll', 'Timekeeping', 'POS', 'ERP'],
    },
  ],
]

function hasLegacyDefaultSkills(data: Partial<Resume>) {
  const skillGroups = data.skillGroups
  if (!skillGroups) return false

  return legacyDefaultSkillGroupSignatures.some((signature) => {
    if (skillGroups.length !== signature.length) return false

    return signature.every((group, index) => {
      const skillGroup = skillGroups[index]
      return (
        skillGroup.label === group.label &&
        JSON.stringify(skillGroup.skills) === JSON.stringify(group.skills)
      )
    })
  })
}

export function normalizeResume(data: Partial<Resume> | null | undefined): Resume {
  if (!data) return defaultResume

  const personal = { ...defaultResume.personal, ...data.personal }
  const skillGroups = hasLegacyDefaultSkills(data)
    ? defaultResume.skillGroups
    : data.skillGroups ?? defaultResume.skillGroups

  return {
    ...defaultResume,
    ...data,
    personal: {
      ...personal,
      photoOriginalUrl: personal.photoOriginalUrl || personal.photoUrl || defaultResume.personal.photoUrl,
      photoCrop: personal.photoCrop ?? DEFAULT_PHOTO_CROP,
    },
    customLinks: data.customLinks ?? [],
    highlights: data.highlights ?? defaultResume.highlights,
    experience: data.experience ?? defaultResume.experience,
    projects: data.projects ?? defaultResume.projects,
    skillGroups,
    education: { ...defaultResume.education, ...data.education },
    languages: data.languages ?? defaultResume.languages,
    summary: data.summary ?? defaultResume.summary,
  }
}

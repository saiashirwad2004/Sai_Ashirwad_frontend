import type { Skill } from '@/types';

export const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 95, category: 'frontend' },
  { name: 'TypeScript', level: 90, category: 'frontend' },
  { name: 'Next.js', level: 88, category: 'frontend' },
  { name: 'Vue.js', level: 80, category: 'frontend' },
  { name: 'Tailwind CSS', level: 95, category: 'frontend' },
  { name: 'Three.js', level: 75, category: 'frontend' },
  
  // Backend
  { name: 'Node.js', level: 90, category: 'backend' },
  { name: 'Express', level: 88, category: 'backend' },
  { name: 'Python', level: 85, category: 'backend' },
  { name: 'FastAPI', level: 80, category: 'backend' },
  { name: 'GraphQL', level: 78, category: 'backend' },
  { name: 'REST APIs', level: 92, category: 'backend' },
  
  // Database
  { name: 'PostgreSQL', level: 85, category: 'database' },
  { name: 'MongoDB', level: 88, category: 'database' },
  { name: 'Redis', level: 80, category: 'database' },
  { name: 'Prisma', level: 85, category: 'database' },
  
  // Tools
  { name: 'Git', level: 90, category: 'tools' },
  { name: 'Docker', level: 82, category: 'tools' },
  { name: 'AWS', level: 78, category: 'tools' },
  { name: 'CI/CD', level: 80, category: 'tools' },
  { name: 'Linux', level: 85, category: 'tools' },
  
  // Other
  { name: 'Agile/Scrum', level: 88, category: 'other' },
  { name: 'System Design', level: 82, category: 'other' },
  { name: 'Testing', level: 85, category: 'other' },
];

export const getSkillsByCategory = (category: Skill['category']) => {
  return skills.filter(skill => skill.category === category);
};

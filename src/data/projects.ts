import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with real-time inventory and payment processing.',
    longDescription: `This comprehensive e-commerce platform was built to handle high-traffic online retail operations. It features a modern React frontend with a Node.js backend, integrated with Stripe for secure payments and real-time inventory management.

Key features include:
- Real-time inventory tracking and updates
- Secure payment processing with Stripe
- User authentication and authorization
- Admin dashboard for product management
- Order tracking and notification system
- Responsive design for all devices
- SEO optimization for better visibility

The platform handles thousands of concurrent users and processes hundreds of transactions daily with 99.9% uptime.`,
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Socket.io', 'Redis'],
    github: 'https://github.com/anandverse/ecommerce-platform',
    live: 'https://demo-ecommerce.anandverse.space',
    featured: true,
    date: '2024-01-15'
  },
  {
    id: 'task-management',
    title: 'Task Management System',
    description: 'Collaborative task management tool with real-time updates and team workflows.',
    longDescription: `A powerful task management system designed for modern teams. Built with Next.js and PostgreSQL, it offers real-time collaboration features, customizable workflows, and comprehensive analytics.

Key features include:
- Drag-and-drop task organization
- Real-time collaboration with WebSockets
- Custom workflow creation
- Team analytics and reporting
- Integration with popular tools (Slack, GitHub)
- Mobile-responsive design
- Dark/light mode support

The system has helped teams increase productivity by 40% on average.`,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    github: 'https://github.com/anandverse/task-management',
    live: 'https://tasks.anandverse.space',
    featured: true,
    date: '2023-11-20'
  },
  {
    id: 'ai-image-generator',
    title: 'AI Image Generator',
    description: 'Web application that generates images using AI models with custom prompts.',
    longDescription: `An innovative AI-powered image generation platform that leverages state-of-the-art machine learning models. Users can create stunning visuals from text descriptions with various style options.

Key features include:
- Text-to-image generation using Stable Diffusion
- Multiple art style presets
- Image editing and enhancement tools
- Gallery management system
- API for third-party integrations
- Batch processing capabilities
- High-resolution output support

The platform has generated over 100,000 images for users worldwide.`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    tags: ['React', 'Python', 'FastAPI', 'TensorFlow', 'AWS', 'Docker'],
    github: 'https://github.com/anandverse/ai-image-gen',
    live: 'https://ai-images.anandverse.space',
    featured: true,
    date: '2024-02-10'
  },
  {
    id: 'finance-dashboard',
    title: 'Finance Dashboard',
    description: 'Real-time financial data visualization dashboard with interactive charts.',
    longDescription: `A comprehensive financial analytics dashboard that provides real-time market data visualization. Built with React and D3.js, it offers powerful charting capabilities and portfolio management tools.

Key features include:
- Real-time stock price tracking
- Interactive candlestick and line charts
- Portfolio performance analytics
- Risk assessment tools
- News integration
- Alert system for price movements
- Export capabilities for reports

Used by over 5,000 traders and investors for daily market analysis.`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['React', 'D3.js', 'Node.js', 'WebSocket', 'PostgreSQL', 'Redis'],
    github: 'https://github.com/anandverse/finance-dashboard',
    live: 'https://finance.anandverse.space',
    featured: false,
    date: '2023-09-05'
  },
  {
    id: 'social-media-app',
    title: 'Social Media Platform',
    description: 'Full-featured social media application with posts, stories, and messaging.',
    longDescription: `A modern social media platform built with the MERN stack. Features include user profiles, posts with media support, stories, direct messaging, and a recommendation algorithm.

Key features include:
- User authentication with JWT
- Image and video uploads
- Real-time messaging with Socket.io
- Story feature with 24h expiration
- Like, comment, and share functionality
- Content recommendation algorithm
- Push notifications

The platform has 10,000+ active users with high engagement rates.`,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    tags: ['React Native', 'Node.js', 'MongoDB', 'Socket.io', 'AWS S3'],
    github: 'https://github.com/anandverse/social-app',
    featured: false,
    date: '2023-07-18'
  },
  {
    id: 'weather-app',
    title: 'Weather Forecast App',
    description: 'Beautiful weather application with detailed forecasts and location-based alerts.',
    longDescription: `A visually stunning weather application that provides accurate forecasts and severe weather alerts. Built with React Native for cross-platform compatibility.

Key features include:
- 7-day weather forecasts
- Hourly predictions
- Severe weather alerts
- Location-based recommendations
- Interactive weather maps
- Widget support
- Offline mode

Rated 4.8 stars with over 50,000 downloads.`,
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop',
    tags: ['React Native', 'Weather API', 'Geolocation', 'Push Notifications'],
    github: 'https://github.com/anandverse/weather-app',
    live: 'https://weather.anandverse.space',
    featured: false,
    date: '2023-05-22'
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

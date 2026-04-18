import type { BlogPost } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: 'modern-react-patterns',
    title: 'Modern React Patterns You Should Know in 2024',
    excerpt: 'Explore the latest React patterns and best practices that will help you build better applications.',
    content: `React has evolved significantly over the years, and with it, the patterns we use to build applications. In this article, we'll explore the most important patterns you should know in 2024.

## Compound Components

Compound components are a powerful pattern for creating flexible and reusable component APIs. They allow you to compose components together while maintaining internal state and logic.

\`\`\`jsx
const Select = ({ children }) => {
  const [selected, setSelected] = useState(null);
  return (
    <SelectContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectContext.Provider>
  );
};

Select.Option = ({ value, children }) => {
  const { selected, setSelected } = useContext(SelectContext);
  return (
    <div onClick={() => setSelected(value)}>
      {children}
    </div>
  );
};
\`\`\`

## Custom Hooks

Custom hooks are essential for reusing stateful logic across components. They help keep your components clean and focused on presentation.

## Render Props and Higher-Order Components

While less common now with hooks, these patterns still have their place in certain scenarios.

## Conclusion

Mastering these patterns will make you a more effective React developer and help you build more maintainable applications.`,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    tags: ['React', 'JavaScript', 'Web Development'],
    date: '2024-03-01',
    readTime: '8 min read',
    author: 'Sai Ashirwad'
  },
  {
    id: 'typescript-best-practices',
    title: 'TypeScript Best Practices for Large Applications',
    excerpt: 'Learn how to effectively use TypeScript to build scalable and maintainable applications.',
    content: `TypeScript has become the standard for building large-scale JavaScript applications. Here are the best practices I've learned from years of working with TypeScript.

## Strict Mode

Always enable strict mode in your tsconfig.json. It catches more errors and leads to better code quality.

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## Type Inference

Let TypeScript infer types when possible. Explicit type annotations should be used when inference isn't clear.

## Discriminated Unions

Use discriminated unions for better type safety in complex state management.

## Conclusion

Following these practices will help you get the most out of TypeScript and avoid common pitfalls.`,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    date: '2024-02-15',
    readTime: '6 min read',
    author: 'Sai Ashirwad'
  },
  {
    id: 'web-performance',
    title: 'Web Performance Optimization Techniques',
    excerpt: 'Essential techniques to improve your website loading speed and user experience.',
    content: `Web performance is crucial for user experience and SEO. In this article, we'll cover the most effective optimization techniques.

## Code Splitting

Split your code into smaller chunks that can be loaded on demand. This reduces the initial bundle size.

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
\`\`\`

## Image Optimization

Use modern image formats like WebP and implement lazy loading for images below the fold.

## Caching Strategies

Implement effective caching using service workers and proper cache headers.

## Conclusion

These techniques will significantly improve your website's performance metrics.`,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
    tags: ['Performance', 'Web Development', 'Optimization'],
    date: '2024-01-28',
    readTime: '10 min read',
    author: 'Sai Ashirwad'
  },
  {
    id: 'threejs-basics',
    title: 'Getting Started with Three.js for Web Developers',
    excerpt: 'A beginner-friendly guide to creating 3D experiences on the web with Three.js.',
    content: `Three.js makes it easy to create 3D graphics in the browser. This guide will get you started with the basics.

## Setting Up

First, install Three.js via npm:

\`\`\`bash
npm install three
\`\`\`

## Creating a Scene

The basic structure of a Three.js application includes a scene, camera, and renderer.

\`\`\`javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
\`\`\`

## Adding Objects

Create and add 3D objects to your scene:

\`\`\`javascript
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
\`\`\`

## Animation Loop

Animate your scene with a render loop:

\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
\`\`\`

## Conclusion

Three.js opens up endless possibilities for creative web experiences. Start experimenting and build something amazing!`,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=500&fit=crop',
    tags: ['Three.js', '3D', 'WebGL', 'JavaScript'],
    date: '2024-01-10',
    readTime: '7 min read',
    author: 'Sai Ashirwad'
  },
  {
    id: 'fullstack-deployment',
    title: 'Full-Stack Deployment Strategies for Modern Apps',
    excerpt: 'Learn different approaches to deploying full-stack applications in production.',
    content: `Deploying full-stack applications requires careful planning. This article covers various deployment strategies and best practices.

## Containerization with Docker

Docker containers ensure consistency across development and production environments.

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## CI/CD Pipelines

Set up continuous integration and deployment for automated testing and deployment.

## Environment Management

Properly manage environment variables and secrets for different deployment stages.

## Conclusion

Choose the deployment strategy that best fits your application requirements and team expertise.`,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=500&fit=crop',
    tags: ['DevOps', 'Deployment', 'Docker', 'CI/CD'],
    date: '2023-12-20',
    readTime: '9 min read',
    author: 'Sai Ashirwad'
  }
];

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getRecentPosts = (count: number = 3): BlogPost[] => {
  return blogPosts.slice(0, count);
};

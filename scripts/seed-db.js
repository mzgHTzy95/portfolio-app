/**
 * Seed script to initialize the database with data from resume.tsx
 * Run with: node scripts/seed-db.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database file location
const dbPath = path.join(process.cwd(), '.data', 'portfolio.db');

// Ensure .data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Helper to generate ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Sample data from resume.tsx
const DATA = {
  work: [
    {
      company: "Atomic Finance",
      href: "https://atomic.finance",
      badges: [],
      location: "Remote",
      title: "Bitcoin Protocol Engineer",
      logoUrl: "/atomic.png",
      start: "May 2021",
      end: "Oct 2022",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
    },
    {
      company: "Shopify",
      badges: [],
      href: "https://shopify.com",
      location: "Remote",
      title: "Software Engineer",
      logoUrl: "/shopify.svg",
      start: "January 2021",
      end: "April 2021",
      description:
        "Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production.",
    },
  ],
  education: [
    {
      school: "Buildspace",
      href: "https://buildspace.so",
      degree: "s3, s4, sf1, s5",
      logoUrl: "/buildspace.jpg",
      start: "2023",
      end: "2024",
    },
    {
      school: "University of Waterloo",
      href: "https://uwaterloo.ca",
      degree: "Bachelor's Degree of Computer Science (BCS)",
      logoUrl: "/waterloo.png",
      start: "2016",
      end: "2021",
    },
  ],
  projects: [
    {
      title: "Chat Collect",
      href: "https://chatcollect.com",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "With the release of the OpenAI GPT Store, I decided to build a SaaS which allows users to collect email addresses from their GPT users.",
      technologies: ["Next.js", "Typescript", "PostgreSQL", "Prisma", "TailwindCSS"],
      links: [
        {
          type: "Website",
          href: "https://chatcollect.com",
        },
      ],
      image: "",
      video: "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
    },
    {
      title: "Magic UI",
      href: "https://magicui.design",
      dates: "June 2023 - Present",
      active: true,
      description: "Designed, developed and sold animated UI components for developers.",
      technologies: ["Next.js", "Typescript", "PostgreSQL", "Prisma", "TailwindCSS"],
      links: [
        {
          type: "Website",
          href: "https://magicui.design",
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
  ],
};

try {
  // Check if data already exists
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get();
  if (projectCount.count > 0) {
    console.log('✓ Database already seeded');
    process.exit(0);
  }

  // Insert projects
  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, description, dates, active, technologies, links, video, image, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  DATA.projects.forEach((project) => {
    const id = generateId();
    const now = Date.now();
    insertProject.run(
      id,
      project.title,
      project.description,
      project.dates,
      project.active ? 1 : 0,
      JSON.stringify(project.technologies || []),
      JSON.stringify(project.links || []),
      project.video || '',
      project.image || '',
      now,
      now
    );
  });

  // Insert work experience
  const insertWork = db.prepare(`
    INSERT INTO work_experience (id, company, title, description, location, badges, logoUrl, href, start, end, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  DATA.work.forEach((work) => {
    const id = generateId();
    const now = Date.now();
    insertWork.run(
      id,
      work.company,
      work.title,
      work.description,
      work.location || '',
      JSON.stringify(work.badges || []),
      work.logoUrl || '',
      work.href || '',
      work.start,
      work.end,
      now,
      now
    );
  });

  // Insert education
  const insertEducation = db.prepare(`
    INSERT INTO education (id, school, degree, logoUrl, href, start, end, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  DATA.education.forEach((edu) => {
    const id = generateId();
    const now = Date.now();
    insertEducation.run(
      id,
      edu.school,
      edu.degree,
      edu.logoUrl || '',
      edu.href || '',
      edu.start,
      edu.end,
      now,
      now
    );
  });

  console.log('✓ Database seeded successfully');
  console.log(`  - ${DATA.projects.length} projects`);
  console.log(`  - ${DATA.work.length} work experiences`);
  console.log(`  - ${DATA.education.length} education entries`);

  db.close();
  process.exit(0);
} catch (error) {
  console.error('✗ Error seeding database:', error.message);
  process.exit(1);
}

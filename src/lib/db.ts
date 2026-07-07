import path from 'path';
import fs from 'fs';

// Database file location - use JSON for server-side compatibility
const dbDir = path.join(process.cwd(), '.data');
const dbPath = path.join(dbDir, 'portfolio-data.json');

// Ensure .data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize or load database
interface DatabaseSchema {
  projects: any[];
  blog_posts: any[];
  work_experience: any[];
  education: any[];
  contact_submissions: any[];
}

let dbData: DatabaseSchema = {
  projects: [],
  blog_posts: [],
  work_experience: [],
  education: [],
  contact_submissions: [],
};

function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      dbData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Load database on module import
loadDatabase();

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Projects
export function getAllProjects() {
  return dbData.projects.sort((a, b) => b.createdAt - a.createdAt);
}

export function getProjectById(id: string) {
  return dbData.projects.find(p => p.id === id);
}

export function createProject(project: any) {
  const id = generateId();
  const now = Date.now();
  const newProject = {
    id,
    title: project.title,
    description: project.description,
    dates: project.dates,
    active: project.active !== false,
    technologies: project.technologies || [],
    links: project.links || [],
    video: project.video || '',
    image: project.image || '',
    createdAt: now,
    updatedAt: now,
  };
  dbData.projects.push(newProject);
  saveDatabase();
  return newProject;
}

export function updateProject(id: string, project: any) {
  const index = dbData.projects.findIndex(p => p.id === id);
  if (index === -1) return;
  
  const now = Date.now();
  dbData.projects[index] = {
    ...dbData.projects[index],
    title: project.title,
    description: project.description,
    dates: project.dates,
    active: project.active !== false,
    technologies: project.technologies || [],
    links: project.links || [],
    video: project.video || '',
    image: project.image || '',
    updatedAt: now,
  };
  saveDatabase();
}

export function deleteProject(id: string) {
  dbData.projects = dbData.projects.filter(p => p.id !== id);
  saveDatabase();
}

// Blog Posts
export function getAllBlogPosts() {
  return dbData.blog_posts
    .sort((a, b) => {
      const aTime = a.publishedAt || a.createdAt;
      const bTime = b.publishedAt || b.createdAt;
      return bTime - aTime;
    });
}

export function getBlogPostBySlug(slug: string) {
  return dbData.blog_posts.find(p => p.slug === slug);
}

export function getBlogPostById(id: string) {
  return dbData.blog_posts.find(p => p.id === id);
}

export function createBlogPost(post: any) {
  const id = generateId();
  const now = Date.now();
  const newPost = {
    id,
    slug: post.slug,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    publishedAt: post.publishedAt || now,
    featured: post.featured || false,
    createdAt: now,
    updatedAt: now,
  };
  dbData.blog_posts.push(newPost);
  saveDatabase();
  return newPost;
}

export function updateBlogPost(id: string, post: any) {
  const index = dbData.blog_posts.findIndex(p => p.id === id);
  if (index === -1) return;
  
  const now = Date.now();
  dbData.blog_posts[index] = {
    ...dbData.blog_posts[index],
    slug: post.slug,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || '',
    publishedAt: post.publishedAt || Date.now(),
    featured: post.featured || false,
    updatedAt: now,
  };
  saveDatabase();
}

export function deleteBlogPost(id: string) {
  dbData.blog_posts = dbData.blog_posts.filter(p => p.id !== id);
  saveDatabase();
}

// Work Experience
export function getAllWorkExperience() {
  return dbData.work_experience.sort((a, b) => b.createdAt - a.createdAt);
}

export function getWorkById(id: string) {
  return dbData.work_experience.find(w => w.id === id);
}

export function createWorkExperience(work: any) {
  const id = generateId();
  const now = Date.now();
  const newWork = {
    id,
    company: work.company,
    title: work.title,
    description: work.description,
    location: work.location || '',
    badges: work.badges || [],
    logoUrl: work.logoUrl || '',
    href: work.href || '',
    start: work.start,
    end: work.end,
    createdAt: now,
    updatedAt: now,
  };
  dbData.work_experience.push(newWork);
  saveDatabase();
  return newWork;
}

export function updateWorkExperience(id: string, work: any) {
  const index = dbData.work_experience.findIndex(w => w.id === id);
  if (index === -1) return;
  
  const now = Date.now();
  dbData.work_experience[index] = {
    ...dbData.work_experience[index],
    company: work.company,
    title: work.title,
    description: work.description,
    location: work.location || '',
    badges: work.badges || [],
    logoUrl: work.logoUrl || '',
    href: work.href || '',
    start: work.start,
    end: work.end,
    updatedAt: now,
  };
  saveDatabase();
}

export function deleteWorkExperience(id: string) {
  dbData.work_experience = dbData.work_experience.filter(w => w.id !== id);
  saveDatabase();
}

// Education
export function getAllEducation() {
  return dbData.education.sort((a, b) => b.createdAt - a.createdAt);
}

export function getEducationById(id: string) {
  return dbData.education.find(e => e.id === id);
}

export function createEducation(edu: any) {
  const id = generateId();
  const now = Date.now();
  const newEdu = {
    id,
    school: edu.school,
    degree: edu.degree,
    logoUrl: edu.logoUrl || '',
    href: edu.href || '',
    start: edu.start,
    end: edu.end,
    createdAt: now,
    updatedAt: now,
  };
  dbData.education.push(newEdu);
  saveDatabase();
  return newEdu;
}

export function updateEducation(id: string, edu: any) {
  const index = dbData.education.findIndex(e => e.id === id);
  if (index === -1) return;
  
  const now = Date.now();
  dbData.education[index] = {
    ...dbData.education[index],
    school: edu.school,
    degree: edu.degree,
    logoUrl: edu.logoUrl || '',
    href: edu.href || '',
    start: edu.start,
    end: edu.end,
    updatedAt: now,
  };
  saveDatabase();
}

export function deleteEducation(id: string) {
  dbData.education = dbData.education.filter(e => e.id !== id);
  saveDatabase();
}

// Contact Submissions
export function getAllContactSubmissions() {
  return dbData.contact_submissions.sort((a, b) => b.createdAt - a.createdAt);
}

export function getContactSubmissionById(id: string) {
  return dbData.contact_submissions.find(c => c.id === id);
}

export function createContactSubmission(contact: any) {
  const id = generateId();
  const now = Date.now();
  const newContact = {
    id,
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
    read: false,
    archived: false,
    createdAt: now,
  };
  dbData.contact_submissions.push(newContact);
  saveDatabase();
  return newContact;
}

export function updateContactSubmission(id: string, updates: any) {
  const index = dbData.contact_submissions.findIndex(c => c.id === id);
  if (index === -1) return;
  
  dbData.contact_submissions[index] = {
    ...dbData.contact_submissions[index],
    read: updates.read || false,
    archived: updates.archived || false,
  };
  saveDatabase();
}

export function deleteContactSubmission(id: string) {
  dbData.contact_submissions = dbData.contact_submissions.filter(c => c.id !== id);
  saveDatabase();
}

export default { getAllProjects, getProjectById, createProject, updateProject, deleteProject };

/**
 * Firestore Seed Script
 * 
 * Run this once to populate your Firestore database with initial data.
 * Usage: Set your Firebase config in .env.local, then run:
 *   npx tsx src/lib/seed.ts
 * 
 * NOTE: This script uses the Firebase Web SDK and runs in Node.js via tsx.
 * Make sure your Firestore security rules allow writes, or use the Firebase Admin SDK for production seeding.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Timestamp } from 'firebase/firestore';

// Read env vars — in Node context with tsx, we load from process.env or hardcode
// For simplicity, paste your Firebase config here temporarily, or use dotenv.
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBOKtoyee4K5aRQ2NbY8W8htej5W5CmQiw',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'lasustech-repository.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'lasustech-repository',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'lasustech-repository.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '679123900694',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:679123900694:web:99545245f6a4ef89821837',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FACULTIES = [
  {
    id: 'science',
    name: 'Faculty of Science',
    description: 'Pioneering breakthroughs in natural sciences, biological research, and computational theories.',
    papers: 1402,
    departments: 8,
    icon: 'science',
    color: 'secondary',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9d38452a6?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 'engineering',
    name: 'Faculty of Engineering',
    description: 'Advancing technical frontiers in civil, mechanical, and electrical infrastructures across the region.',
    papers: 894,
    departments: 6,
    icon: 'precision_manufacturing',
    color: 'primary',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'agriculture',
    name: 'Faculty of Agriculture',
    description: 'Sustainable food security and innovative cultivation technologies for urban and rural development.',
    papers: 612,
    departments: 5,
    icon: 'agriculture',
    color: 'tertiary',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'management',
    name: 'Management Sciences',
    description: 'Driving the economic engine of Lagos through advanced business strategy, accounting, and public administration research.',
    papers: 1105,
    departments: 7,
    icon: 'analytics',
    color: 'primary',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
  }
];

const PAPERS = [
  {
    id: 'cit-851-advanced-systems-analysis-design',
    title: 'Advanced Systems Analysis and Design',
    courseCode: 'CIT 851',
    level: '800 Level',
    year: 'Undated',
    semester: '2nd Semester',
    downloads: 142,
    pages: 6,
    date: 'Recently added',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/Advance%20System%20and%20Designs.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '1',
    title: 'Computer Programming',
    courseCode: 'CSC 201',
    level: '200 Level',
    year: '2023/2024',
    semester: '1st Semester',
    downloads: 824,
    pages: 8,
    date: '3 days ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/COMPUTER%20PROGRAMMING.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '2',
    title: 'Data Mining and Warehouse',
    courseCode: 'CSC 411',
    level: '400 Level',
    year: '2022/2023',
    semester: '2nd Semester',
    downloads: 512,
    pages: 10,
    date: '5 days ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/Data%20Mining%20and%20Warehouse.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: '3',
    title: 'Internet Communication and Architecture',
    courseCode: 'CSC 315',
    level: '300 Level',
    year: '2022/2023',
    semester: '1st Semester',
    downloads: 642,
    pages: 12,
    date: '1 week ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/Internet%20Communication%20and%20Architecture.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'csc-205-object-oriented-programming',
    title: 'Object Oriented Programming',
    courseCode: 'CSC 205',
    level: '200 Level',
    year: '2023/2024',
    semester: '1st Semester',
    downloads: 935,
    pages: 15,
    date: '2 weeks ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/OBJECT%20ORIENTED%20PROGRAMMING.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'csc-308-web-design-programming',
    title: 'Web Design and Programming',
    courseCode: 'CSC 308',
    level: '300 Level',
    year: '2023/2024',
    semester: '2nd Semester',
    downloads: 1205,
    pages: 14,
    date: '3 weeks ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/Web%20Design%20and%20Programming.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    id: 'csc-415-wireless-communication',
    title: 'Wireless Communication',
    courseCode: 'CSC 415',
    level: '400 Level',
    year: '2022/2023',
    semester: '2nd Semester',
    downloads: 730,
    pages: 9,
    date: '1 month ago',
    type: 'Past Question',
    status: 'published',
    facultyId: 'science',
    departmentId: 'computer-science',
    fileUrl: '/papers/Wireless%20Communication.docx',
    uploadedBy: 'system',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Seed faculties
  console.log('📁 Seeding faculties...');
  for (const faculty of FACULTIES) {
    const { id, ...data } = faculty;
    await setDoc(doc(db, 'faculties', id), data);
    console.log(`  ✓ ${faculty.name}`);
  }

  // Seed papers
  console.log('\n📄 Seeding papers...');
  for (const paper of PAPERS) {
    const { id, ...data } = paper;
    await setDoc(doc(db, 'papers', id), data);
    console.log(`  ✓ ${paper.title} (${paper.courseCode})`);
  }

  console.log('\n✅ Seeding complete! Your Firestore database is ready.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

import { Faculty, Paper } from './types';

export const FACULTIES: Faculty[] = [
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

export const RECENT_PAPERS: Paper[] = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    courseCode: 'CSC 202',
    level: '200 Level',
    year: '2022/2023',
    semester: '2nd Semester',
    downloads: 1284,
    pages: 12,
    date: '2 days ago',
    type: 'Past Question',
    status: 'published'
  },
  {
    id: '2',
    title: 'Introduction to AI',
    courseCode: 'CSC 401',
    level: '400 Level',
    year: '2023/2024',
    semester: '1st Semester',
    downloads: 450,
    pages: 45,
    date: '5 days ago',
    type: 'Lecture Note',
    status: 'published'
  },
  {
    id: '3',
    title: 'Network Security',
    courseCode: 'CSC 305',
    level: '300 Level',
    year: '2022/2023',
    semester: '1st Semester',
    downloads: 820,
    pages: 8,
    date: '1 week ago',
    type: 'Past Question',
    status: 'published'
  }
];

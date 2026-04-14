export interface Faculty {
  id: string;
  name: string;
  description: string;
  papers: number;
  departments: number;
  icon: string;
  color: string;
  image: string;
  featured?: boolean;
}

export interface Paper {
  id: string;
  title: string;
  courseCode: string;
  level: string;
  year: string;
  semester: string;
  downloads: number;
  pages: number;
  date: string;
  type: string;
  status?: 'published' | 'under-review' | 'draft';
  facultyId?: string;
  departmentId?: string;
  fileUrl?: string;
  uploadedBy?: string;
  contributorRole?: 'student' | 'staff' | 'admin';
  contributorEmail?: string;
  createdAt?: any;
  updatedAt?: any;
}

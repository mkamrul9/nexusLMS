export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;
  courseId: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  answerContent: string;
  submittedAt: string;
  marksAwarded?: number;
  feedback?: string;
  status: string;
}

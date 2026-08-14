/**
 * Shared TypeScript type definitions for the NexusLMS frontend.
 * These interfaces mirror the JSON shapes returned by the ASP.NET Core API.
 * Keep this file in sync with backend DTOs and entity response shapes.
 */

/** Represents a platform user (Admin, Teacher, or Student). */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Student';
}

/** Represents a course on the platform. */
export interface Course {
  id: string;
  name: string;
  subjectCode: string;
  description: string;
}

/** Represents a teacher's assignment within a course. */
export interface Assignment {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 UTC date-time string. */
  deadline: string;
  maximumMarks: number;
  isPublished: boolean;
  courseId: string;
}

/** Represents a student's submission for an assignment. */
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  answerContent: string;
  /** ISO 8601 UTC date-time string of when the submission was created or last updated. */
  submittedAt: string;
  /** Marks awarded by the teacher. Undefined/null if not yet graded. */
  marksAwarded?: number;
  /** Written feedback from the teacher. Undefined/empty if not yet graded. */
  feedback?: string;
  /** Lifecycle status. Use SubmissionStatus constants for safe comparisons. */
  status: string;
}

/**
 * Centralises submission status string constants to prevent typos and magic strings.
 * Mirrors the backend's SubmissionStatus static class.
 */
export const SubmissionStatus = {
  Submitted: 'Submitted',
  Graded: 'Graded',
  Returned: 'Returned',
} as const;

export type SubmissionStatusType = typeof SubmissionStatus[keyof typeof SubmissionStatus];

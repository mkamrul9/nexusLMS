using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    /// <summary>
    /// Represents a student's answer submission for a specific assignment.
    /// Tracks the submission lifecycle from "Submitted" through to "Graded".
    /// </summary>
    public class Submission
    {
        /// <summary>Gets or sets the unique identifier for this submission.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the ID of the assignment this submission is answering.</summary>
        public Guid AssignmentId { get; set; }

        /// <summary>Gets or sets the ID of the student who submitted this answer.</summary>
        public Guid StudentId { get; set; }

        /// <summary>Gets or sets the student's written answer content.</summary>
        public string AnswerContent { get; set; }

        /// <summary>Gets or sets the UTC timestamp of when this submission was created or last updated.</summary>
        public DateTime SubmittedAt { get; set; }

        /// <summary>
        /// Gets or sets the marks awarded by the teacher after grading.
        /// <c>null</c> means the submission has not been graded yet.
        /// </summary>
        public int? MarksAwarded { get; set; }

        /// <summary>Gets or sets the teacher's written feedback for the student. Empty string if ungraded.</summary>
        public string Feedback { get; set; }

        /// <summary>
        /// Gets or sets the current lifecycle status of this submission.
        /// Use the <see cref="SubmissionStatus"/> constants for safe comparisons.
        /// Defaults to <see cref="SubmissionStatus.Submitted"/>.
        /// </summary>
        public string Status { get; set; } = SubmissionStatus.Submitted;
    }

    /// <summary>
    /// Centralises the allowed status values for a <see cref="Submission"/> to prevent typos and magic strings.
    /// </summary>
    public static class SubmissionStatus
    {
        /// <summary>The student has submitted their answer but it has not been graded yet.</summary>
        public const string Submitted = "Submitted";

        /// <summary>The teacher has reviewed the submission and awarded marks.</summary>
        public const string Graded = "Graded";

        /// <summary>The submission has been returned to the student for revision.</summary>
        public const string Returned = "Returned";
    }
}

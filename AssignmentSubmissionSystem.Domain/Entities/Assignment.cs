using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    /// <summary>
    /// Represents a graded assignment that a teacher creates within a course.
    /// Assignments start as drafts and must be explicitly published before students can see them.
    /// </summary>
    public class Assignment
    {
        /// <summary>Gets the unique identifier for this assignment.</summary>
        public Guid Id { get; private set; }

        /// <summary>Gets the title of the assignment (e.g., "Midterm Project").</summary>
        public string Title { get; private set; }

        /// <summary>Gets the detailed description or instructions for the assignment.</summary>
        public string Description { get; private set; }

        /// <summary>Gets the UTC deadline after which submissions are no longer accepted.</summary>
        public DateTime Deadline { get; private set; }

        /// <summary>Gets the maximum marks that can be awarded for this assignment.</summary>
        public int MaximumMarks { get; private set; }

        /// <summary>
        /// Gets a value indicating whether this assignment is visible to students.
        /// <c>false</c> means it is a draft; <c>true</c> means it has been published.
        /// </summary>
        public bool IsPublished { get; private set; }

        /// <summary>Gets the ID of the course this assignment belongs to.</summary>
        public Guid CourseId { get; private set; }

        /// <summary>
        /// Parameterless constructor required by Entity Framework Core for materialization.
        /// Do not use directly in application code.
        /// </summary>
        private Assignment() { }

        /// <summary>
        /// Creates a new assignment in an unpublished (draft) state.
        /// </summary>
        /// <param name="title">The title of the assignment.</param>
        /// <param name="description">Detailed instructions for students.</param>
        /// <param name="deadline">The UTC date and time by which students must submit.</param>
        /// <param name="maximumMarks">The highest mark achievable (must be between 1 and 1000).</param>
        /// <param name="courseId">The ID of the course this assignment is linked to.</param>
        public Assignment(string title, string description, DateTime deadline, int maximumMarks, Guid courseId)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            Deadline = deadline;
            MaximumMarks = maximumMarks;
            CourseId = courseId;
            IsPublished = false; // Assignments are drafts by default until explicitly published
        }

        /// <summary>
        /// Marks this assignment as published, making it visible to all enrolled students.
        /// This action is currently irreversible.
        /// </summary>
        public void Publish()
        {
            IsPublished = true;
        }
    }
}

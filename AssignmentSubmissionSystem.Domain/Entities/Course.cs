using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    /// <summary>
    /// Represents a course offered on the platform (e.g., "Introduction to Computer Science").
    /// A course is the top-level organisational unit that contains assignments and is taught by one or more teachers.
    /// </summary>
    public class Course
    {
        /// <summary>Gets or sets the unique identifier for this course.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the full name of the course (e.g., "Introduction to Computer Science").</summary>
        public string Name { get; set; }

        /// <summary>Gets or sets the short subject code for the course (e.g., "CS101").</summary>
        public string SubjectCode { get; set; }

        /// <summary>Gets or sets a brief description of what the course covers.</summary>
        public string Description { get; set; }

        /// <summary>
        /// Creates a new course with all required fields.
        /// </summary>
        /// <param name="name">The full name of the course.</param>
        /// <param name="subjectCode">The short identifier code (e.g., "CS101").</param>
        /// <param name="description">A brief description of the course contents.</param>
        public Course(string name, string subjectCode, string description)
        {
            Id = Guid.NewGuid();
            Name = name;
            SubjectCode = subjectCode;
            Description = description;
        }

        /// <summary>
        /// Parameterless constructor required by Entity Framework Core for materialization.
        /// Do not use directly in application code.
        /// </summary>
        public Course() { }
    }
}

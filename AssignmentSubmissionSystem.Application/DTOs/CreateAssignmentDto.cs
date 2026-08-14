using System;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating a new assignment.
    /// Sent by the frontend as a JSON request body to <c>POST /api/assignment</c>.
    /// </summary>
    public class CreateAssignmentDto
    {
        /// <summary>The title of the assignment (e.g., "Midterm Project"). Required.</summary>
        [Required]
        public string Title { get; set; }

        /// <summary>The detailed instructions for the assignment. Required.</summary>
        [Required]
        public string Description { get; set; }

        /// <summary>The UTC deadline for student submissions. Required.</summary>
        [Required]
        public DateTime Deadline { get; set; }

        /// <summary>The maximum marks a student can receive. Must be between 1 and 1000. Required.</summary>
        [Required]
        [Range(1, 1000)]
        public int MaximumMarks { get; set; }

        /// <summary>The ID of the course this assignment belongs to. Required.</summary>
        [Required]
        public Guid CourseId { get; set; }
    }
}

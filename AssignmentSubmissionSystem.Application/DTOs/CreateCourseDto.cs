using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating a new course.
    /// Sent by the admin frontend as a JSON request body to <c>POST /api/course</c>.
    /// </summary>
    public class CreateCourseDto
    {
        /// <summary>The full name of the course (e.g., "Introduction to Computer Science"). Required. Max 100 characters.</summary>
        [Required(ErrorMessage = "Course name is required.")]
        [StringLength(100, ErrorMessage = "Course name cannot exceed 100 characters.")]
        public string Name { get; set; }

        /// <summary>The short subject code or identifier for the course (e.g., "CS101"). Required.</summary>
        [Required(ErrorMessage = "Subject code/identifier is required.")]
        public string SubjectCode { get; set; }

        /// <summary>A brief description of what the course covers. Optional.</summary>
        public string Description { get; set; }
    }
}

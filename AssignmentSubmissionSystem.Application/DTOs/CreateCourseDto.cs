using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    public class CreateCourseDto
    {
        [Required(ErrorMessage = "Course name is required.")]
        [StringLength(100, ErrorMessage = "Course name cannot exceed 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Subject code/identifier is required.")]
        public string SubjectCode { get; set; }
        
        public string Description { get; set; }
    }
}

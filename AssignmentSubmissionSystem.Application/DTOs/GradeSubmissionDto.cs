using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    public class GradeSubmissionDto
    {
        [Required]
        [Range(0, 1000)]
        public int Marks { get; set; }
        
        public string Feedback { get; set; }
        
        [Required]
        public string Status { get; set; } // e.g., "Graded"
    }
}

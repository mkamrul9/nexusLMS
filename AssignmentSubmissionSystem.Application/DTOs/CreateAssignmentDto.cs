using System;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    public class CreateAssignmentDto
    {
        [Required]
        public string Title { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public DateTime Deadline { get; set; }
        
        [Required]
        [Range(1, 1000)]
        public int MaximumMarks { get; set; }
        
        [Required]
        public Guid CourseId { get; set; } // Links the assignment to the specific class
    }
}

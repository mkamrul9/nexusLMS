using System;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    public class SubmitAnswerDto
    {
        [Required]
        public Guid AssignmentId { get; set; }
        
        [Required]
        public string AnswerContent { get; set; } // Could be a text answer or a link to a file
    }
}

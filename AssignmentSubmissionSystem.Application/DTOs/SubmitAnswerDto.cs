using System;
using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for a student submitting an answer to an assignment.
    /// Sent by the student frontend as a JSON request body to <c>POST /api/submission</c>.
    /// The student's identity is resolved from the JWT token, not from this DTO.
    /// </summary>
    public class SubmitAnswerDto
    {
        /// <summary>The ID of the assignment the student is answering. Required.</summary>
        [Required]
        public Guid AssignmentId { get; set; }

        /// <summary>
        /// The student's text-based answer content.
        /// This could be a written answer, code snippet, or a URL to an external resource.
        /// Required.
        /// </summary>
        [Required]
        public string AnswerContent { get; set; }
    }
}

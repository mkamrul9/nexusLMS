using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for a teacher grading a student's submission.
    /// Sent by the teacher frontend as a JSON request body to <c>PUT /api/submission/{id}/grade</c>.
    /// </summary>
    public class GradeSubmissionDto
    {
        /// <summary>The marks awarded to the student. Must be between 0 and 1000. Required.</summary>
        [Required]
        [Range(0, 1000)]
        public int Marks { get; set; }

        /// <summary>
        /// Written feedback from the teacher for the student.
        /// Optional, but strongly encouraged for educational value.
        /// </summary>
        public string Feedback { get; set; }

        /// <summary>
        /// The new lifecycle status of the submission.
        /// Typically set to "Graded" by the teacher when saving marks.
        /// See <c>SubmissionStatus</c> constants for valid values.
        /// </summary>
        [Required]
        public string Status { get; set; }
    }
}

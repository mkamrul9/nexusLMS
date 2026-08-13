using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class Submission
    {
        public Guid Id { get; set; }
        public Guid AssignmentId { get; set; }
        public Guid StudentId { get; set; }
        public string AnswerContent { get; set; }
        public DateTime SubmittedAt { get; set; }
        
        // Grading fields
        public int? MarksAwarded { get; set; }
        public string Feedback { get; set; }
        public string Status { get; set; } = "Submitted"; // e.g., Submitted, Graded, Returned
    }
}

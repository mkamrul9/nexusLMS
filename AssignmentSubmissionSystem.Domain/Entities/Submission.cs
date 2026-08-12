using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class Submission
    {
        public Guid Id { get; set; }
        public Guid AssignmentId { get; set; }
        public Guid StudentId { get; set; }
        public string Content { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}

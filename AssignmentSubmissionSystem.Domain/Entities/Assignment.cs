using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class Assignment
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public DateTime Deadline { get; private set; }
        public int MaximumMarks { get; private set; }
        public bool IsPublished { get; private set; }
        public Guid CourseId { get; private set; }

        private Assignment() { } // Required for Entity Framework Core

        public Assignment(string title, string description, DateTime deadline, int maximumMarks, Guid courseId)
        {
            Id = Guid.NewGuid();
            Title = title;
            Description = description;
            Deadline = deadline;
            MaximumMarks = maximumMarks;
            CourseId = courseId;
            IsPublished = false; // By default, assignments can be kept as drafts
        }

        public void Publish()
        {
            IsPublished = true; // Changes state to published
        }
    }
}

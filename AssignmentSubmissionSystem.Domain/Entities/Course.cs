using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class Course
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string SubjectCode { get; set; }
        public string Description { get; set; }

        public Course(string name, string subjectCode, string description)
        {
            Id = Guid.NewGuid();
            Name = name;
            SubjectCode = subjectCode;
            Description = description;
        }

        public Course() { }
    }
}

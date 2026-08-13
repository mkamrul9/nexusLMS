using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class CourseTeacher
    {
        public Guid CourseId { get; set; }
        public Course Course { get; set; }

        public Guid TeacherId { get; set; }
        public User Teacher { get; set; }
    }
}

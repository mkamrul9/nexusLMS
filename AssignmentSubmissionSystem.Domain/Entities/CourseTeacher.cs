using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    /// <summary>
    /// Join entity representing the many-to-many relationship between <see cref="Course"/> and <see cref="User"/> (Teacher).
    /// A course can have multiple teachers, and a teacher can be assigned to multiple courses.
    /// The composite primary key is (<see cref="CourseId"/>, <see cref="TeacherId"/>), configured in <c>ApplicationDbContext</c>.
    /// </summary>
    public class CourseTeacher
    {
        /// <summary>Gets or sets the ID of the course in this assignment relationship.</summary>
        public Guid CourseId { get; set; }

        /// <summary>Navigation property to the related <see cref="Course"/>.</summary>
        public Course Course { get; set; }

        /// <summary>Gets or sets the ID of the teacher (User with Role = "Teacher") assigned to the course.</summary>
        public Guid TeacherId { get; set; }

        /// <summary>Navigation property to the related teacher <see cref="User"/>.</summary>
        public User Teacher { get; set; }
    }
}

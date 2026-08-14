using AssignmentSubmissionSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSubmissionSystem.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets represent our database tables
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CourseTeacher> CourseTeachers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Composite Key for CourseTeacher
            modelBuilder.Entity<CourseTeacher>()
                .HasKey(ct => new { ct.CourseId, ct.TeacherId });

            modelBuilder.Entity<CourseTeacher>()
                .HasOne(ct => ct.Course)
                .WithMany()
                .HasForeignKey(ct => ct.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CourseTeacher>()
                .HasOne(ct => ct.Teacher)
                .WithMany()
                .HasForeignKey(ct => ct.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Course -> Assignment Relationship (One-to-Many)
            modelBuilder.Entity<Assignment>()
                .HasOne<Course>()
                .WithMany()
                .HasForeignKey(a => a.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Assignment -> Submission Relationship (One-to-Many)
            modelBuilder.Entity<Submission>()
                .HasOne<Assignment>()
                .WithMany()
                .HasForeignKey(s => s.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Student (User) -> Submission Relationship
            modelBuilder.Entity<Submission>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent deleting a user if they have submissions
                
            // Seed Demo Users
            var adminId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            var teacherId1 = Guid.Parse("00000000-0000-0000-0000-000000000002");
            var teacherId2 = Guid.Parse("00000000-0000-0000-0000-000000000012");
            var studentId1 = Guid.Parse("00000000-0000-0000-0000-000000000003");
            var studentId2 = Guid.Parse("00000000-0000-0000-0000-000000000004");
            var studentId3 = Guid.Parse("00000000-0000-0000-0000-000000000005");

            modelBuilder.Entity<User>().HasData(
                new User { Id = adminId, Name = "System Admin", Email = "admin@demo.com", Password = "Password123!", Role = "Admin" },
                new User { Id = teacherId1, Name = "Demo Teacher", Email = "teacher@demo.com", Password = "Password123!", Role = "Teacher" },
                new User { Id = teacherId2, Name = "Alice Smith", Email = "alice@demo.com", Password = "Password123!", Role = "Teacher" },
                new User { Id = studentId1, Name = "Demo Student", Email = "student@demo.com", Password = "Password123!", Role = "Student" },
                new User { Id = studentId2, Name = "Bob Johnson", Email = "bob@demo.com", Password = "Password123!", Role = "Student" },
                new User { Id = studentId3, Name = "Charlie Davis", Email = "charlie@demo.com", Password = "Password123!", Role = "Student" }
            );

            // Seed Dummy Courses
            var courseId1 = Guid.Parse("00000000-0000-0000-0000-000000000100");
            var courseId2 = Guid.Parse("00000000-0000-0000-0000-000000000101");
            modelBuilder.Entity<Course>().HasData(
                new Course { Id = courseId1, Name = "Introduction to Computer Science", SubjectCode = "CS101", Description = "Learn the basics of programming." },
                new Course { Id = courseId2, Name = "Advanced Web Development", SubjectCode = "CS201", Description = "Build modern web applications." }
            );

            // Assign Teachers to Courses
            modelBuilder.Entity<CourseTeacher>().HasData(
                new CourseTeacher { CourseId = courseId1, TeacherId = teacherId1 },
                new CourseTeacher { CourseId = courseId2, TeacherId = teacherId2 },
                new CourseTeacher { CourseId = courseId2, TeacherId = teacherId1 }
            );

            // Seed Dummy Assignments
            var assignmentId1 = Guid.Parse("00000000-0000-0000-0000-000000000200");
            var assignmentId2 = Guid.Parse("00000000-0000-0000-0000-000000000201");
            var assignmentId3 = Guid.Parse("00000000-0000-0000-0000-000000000202");
            modelBuilder.Entity<Assignment>().HasData(
                new { Id = assignmentId1, Title = "Build a REST API", Description = "Create a basic API using C# and ASP.NET Core.", Deadline = DateTime.UtcNow.AddDays(7), MaximumMarks = 100, IsPublished = true, CourseId = courseId1 },
                new { Id = assignmentId2, Title = "Create a React Frontend", Description = "Build a beautiful UI using React and Tailwind.", Deadline = DateTime.UtcNow.AddDays(-2), MaximumMarks = 100, IsPublished = true, CourseId = courseId1 },
                new { Id = assignmentId3, Title = "Database Design (Draft)", Description = "Design a schema for a library management system.", Deadline = DateTime.UtcNow.AddDays(20), MaximumMarks = 50, IsPublished = false, CourseId = courseId2 }
            );

            // Seed Dummy Submissions
            var submissionId1 = Guid.Parse("00000000-0000-0000-0000-000000000300");
            var submissionId2 = Guid.Parse("00000000-0000-0000-0000-000000000301");
            var submissionId3 = Guid.Parse("00000000-0000-0000-0000-000000000302");
            var submissionId4 = Guid.Parse("00000000-0000-0000-0000-000000000303");
            modelBuilder.Entity<Submission>().HasData(
                new Submission { Id = submissionId1, AssignmentId = assignmentId1, StudentId = studentId1, AnswerContent = "Here is my code for the REST API.", SubmittedAt = DateTime.UtcNow.AddHours(-2), Status = "Submitted", Feedback = "" },
                new Submission { Id = submissionId2, AssignmentId = assignmentId1, StudentId = studentId2, AnswerContent = "I built the API using minimal APIs in .NET 8.", SubmittedAt = DateTime.UtcNow.AddDays(-1), Status = "Graded", MarksAwarded = 95, Feedback = "Excellent work!" },
                new Submission { Id = submissionId3, AssignmentId = assignmentId2, StudentId = studentId1, AnswerContent = "My react components are attached.", SubmittedAt = DateTime.UtcNow.AddMinutes(-30), Status = "Submitted", Feedback = "" },
                new Submission { Id = submissionId4, AssignmentId = assignmentId1, StudentId = studentId3, AnswerContent = "Sorry it's late.", SubmittedAt = DateTime.UtcNow.AddHours(-1), Status = "Submitted", Feedback = "" }
            );
        }
    }
}

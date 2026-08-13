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
            var teacherId = Guid.Parse("00000000-0000-0000-0000-000000000002");
            var studentId = Guid.Parse("00000000-0000-0000-0000-000000000003");

            modelBuilder.Entity<User>().HasData(
                new User { Id = adminId, Name = "System Admin", Email = "admin@demo.com", Password = "Password123!", Role = "Admin" },
                new User { Id = teacherId, Name = "Demo Teacher", Email = "teacher@demo.com", Password = "Password123!", Role = "Teacher" },
                new User { Id = studentId, Name = "Demo Student", Email = "student@demo.com", Password = "Password123!", Role = "Student" }
            );

            // Seed Dummy Course
            var courseId = Guid.Parse("00000000-0000-0000-0000-000000000100");
            modelBuilder.Entity<Course>().HasData(
                new Course { Id = courseId, Name = "Introduction to Computer Science", SubjectCode = "CS101", Description = "Learn the basics of programming." }
            );

            // Assign Teacher to Course
            modelBuilder.Entity<CourseTeacher>().HasData(
                new CourseTeacher { CourseId = courseId, TeacherId = teacherId }
            );

            // Seed Dummy Assignment
            var assignmentId = Guid.Parse("00000000-0000-0000-0000-000000000200");
            modelBuilder.Entity<Assignment>().HasData(
                new { 
                    Id = assignmentId, 
                    Title = "Build a REST API", 
                    Description = "Create a basic API using C# and ASP.NET Core.", 
                    Deadline = DateTime.UtcNow.AddDays(7), 
                    MaximumMarks = 100, 
                    IsPublished = true, 
                    CourseId = courseId 
                }
            );

            // Seed Dummy Submission
            var submissionId = Guid.Parse("00000000-0000-0000-0000-000000000300");
            modelBuilder.Entity<Submission>().HasData(
                new Submission {
                    Id = submissionId,
                    AssignmentId = assignmentId,
                    StudentId = studentId,
                    AnswerContent = "Here is my code for the REST API.",
                    SubmittedAt = DateTime.UtcNow.AddHours(-2),
                    Status = "Submitted",
                    Feedback = ""
                }
            );
        }
    }
}

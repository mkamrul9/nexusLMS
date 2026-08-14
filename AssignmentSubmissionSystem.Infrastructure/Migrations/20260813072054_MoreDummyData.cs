using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AssignmentSubmissionSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoreDummyData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Assignments",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000200"),
                column: "Deadline",
                value: new DateTime(2026, 8, 20, 7, 20, 53, 605, DateTimeKind.Utc).AddTicks(3484));

            migrationBuilder.InsertData(
                table: "Assignments",
                columns: new[] { "Id", "CourseId", "Deadline", "Description", "IsPublished", "MaximumMarks", "Title" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000201"), new Guid("00000000-0000-0000-0000-000000000100"), new DateTime(2026, 8, 11, 7, 20, 53, 605, DateTimeKind.Utc).AddTicks(3492), "Build a beautiful UI using React and Tailwind.", true, 100, "Create a React Frontend" });

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "Description", "Name", "SubjectCode" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000101"), "Build modern web applications.", "Advanced Web Development", "CS201" });

            migrationBuilder.UpdateData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000300"),
                column: "SubmittedAt",
                value: new DateTime(2026, 8, 13, 5, 20, 53, 605, DateTimeKind.Utc).AddTicks(3536));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "Role" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000004"), "bob@demo.com", "Bob Johnson", "Password123!", "Student" },
                    { new Guid("00000000-0000-0000-0000-000000000005"), "charlie@demo.com", "Charlie Davis", "Password123!", "Student" },
                    { new Guid("00000000-0000-0000-0000-000000000012"), "alice@demo.com", "Alice Smith", "Password123!", "Teacher" }
                });

            migrationBuilder.InsertData(
                table: "Assignments",
                columns: new[] { "Id", "CourseId", "Deadline", "Description", "IsPublished", "MaximumMarks", "Title" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000202"), new Guid("00000000-0000-0000-0000-000000000101"), new DateTime(2026, 9, 2, 7, 20, 53, 605, DateTimeKind.Utc).AddTicks(3493), "Design a schema for a library management system.", false, 50, "Database Design (Draft)" });

            migrationBuilder.InsertData(
                table: "CourseTeachers",
                columns: new[] { "CourseId", "TeacherId" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000101"), new Guid("00000000-0000-0000-0000-000000000002") },
                    { new Guid("00000000-0000-0000-0000-000000000101"), new Guid("00000000-0000-0000-0000-000000000012") }
                });

            migrationBuilder.InsertData(
                table: "Submissions",
                columns: new[] { "Id", "AnswerContent", "AssignmentId", "Feedback", "MarksAwarded", "Status", "StudentId", "SubmittedAt" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000301"), "I built the API using minimal APIs in .NET 8.", new Guid("00000000-0000-0000-0000-000000000200"), "Excellent work!", 95, "Graded", new Guid("00000000-0000-0000-0000-000000000004"), new DateTime(2026, 8, 12, 7, 20, 53, 605, DateTimeKind.Utc).AddTicks(3538) },
                    { new Guid("00000000-0000-0000-0000-000000000302"), "My react components are attached.", new Guid("00000000-0000-0000-0000-000000000201"), "", null, "Submitted", new Guid("00000000-0000-0000-0000-000000000003"), new DateTime(2026, 8, 13, 6, 50, 53, 605, DateTimeKind.Utc).AddTicks(3541) },
                    { new Guid("00000000-0000-0000-0000-000000000303"), "Sorry it's late.", new Guid("00000000-0000-0000-0000-000000000200"), "", null, "Submitted", new Guid("00000000-0000-0000-0000-000000000005"), new DateTime(2026, 8, 13, 6, 20, 53, 605, DateTimeKind.Utc).AddTicks(3543) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Assignments",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000202"));

            migrationBuilder.DeleteData(
                table: "CourseTeachers",
                keyColumns: new[] { "CourseId", "TeacherId" },
                keyValues: new object[] { new Guid("00000000-0000-0000-0000-000000000101"), new Guid("00000000-0000-0000-0000-000000000002") });

            migrationBuilder.DeleteData(
                table: "CourseTeachers",
                keyColumns: new[] { "CourseId", "TeacherId" },
                keyValues: new object[] { new Guid("00000000-0000-0000-0000-000000000101"), new Guid("00000000-0000-0000-0000-000000000012") });

            migrationBuilder.DeleteData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000301"));

            migrationBuilder.DeleteData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000302"));

            migrationBuilder.DeleteData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000303"));

            migrationBuilder.DeleteData(
                table: "Assignments",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000201"));

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000101"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000012"));

            migrationBuilder.UpdateData(
                table: "Assignments",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000200"),
                column: "Deadline",
                value: new DateTime(2026, 8, 20, 6, 48, 57, 223, DateTimeKind.Utc).AddTicks(8430));

            migrationBuilder.UpdateData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000300"),
                column: "SubmittedAt",
                value: new DateTime(2026, 8, 13, 4, 48, 57, 223, DateTimeKind.Utc).AddTicks(8493));
        }
    }
}

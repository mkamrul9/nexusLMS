using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AssignmentSubmissionSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ExtendedSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Submissions",
                newName: "Status");

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AnswerContent",
                table: "Submissions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Feedback",
                table: "Submissions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MarksAwarded",
                table: "Submissions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SubjectCode",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CourseTeachers",
                columns: table => new
                {
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    TeacherId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseTeachers", x => new { x.CourseId, x.TeacherId });
                    table.ForeignKey(
                        name: "FK_CourseTeachers_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseTeachers_Users_TeacherId",
                        column: x => x.TeacherId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "Description", "Name", "SubjectCode" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000100"), "Learn the basics of programming.", "Introduction to Computer Science", "CS101" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "Role" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "admin@demo.com", "System Admin", "Password123!", "Admin" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "teacher@demo.com", "Demo Teacher", "Password123!", "Teacher" },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "student@demo.com", "Demo Student", "Password123!", "Student" }
                });

            migrationBuilder.InsertData(
                table: "Assignments",
                columns: new[] { "Id", "CourseId", "Deadline", "Description", "IsPublished", "MaximumMarks", "Title" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000200"), new Guid("00000000-0000-0000-0000-000000000100"), new DateTime(2026, 8, 20, 6, 48, 57, 223, DateTimeKind.Utc).AddTicks(8430), "Create a basic API using C# and ASP.NET Core.", true, 100, "Build a REST API" });

            migrationBuilder.InsertData(
                table: "CourseTeachers",
                columns: new[] { "CourseId", "TeacherId" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000100"), new Guid("00000000-0000-0000-0000-000000000002") });

            migrationBuilder.InsertData(
                table: "Submissions",
                columns: new[] { "Id", "AnswerContent", "AssignmentId", "Feedback", "MarksAwarded", "Status", "StudentId", "SubmittedAt" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000300"), "Here is my code for the REST API.", new Guid("00000000-0000-0000-0000-000000000200"), "", null, "Submitted", new Guid("00000000-0000-0000-0000-000000000003"), new DateTime(2026, 8, 13, 4, 48, 57, 223, DateTimeKind.Utc).AddTicks(8493) });

            migrationBuilder.CreateIndex(
                name: "IX_CourseTeachers_TeacherId",
                table: "CourseTeachers",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseTeachers");

            migrationBuilder.DeleteData(
                table: "Submissions",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000300"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "Assignments",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000200"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000100"));

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AnswerContent",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "Feedback",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "MarksAwarded",
                table: "Submissions");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Courses");

            migrationBuilder.DropColumn(
                name: "SubjectCode",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Submissions",
                newName: "Content");
        }
    }
}

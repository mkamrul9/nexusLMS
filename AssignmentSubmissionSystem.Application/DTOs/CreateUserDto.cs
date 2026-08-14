using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for creating a new platform user (Admin, Teacher, or Student).
    /// Sent by the admin frontend as a JSON request body to <c>POST /api/user</c>.
    /// </summary>
    public class CreateUserDto
    {
        /// <summary>The user's full display name (e.g., "Jane Doe"). Required.</summary>
        [Required]
        public string Name { get; set; }

        /// <summary>The user's unique login email address. Required. Must be a valid email format.</summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// The user's plain-text password.
        /// ⚠️ In a production system, this should be hashed (e.g., BCrypt) before storing in the database.
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// The user's role within the platform. Must be exactly one of: "Admin", "Teacher", or "Student".
        /// This controls which dashboard and features the user can access.
        /// </summary>
        [Required]
        [RegularExpression("^(Admin|Teacher|Student)$", ErrorMessage = "Role must be Admin, Teacher, or Student")]
        public string Role { get; set; }
    }
}

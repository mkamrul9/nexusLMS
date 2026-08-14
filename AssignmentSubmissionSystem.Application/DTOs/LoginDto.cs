using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    /// <summary>
    /// Data Transfer Object for the login request.
    /// Sent by the frontend to <c>POST /api/auth/login</c> to authenticate a user and receive a JWT token.
    /// </summary>
    public class LoginDto
    {
        /// <summary>The user's registered email address. Required. Must be a valid email format.</summary>
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>The user's password in plain text. Required.</summary>
        [Required]
        public string Password { get; set; }
    }
}

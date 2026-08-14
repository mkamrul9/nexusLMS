using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    /// <summary>
    /// Represents a system user, which can be a Student, Teacher, or Administrator.
    /// The <see cref="Role"/> property determines which features and pages the user can access.
    /// </summary>
    /// <remarks>
    /// ⚠️ SECURITY WARNING: Passwords are currently stored in plain text for demo purposes.
    /// In a production system, passwords MUST be hashed using a strong algorithm (e.g., BCrypt or Argon2)
    /// before being stored in the database. Never store raw passwords in production.
    /// </remarks>
    public class User
    {
        /// <summary>Gets or sets the unique identifier for this user.</summary>
        public Guid Id { get; set; }

        /// <summary>Gets or sets the user's full display name (e.g., "Jane Doe").</summary>
        public string Name { get; set; }

        /// <summary>Gets or sets the user's login email address. Must be unique in the system.</summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the user's password.
        /// ⚠️ This is stored as plain text for demo purposes only. Hash before production use.
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the user's role within the platform.
        /// Valid values are: <c>"Admin"</c>, <c>"Teacher"</c>, <c>"Student"</c>.
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Creates a new user with all required fields.
        /// </summary>
        /// <param name="name">The user's full display name.</param>
        /// <param name="email">The user's unique login email.</param>
        /// <param name="password">The user's password (plain text — hash in production).</param>
        /// <param name="role">The user's role: "Admin", "Teacher", or "Student".</param>
        public User(string name, string email, string password, string role)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            Password = password;
            Role = role;
        }

        /// <summary>
        /// Parameterless constructor required by Entity Framework Core for materialization.
        /// Do not use directly in application code.
        /// </summary>
        public User() { }
    }
}

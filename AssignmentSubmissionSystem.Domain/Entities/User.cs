using System;

namespace AssignmentSubmissionSystem.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // Note: Hash in production!
        public string Role { get; set; }

        public User(string name, string email, string password, string role)
        {
            Id = Guid.NewGuid();
            Name = name;
            Email = email;
            Password = password;
            Role = role;
        }

        public User() { }
    }
}

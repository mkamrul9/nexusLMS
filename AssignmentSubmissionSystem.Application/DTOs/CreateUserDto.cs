using System.ComponentModel.DataAnnotations;

namespace AssignmentSubmissionSystem.Application.DTOs
{
    public class CreateUserDto
    {
        [Required]
        public string Name { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; } // Note: In a production app, we would hash this before saving!
        
        [Required]
        // Validation ensures only valid roles are assigned
        [RegularExpression("^(Admin|Teacher|Student)$", ErrorMessage = "Role must be Admin, Teacher, or Student")]
        public string Role { get; set; }
    }
}

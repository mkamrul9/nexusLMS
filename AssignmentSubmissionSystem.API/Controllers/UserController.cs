using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssignmentSubmissionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            // Logic to fetch all users
            return Ok(new { message = "You have Admin access." });
        }
        
        [HttpPost("assignments")]
        [Authorize(Roles = "Teacher")]
        public IActionResult CreateAssignment()
        {
            // Logic to create an assignment
            return Ok(new { message = "Assignment created successfully." });
        }
    }
}

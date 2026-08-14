using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using System.Threading.Tasks;
using System.Linq;

namespace AssignmentSubmissionSystem.API.Controllers
{
    /// <summary>
    /// Manages user accounts on the platform.
    /// Provides endpoints for listing all users and creating new users (Admin function).
    /// Passwords are intentionally not returned in any response.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints require a valid JWT token
    public class UserController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;

        /// <summary>
        /// Initialises a new instance of <see cref="UserController"/>.
        /// </summary>
        /// <param name="userRepository">Repository for user CRUD operations.</param>
        public UserController(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        /// Returns a safe (password-stripped) list of all users in the system.
        /// Intended for the Admin dashboard to display user management information.
        /// </summary>
        /// <returns>200 OK with an array of anonymous objects containing Id, Name, Email, and Role.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();

            // Project to an anonymous DTO to ensure the Password field is never exposed via the API
            var safeUsers = users.Select(u => new { u.Id, u.Name, u.Email, u.Role });

            return Ok(safeUsers);
        }

        /// <summary>
        /// Creates a new user account (Student, Teacher, or Admin).
        /// This endpoint is intended for admin use only (enforced on the frontend).
        /// </summary>
        /// <param name="dto">The new user's details including role assignment.</param>
        /// <returns>
        /// 201 Created with the new user's safe data on success.
        /// 400 Bad Request if the DTO fails validation (e.g., invalid role, duplicate email).
        /// </returns>
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User(dto.Name, dto.Email, dto.Password, dto.Role);
            await _userRepository.AddAsync(user);

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, new { user.Id, user.Name, user.Email, user.Role });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using AssignmentSubmissionSystem.Infrastructure.Services;
using System.Threading.Tasks;
using System.Linq;

namespace AssignmentSubmissionSystem.API.Controllers
{
    /// <summary>
    /// Handles authentication for the NexusLMS platform.
    /// Currently provides a login endpoint that validates credentials and returns a signed JWT token.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;
        private readonly TokenService _tokenService;

        /// <summary>
        /// Initialises a new instance of <see cref="AuthController"/>.
        /// </summary>
        /// <param name="userRepository">Repository for querying user records.</param>
        /// <param name="tokenService">Service responsible for generating signed JWT tokens.</param>
        public AuthController(IRepository<User> userRepository, TokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Authenticates a user by email and password, and returns a signed JWT access token on success.
        /// The token encodes the user's ID, email, and role, and is valid for 2 hours.
        /// </summary>
        /// <remarks>
        /// ⚠️ Passwords are compared in plain text for this demo. In production, use a secure hashing
        /// algorithm (e.g., BCrypt) and compare the hash — never the raw password.
        /// </remarks>
        /// <param name="dto">The login credentials (email + password).</param>
        /// <returns>
        /// 200 OK with a <c>{ token: string }</c> payload on success.
        /// 400 Bad Request if the DTO fails validation.
        /// 401 Unauthorized if credentials are invalid.
        /// </returns>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Load all users and find a matching email + password combination
            // TODO (scalability): Replace with a targeted DB query (e.g., FirstOrDefaultAsync with a predicate)
            var users = await _userRepository.GetAllAsync();
            var user = users.FirstOrDefault(u => u.Email == dto.Email && u.Password == dto.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = _tokenService.GenerateToken(user);
            return Ok(new { token = token });
        }
    }
}

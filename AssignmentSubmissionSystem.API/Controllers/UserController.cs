using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using System.Threading.Tasks;
using System.Linq;

namespace AssignmentSubmissionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Strictly limits access to the Admin role
    public class UserController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;

        public UserController(IRepository<User> userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();
            // Map entities to DTOs here to avoid exposing passwords/internal fields
            var safeUsers = users.Select(u => new { u.Id, u.Name, u.Email, u.Role });
            
            return Ok(safeUsers);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Map DTO to Entity
            var user = new User(dto.Name, dto.Email, dto.Password, dto.Role);
            
            await _userRepository.AddAsync(user);

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, new { user.Id, user.Name, user.Email, user.Role });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using System.Threading.Tasks;
using System;

namespace AssignmentSubmissionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Restricted to authenticated users by default
    public class AssignmentController : ControllerBase
    {
        private readonly IRepository<Assignment> _assignmentRepository;

        public AssignmentController(IRepository<Assignment> assignmentRepository)
        {
            _assignmentRepository = assignmentRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            var assignments = await _assignmentRepository.GetAllAsync();
            return Ok(assignments);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var assignment = new Assignment(dto.Title, dto.Description, dto.Deadline, dto.MaximumMarks, dto.CourseId);
            
            await _assignmentRepository.AddAsync(assignment);

            return CreatedAtAction(nameof(GetAssignment), new { id = assignment.Id }, assignment);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignment(Guid id)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(id);
            if (assignment == null) return NotFound();
            return Ok(assignment);
        }

        [HttpPost("{id}/publish")]
        [Authorize]
        public async Task<IActionResult> PublishAssignment(Guid id)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(id);
            if (assignment == null) return NotFound();

            assignment.Publish();
            await _assignmentRepository.UpdateAsync(assignment);

            return Ok(new { message = "Assignment published successfully." });
        }
    }
}

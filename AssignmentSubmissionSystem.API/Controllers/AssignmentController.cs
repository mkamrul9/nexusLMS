using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using System.Threading.Tasks;
using System;

namespace AssignmentSubmissionSystem.API.Controllers
{
    /// <summary>
    /// Manages assignment lifecycle: creation, retrieval, and publishing.
    /// All endpoints require a valid JWT (authenticated user). Role-specific restrictions
    /// (e.g., only teachers should create assignments) are enforced on the frontend for now.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints in this controller require a valid JWT token
    public class AssignmentController : ControllerBase
    {
        private readonly IRepository<Assignment> _assignmentRepository;

        /// <summary>
        /// Initialises a new instance of <see cref="AssignmentController"/>.
        /// </summary>
        /// <param name="assignmentRepository">Repository for assignment CRUD operations.</param>
        public AssignmentController(IRepository<Assignment> assignmentRepository)
        {
            _assignmentRepository = assignmentRepository;
        }

        /// <summary>
        /// Returns all assignments in the system (both published drafts and published).
        /// The frontend is responsible for filtering to only show published ones to students.
        /// </summary>
        /// <returns>200 OK with an array of all <see cref="Assignment"/> objects.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            var assignments = await _assignmentRepository.GetAllAsync();
            return Ok(assignments);
        }

        /// <summary>
        /// Creates a new assignment in draft (unpublished) state.
        /// Teachers must explicitly publish it using the <see cref="PublishAssignment"/> endpoint.
        /// </summary>
        /// <param name="dto">The details of the new assignment.</param>
        /// <returns>201 Created with the newly created assignment, or 400 Bad Request on validation failure.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var assignment = new Assignment(dto.Title, dto.Description, dto.Deadline, dto.MaximumMarks, dto.CourseId);
            await _assignmentRepository.AddAsync(assignment);

            return CreatedAtAction(nameof(GetAssignment), new { id = assignment.Id }, assignment);
        }

        /// <summary>
        /// Retrieves a single assignment by its unique identifier.
        /// </summary>
        /// <param name="id">The GUID of the assignment to retrieve.</param>
        /// <returns>200 OK with the assignment, or 404 Not Found if it does not exist.</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignment(Guid id)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(id);
            if (assignment == null) return NotFound();
            return Ok(assignment);
        }

        /// <summary>
        /// Publishes a draft assignment, making it visible to all students.
        /// This action is currently irreversible via the API.
        /// </summary>
        /// <param name="id">The GUID of the assignment to publish.</param>
        /// <returns>200 OK with a success message, or 404 Not Found if the assignment does not exist.</returns>
        [HttpPost("{id}/publish")]
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

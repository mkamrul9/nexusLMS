using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace AssignmentSubmissionSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionController : ControllerBase
    {
        private readonly IRepository<Submission> _submissionRepository;
        private readonly IRepository<Assignment> _assignmentRepository;

        public SubmissionController(IRepository<Submission> submissionRepo, IRepository<Assignment> assignmentRepo)
        {
            _submissionRepository = submissionRepo;
            _assignmentRepository = assignmentRepo;
        }

        [HttpPost]
        [Authorize(Roles = "Student")] // Strictly Student access
        public async Task<IActionResult> SubmitAssignment([FromBody] SubmitAnswerDto dto)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId);
            if (assignment == null) return NotFound("Assignment not found.");

            if (DateTime.UtcNow > assignment.Deadline)
            {
                return BadRequest("The deadline for this assignment has passed.");
            }

            // In a real app, extract StudentId from the JWT claims
            var studentId = Guid.NewGuid(); // Placeholder

            var submission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = dto.AssignmentId,
                StudentId = studentId,
                AnswerContent = dto.AnswerContent,
                SubmittedAt = DateTime.UtcNow
            };

            await _submissionRepository.AddAsync(submission);
            return Ok(new { message = "Assignment submitted successfully.", id = submission.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Student")] // Strictly Student access
        public async Task<IActionResult> UpdateSubmission(Guid id, [FromBody] SubmitAnswerDto dto)
        {
            var submission = await _submissionRepository.GetByIdAsync(id);
            if (submission == null) return NotFound("Submission not found.");

            var assignment = await _assignmentRepository.GetByIdAsync(submission.AssignmentId);
            if (assignment == null) return NotFound("Assignment not found.");

            if (DateTime.UtcNow > assignment.Deadline)
            {
                return BadRequest("The deadline for this assignment has passed. You cannot update the submission.");
            }

            submission.AnswerContent = dto.AnswerContent;
            submission.SubmittedAt = DateTime.UtcNow;

            await _submissionRepository.UpdateAsync(submission);
            return Ok(new { message = "Assignment updated successfully." });
        }
    }
}

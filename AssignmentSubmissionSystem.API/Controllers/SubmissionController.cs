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
        [Authorize]
        public async Task<IActionResult> SubmitAssignment([FromBody] SubmitAnswerDto dto)
        {
            var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId);
            if (assignment == null) return NotFound("Assignment not found.");

            if (DateTime.UtcNow > assignment.Deadline)
            {
                return BadRequest(new { message = "The deadline for this assignment has passed." });
            }

            // Extract the StudentId from the JWT claims
            var studentIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !Guid.TryParse(studentIdClaim, out var studentId))
            {
                return Unauthorized(new { message = "Could not identify the logged-in student." });
            }

            var submission = new Submission
            {
                Id = Guid.NewGuid(),
                AssignmentId = dto.AssignmentId,
                StudentId = studentId,
                AnswerContent = dto.AnswerContent,
                SubmittedAt = DateTime.UtcNow,
                Feedback = "",
                Status = "Submitted"
            };

            await _submissionRepository.AddAsync(submission);
            return Ok(new { message = "Assignment submitted successfully.", id = submission.Id });
        }

        [HttpPut("{id}")]
        [Authorize]
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

        [HttpPut("{submissionId}/grade")]
        [Authorize]
        public async Task<IActionResult> GradeSubmission(Guid submissionId, [FromBody] GradeSubmissionDto dto)
        {
            var submission = await _submissionRepository.GetByIdAsync(submissionId);
            if (submission == null) return NotFound("Submission not found.");
        
            // Optional but recommended: Verify the teacher grading it is assigned to the course
            
            // Update the submission with grading data
            submission.MarksAwarded = dto.Marks;
            submission.Feedback = dto.Feedback;
            submission.Status = dto.Status;
        
            await _submissionRepository.UpdateAsync(submission);
        
            return Ok(new { message = "Submission graded successfully." });
        }

        [HttpGet("assignment/{assignmentId}")]
        [Authorize]
        public async Task<IActionResult> GetSubmissionsForAssignment(Guid assignmentId)
        {
            var allSubmissions = await _submissionRepository.GetAllAsync();
            var assignmentSubmissions = allSubmissions.Where(s => s.AssignmentId == assignmentId);
            return Ok(assignmentSubmissions);
        }

        [HttpGet("my-submissions")]
        [Authorize] // Any authenticated user — filters by student ID internally
        public async Task<IActionResult> GetMySubmissions()
        {
            var studentIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !Guid.TryParse(studentIdClaim, out var studentId))
            {
                return Ok(new List<Submission>()); // Not a student or no ID claim — return empty
            }

            var allSubmissions = await _submissionRepository.GetAllAsync();
            var mySubmissions = allSubmissions.Where(s => s.StudentId == studentId);
            return Ok(mySubmissions);
        }
    }
}

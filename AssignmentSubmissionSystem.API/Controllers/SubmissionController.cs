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
    /// <summary>
    /// Manages the full submission lifecycle: creating, updating, grading, and retrieving student submissions.
    /// Endpoints are accessible to all authenticated users, with identity filtering handled internally
    /// (e.g., students only see their own submissions via <see cref="GetMySubmissions"/>).
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SubmissionController : ControllerBase
    {
        private readonly IRepository<Submission> _submissionRepository;
        private readonly IRepository<Assignment> _assignmentRepository;

        /// <summary>
        /// Initialises a new instance of <see cref="SubmissionController"/>.
        /// </summary>
        /// <param name="submissionRepo">Repository for submission CRUD operations.</param>
        /// <param name="assignmentRepo">Repository for reading assignment data (deadline validation).</param>
        public SubmissionController(IRepository<Submission> submissionRepo, IRepository<Assignment> assignmentRepo)
        {
            _submissionRepository = submissionRepo;
            _assignmentRepository = assignmentRepo;
        }

        /// <summary>
        /// Creates a new submission for an assignment. Only accessible by authenticated users (students).
        /// The student's identity is read from the JWT token claims — not from the request body.
        /// Rejects submissions if the assignment deadline has already passed.
        /// </summary>
        /// <param name="dto">The assignment ID and the student's answer content.</param>
        /// <returns>
        /// 200 OK with the new submission ID on success.
        /// 400 Bad Request if the deadline has passed.
        /// 401 Unauthorized if the user's ID cannot be resolved from the token.
        /// 404 Not Found if the assignment does not exist.
        /// </returns>
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

            // Extract the student's GUID from the NameIdentifier claim embedded in the JWT
            var studentIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !Guid.TryParse(studentIdClaim, out var studentId))
            {
                return Unauthorized(new { message = "Could not identify the logged-in student." });
            }

            var submission = new Submission
            {
                Id            = Guid.NewGuid(),
                AssignmentId  = dto.AssignmentId,
                StudentId     = studentId,
                AnswerContent = dto.AnswerContent,
                SubmittedAt   = DateTime.UtcNow,
                Feedback      = "",
                Status        = SubmissionStatus.Submitted
            };

            await _submissionRepository.AddAsync(submission);
            return Ok(new { message = "Assignment submitted successfully.", id = submission.Id });
        }

        /// <summary>
        /// Updates a student's existing submission (e.g., editing before the deadline).
        /// Rejects updates if the assignment deadline has already passed.
        /// </summary>
        /// <param name="id">The GUID of the submission to update.</param>
        /// <param name="dto">The updated answer content.</param>
        /// <returns>200 OK on success, or 400/404 on error.</returns>
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
            submission.SubmittedAt   = DateTime.UtcNow;

            await _submissionRepository.UpdateAsync(submission);
            return Ok(new { message = "Assignment updated successfully." });
        }

        /// <summary>
        /// Saves a teacher's grade (marks, feedback, status) for a specific student submission.
        /// </summary>
        /// <param name="submissionId">The GUID of the submission to grade.</param>
        /// <param name="dto">The grade data including marks, feedback, and the new status.</param>
        /// <returns>200 OK with a success message, or 404 Not Found if the submission does not exist.</returns>
        [HttpPut("{submissionId}/grade")]
        [Authorize]
        public async Task<IActionResult> GradeSubmission(Guid submissionId, [FromBody] GradeSubmissionDto dto)
        {
            var submission = await _submissionRepository.GetByIdAsync(submissionId);
            if (submission == null) return NotFound("Submission not found.");

            submission.MarksAwarded = dto.Marks;
            submission.Feedback     = dto.Feedback;
            submission.Status       = dto.Status;

            await _submissionRepository.UpdateAsync(submission);
            return Ok(new { message = "Submission graded successfully." });
        }

        /// <summary>
        /// Returns all submissions for a specific assignment. Intended for teachers to review all responses.
        /// </summary>
        /// <remarks>
        /// ⚠️ Scalability Note: This loads all submissions into memory and filters in-memory.
        /// For large deployments, add a <c>GetByAssignmentIdAsync</c> method to <see cref="IRepository{T}"/>
        /// to perform a server-side filtered database query instead.
        /// </remarks>
        /// <param name="assignmentId">The GUID of the assignment whose submissions to retrieve.</param>
        /// <returns>200 OK with an array of submissions for the given assignment.</returns>
        [HttpGet("assignment/{assignmentId}")]
        [Authorize]
        public async Task<IActionResult> GetSubmissionsForAssignment(Guid assignmentId)
        {
            var allSubmissions = await _submissionRepository.GetAllAsync();
            var assignmentSubmissions = allSubmissions.Where(s => s.AssignmentId == assignmentId);
            return Ok(assignmentSubmissions);
        }

        /// <summary>
        /// Returns all submissions made by the currently authenticated student.
        /// The student's identity is resolved from the JWT token claims.
        /// If the token does not carry a valid student ID, returns an empty list gracefully.
        /// </summary>
        /// <remarks>
        /// ⚠️ Scalability Note: Same as above — loads all submissions then filters. Add a
        /// <c>GetByStudentIdAsync</c> method to the repository for production-scale use.
        /// </remarks>
        /// <returns>200 OK with an array of the student's own submissions.</returns>
        [HttpGet("my-submissions")]
        [Authorize]
        public async Task<IActionResult> GetMySubmissions()
        {
            var studentIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !Guid.TryParse(studentIdClaim, out var studentId))
            {
                // Return empty rather than an error — the caller may not be a student
                return Ok(new List<Submission>());
            }

            var allSubmissions = await _submissionRepository.GetAllAsync();
            var mySubmissions  = allSubmissions.Where(s => s.StudentId == studentId);
            return Ok(mySubmissions);
        }
    }
}

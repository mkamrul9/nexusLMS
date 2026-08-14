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
    /// Manages course creation, retrieval, and teacher assignment.
    /// All endpoints require a valid JWT token (any authenticated role).
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // All endpoints in this controller require a valid JWT token
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Course> _courseRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<CourseTeacher> _courseTeacherRepository;

        /// <summary>
        /// Initialises a new instance of <see cref="CourseController"/>.
        /// </summary>
        /// <param name="courseRepository">Repository for course CRUD operations.</param>
        /// <param name="userRepository">Repository for user lookups (used to validate teacher assignment).</param>
        /// <param name="courseTeacherRepository">Repository for managing course-teacher relationships.</param>
        public CourseController(
            IRepository<Course> courseRepository,
            IRepository<User> userRepository,
            IRepository<CourseTeacher> courseTeacherRepository)
        {
            _courseRepository = courseRepository;
            _userRepository = userRepository;
            _courseTeacherRepository = courseTeacherRepository;
        }

        /// <summary>
        /// Returns all courses available on the platform.
        /// Used by both the Admin dashboard (management) and Teacher workspace (course selection).
        /// </summary>
        /// <returns>200 OK with an array of all <see cref="Course"/> objects.</returns>
        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseRepository.GetAllAsync();
            return Ok(courses);
        }

        /// <summary>
        /// Creates a new course. Intended for admin use only (enforced on the frontend).
        /// </summary>
        /// <param name="dto">The details of the new course.</param>
        /// <returns>201 Created with the new course, or 400 Bad Request on validation failure.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var course = new Course(dto.Name, dto.SubjectCode, dto.Description);
            await _courseRepository.AddAsync(course);

            return CreatedAtAction(nameof(GetAllCourses), new { id = course.Id }, course);
        }

        /// <summary>
        /// Assigns an existing teacher user to a course, creating a <see cref="CourseTeacher"/> relationship.
        /// A course can have multiple teachers. Duplicate assignments are not prevented at the API level.
        /// </summary>
        /// <param name="courseId">The GUID of the course to assign the teacher to.</param>
        /// <param name="teacherId">The GUID of the user (must have Role = "Teacher") to assign.</param>
        /// <returns>
        /// 200 OK with a success message.
        /// 404 Not Found if the course does not exist.
        /// 400 Bad Request if the user ID is invalid or the user is not a Teacher.
        /// </returns>
        [HttpPost("{courseId}/assign-teacher/{teacherId}")]
        public async Task<IActionResult> AssignTeacherToCourse(Guid courseId, Guid teacherId)
        {
            var course = await _courseRepository.GetByIdAsync(courseId);
            if (course == null) return NotFound("Course not found.");

            var teacher = await _userRepository.GetByIdAsync(teacherId);
            if (teacher == null || teacher.Role != "Teacher") return BadRequest("Invalid Teacher ID.");

            await _courseTeacherRepository.AddAsync(new CourseTeacher { CourseId = courseId, TeacherId = teacherId });

            return Ok(new { message = "Teacher successfully assigned to course." });
        }
    }
}

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
    [Authorize] // Allow all authenticated users to access endpoints unless restricted
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Course> _courseRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IRepository<CourseTeacher> _courseTeacherRepository;

        public CourseController(
            IRepository<Course> courseRepository,
            IRepository<User> userRepository,
            IRepository<CourseTeacher> courseTeacherRepository)
        {
            _courseRepository = courseRepository;
            _userRepository = userRepository;
            _courseTeacherRepository = courseTeacherRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseRepository.GetAllAsync();
            return Ok(courses);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Instantiate the domain entity
            var course = new Course(dto.Name, dto.SubjectCode, dto.Description);
            
            await _courseRepository.AddAsync(course);

            return CreatedAtAction(nameof(GetAllCourses), new { id = course.Id }, course);
        }

        [HttpPost("{courseId}/assign-teacher/{teacherId}")]
        [Authorize]
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

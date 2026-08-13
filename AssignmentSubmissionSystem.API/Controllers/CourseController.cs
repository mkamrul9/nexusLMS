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
    public class CourseController : ControllerBase
    {
        private readonly IRepository<Course> _courseRepository;

        public CourseController(IRepository<Course> courseRepository)
        {
            _courseRepository = courseRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _courseRepository.GetAllAsync();
            return Ok(courses);
        }

        [HttpPost]
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
    }
}

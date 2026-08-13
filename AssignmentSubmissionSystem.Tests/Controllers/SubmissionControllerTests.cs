// AssignmentSubmissionSystem.Tests/Controllers/SubmissionControllerTests.cs
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using AssignmentSubmissionSystem.API.Controllers;
using AssignmentSubmissionSystem.Domain.Entities;
using AssignmentSubmissionSystem.Domain.Interfaces;
using AssignmentSubmissionSystem.Application.DTOs;

namespace AssignmentSubmissionSystem.Tests.Controllers
{
    public class SubmissionControllerTests
    {
        [Fact]
        public async Task SubmitAssignment_PastDeadline_ReturnsBadRequest()
        {
            // Arrange
            var mockSubmissionRepo = new Mock<IRepository<Submission>>();
            var mockAssignmentRepo = new Mock<IRepository<Assignment>>();
            
            var pastDeadline = DateTime.UtcNow.AddDays(-1); // Deadline was yesterday
            var assignmentId = Guid.NewGuid();
            
            var assignment = new Assignment("Test", "Test Desc", pastDeadline, 100, Guid.NewGuid());
            
            mockAssignmentRepo.Setup(repo => repo.GetByIdAsync(assignmentId))
                              .ReturnsAsync(assignment);

            var controller = new SubmissionController(mockSubmissionRepo.Object, mockAssignmentRepo.Object);
            
            var dto = new SubmitAnswerDto { AssignmentId = assignmentId, AnswerContent = "My answer" };

            // Act
            var result = await controller.SubmitAssignment(dto);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("The deadline for this assignment has passed.", badRequestResult.Value);
        }
    }
}

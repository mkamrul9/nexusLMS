using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AssignmentSubmissionSystem.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AssignmentSubmissionSystem.Infrastructure.Services
{
    /// <summary>
    /// Generates signed JWT (JSON Web Token) access tokens for authenticated users.
    /// Tokens carry the user's ID, email, and role as claims, and are validated by the ASP.NET Core
    /// JWT middleware on every protected API request.
    /// </summary>
    public class TokenService
    {
        /// <summary>Application configuration, used to read JWT settings (Key, Issuer, Audience).</summary>
        private readonly IConfiguration _config;

        /// <summary>
        /// Initialises a new instance of <see cref="TokenService"/>.
        /// </summary>
        /// <param name="config">The application configuration, injected via DI.</param>
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>
        /// Generates a signed JWT access token for the given user.
        /// The token encodes the user's email (sub), unique ID (NameIdentifier claim), and role.
        /// It expires after 2 hours and is signed using HMAC-SHA256.
        /// </summary>
        /// <param name="user">The authenticated user for whom the token is being generated.</param>
        /// <returns>A compact, signed JWT string that the frontend stores and sends on every API call.</returns>
        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                // 'sub' is the standard JWT subject claim, used here to store the user's email
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
                // NameIdentifier carries the user's GUID — extracted in controllers via User.FindFirst()
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                // Role claim powers [Authorize(Roles = "...")] attributes and frontend role-based routing
                new Claim(ClaimTypes.Role, user.Role ?? "Student")
            };

            var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer:            _config["Jwt:Issuer"],
                audience:          _config["Jwt:Audience"],
                claims:            claims,
                expires:           DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

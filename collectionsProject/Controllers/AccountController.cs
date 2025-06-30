using collectionsProject.Models;
using collectionsProject.Services;
using collectionsProject.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace collectionsProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly DbFromExistingContext _context;
        private readonly JwtService _jwtService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(SignInManager<User> signInManager, UserManager<User> userManager, JwtService jwtService, DbFromExistingContext context)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email.ToLower() == dto.Email.ToLower()))
                return BadRequest("Email already exists");
            if (_context.Users.Any(u => u.UserName.ToLower() == dto.UserName.ToLower()))
                return BadRequest("Username already exists");

            byte[]? avatarBytes = null;
            if (!string.IsNullOrEmpty(dto.AvatarBase64))
            {
                try
                {
                    avatarBytes = Convert.FromBase64String(dto.AvatarBase64);
                }
                catch
                {
                    return BadRequest("Invalid avatar format");
                }
            }

            var user = new User
            {
                Email = dto.Email,
                UserName = dto.UserName,
                PhoneNumber = dto.PhoneNumber,
                Avatar = avatarBytes,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            var res = await _userManager.CreateAsync(user, dto.Password);
            if (!res.Succeeded)
                return BadRequest();

            return Ok("Registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Неправильний логін або пароль" });

            var res = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!res.Succeeded)
                return Unauthorized(new { message = "Неправильний логін або пароль" });

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.UserName);
            Response.Cookies.Append("jwtToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(new { token });
        }

        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.PhoneNumber,
                AvatarBase64 = user.Avatar != null ? Convert.ToBase64String(user.Avatar) : null
            });
        }

        [HttpPut("me")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(dto.Email))
                user.Email = dto.Email;

            if (!string.IsNullOrEmpty(dto.UserName))
                user.UserName = dto.UserName;

            if (!string.IsNullOrEmpty(dto.PhoneNumber))
                user.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrEmpty(dto.AvatarBase64))
            {
                try
                {
                    user.Avatar = Convert.FromBase64String(dto.AvatarBase64);
                }
                catch
                {
                    return BadRequest("Invalid avatar format");
                }
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest("Failed to update user");

            return Ok("Profile updated");
        }

        [HttpGet("check-unique")]
        public IActionResult CheckUnique([FromQuery] string field, [FromQuery] string value)
        {
            if (string.IsNullOrWhiteSpace(field) || string.IsNullOrWhiteSpace(value))
                return BadRequest("Field and value are required");

            var fieldLower = field.ToLower();
            bool isUnique = fieldLower switch
            {
                "email" => !_context.Users.Any(u => u.Email.ToLower() == value.ToLower()),
                "username" or "userName" => !_context.Users.Any(u => u.UserName.ToLower() == value.ToLower()),
                _ => throw new ArgumentException("Unsupported field")
            };

            return Ok(new { isUnique });
        }

        // DTO для реєстрації
        public class RegisterDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string UserName { get; set; }
            public string PhoneNumber { get; set; }
            public string? AvatarBase64 { get; set; }
        }

        // DTO для логіну
        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // DTO для оновлення
        public class UpdateUserDto
        {
            public string? Email { get; set; }
            public string? UserName { get; set; }
            public string? PhoneNumber { get; set; }
            public string? AvatarBase64 { get; set; }
        }
    }
}
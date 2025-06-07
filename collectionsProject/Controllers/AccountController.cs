using collectionsProject.Models;
using collectionsProject.Services;
using collectionsProject.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
            this._context = context;
            this._signInManager = signInManager;
            this._userManager = userManager;
            this._jwtService = jwtService;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (_context.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            var user = new User
            {
                Email = dto.Email,
                UserName = dto.UserName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            var res = await _userManager.CreateAsync(user, dto.Password);
            //await _context.SaveChangesAsync();
            if (!res.Succeeded)
                return BadRequest();

            return Ok("Registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Неправильний логін або пароль" });
            }

            var res = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!res.Succeeded)
            {
                return Unauthorized(new { message = "Неправильний логін або пароль" });
            }

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.UserName);
            Response.Cookies.Append("jwtToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return Ok(new { token = token });
        }
    }

    // DTO для реєстрації
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; } 
    }


    // DTO для логіну
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

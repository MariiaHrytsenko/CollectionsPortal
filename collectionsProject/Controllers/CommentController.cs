using collectionsProject.Dto;
using collectionsProject.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CommentController : ControllerBase
    {
        private readonly DbFromExistingContext _context;

        public CommentController(DbFromExistingContext context)
        {
            _context = context;
        }

        // Create
        [HttpPost]
        public async Task<ActionResult> Createcomment([FromBody] CommentAdd dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comm = new Comment
            {
                IDitem = dto.IDitem,
                IDcommentator = userId,
                CreatedDate = DateTime.UtcNow,
                Text = dto.Text
            };

            _context.Comments.Add(comm);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully created new comment", commentId = comm.IDcomment });
        }

        // Get all comments for an item
        [HttpGet("item/{ItemId}")]
        public async Task<ActionResult<List<CommentDTO>>> GetComments(int ItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comments = await _context.Comments
                .Where(c => c.IDitem == ItemId)
                .Include(c => c.Commentator)
                .Select(c => new CommentDTO
                {
                    IDcomment = c.IDcomment,
                    IDitem = c.IDitem,
                    Text = c.Text,
                    CreatedDate = c.CreatedDate,
                    Username = c.Commentator.UserName,
                    IDcommentator = c.Commentator.Id,
                    AvatarBase64 = c.Commentator.Avatar != null ? Convert.ToBase64String(c.Commentator.Avatar) : null
                })
                .ToListAsync();

            return Ok(comments);
        }

        // Edit
        [HttpPut("{id}")]
        public async Task<IActionResult> EditComment(int id, [FromBody] CommentDTO commDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            if (id != commDto.IDcomment)
                return BadRequest("ID in URL and Body mismatch.");

            var existingComm = await _context.Comments
                .FirstOrDefaultAsync(comm => comm.IDcomment == id && comm.IDcommentator == userId);

            if (existingComm == null)
                return NotFound();

            existingComm.Text = commDto.Text;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment updated", commentId = existingComm.IDcomment });
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comm = await _context.Comments
                .FirstOrDefaultAsync(c => c.IDcomment == id && c.IDcommentator == userId);

            if (comm == null) return NotFound();

            _context.Comments.Remove(comm);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment deleted" });
        }
    }
}

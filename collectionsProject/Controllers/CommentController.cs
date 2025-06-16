using collectionsProject.Dto;
using collectionsProject.Models;
using collectionsProject.OldModels;
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

        //create
        [HttpPost]
        public async Task<ActionResult<CommentAdd>> Createcomment([FromBody] CommentAdd dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comm = new Comment
            {
                IDitem = dto.IDitem,
                IDcommentator = userId,
                CreatedDate = DateTime.Now,
                Text = dto.Text
            };

            _context.Comments.Add(comm);
            await _context.SaveChangesAsync();



            return Ok("Successfully created new comment");
        }

        //get
        [HttpGet("item/{ItemId}")]
        public async Task<ActionResult<List<CommentDTO>>> GetComments(int ItemId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comments = await _context.Comments
                .Where(com => com.IDitem == ItemId)
                .ToListAsync();

            return Ok(comments);

        }

        //edit
        [HttpPut("{id}")]
        public async Task<IActionResult> EditComment(int id, [FromBody] CommentDTO commDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            if (id != commDto.IDcomment)
            {
                return BadRequest("ID in URL and Body mismatch.");
            }

            var existingComm = await _context.Comments
                                    .FirstOrDefaultAsync(comm => comm.IDcomment == id && comm.IDcommentator == userId); // <-- FIXED
            if (existingComm == null)
                return NotFound();

            existingComm.Text = commDto.Text;

            await _context.SaveChangesAsync();

            return Ok();
        }

        //delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var comm = await _context.Comments
                .FirstOrDefaultAsync(c => c.IDcomment == id && c.IDcommentator== userId);

            if (comm == null) return NotFound();

            _context.Comments.Remove(comm);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while saving: {ex.Message}");
            }

            return Ok();
        }

    }
}

using collectionsProject.Dto;
using collectionsProject.Models;
using collectionsProject.OldModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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





    }
}

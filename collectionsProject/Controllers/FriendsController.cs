using collectionsProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FriendsController : ControllerBase
    {
        private readonly DbFromExistingContext _context;

        public FriendsController(DbFromExistingContext context)
        {
            _context = context;
        }

        // GET: api/friends
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FriendDto>>> GetFriends()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var friends = await _context.Friends
                .Include(f => f.Requester)
                .Include(f => f.Receiver)
                .Where(f => f.IDrequester == userId || f.IDreceiver == userId)
                .ToListAsync();

            var result = friends.Select(f =>
            {
                var friendUser = f.IDrequester == userId ? f.Receiver : f.Requester;
                return new FriendDto
                {
                    Id = friendUser.Id,
                    UserName = friendUser.UserName,
                    Email = friendUser.Email,
                    AvatarBase64 = friendUser.Avatar != null ? Convert.ToBase64String(friendUser.Avatar) : null,
                    Status = "Accepted" // або f.Status якщо поле є
                };
            });

            return Ok(result);
        }


        // GET: api/friends/{friendId}/items
        [HttpGet("{friendId}/items")]
        public async Task<ActionResult<IEnumerable<Item>>> GetFriendItems(string friendId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var isFriend = await _context.Friends.AnyAsync(f =>
                (f.IDrequester == userId && f.IDreceiver == friendId) ||
                (f.IDrequester == friendId && f.IDreceiver == userId)
            );

            if (!isFriend)
                return Forbid("Цей користувач не є вашим другом.");

            var items = await _context.Items
                .Where(i => i.Id == friendId)
                .ToListAsync();

            return Ok(items);
        }
    }
}


public class FriendDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string? AvatarBase64 { get; set; }
    public string? Status { get; set; }  
}

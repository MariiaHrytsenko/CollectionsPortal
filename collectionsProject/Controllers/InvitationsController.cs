using collectionsProject.Models;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvitationsController : ControllerBase
    {
        private readonly DbFromExistingContext _context;

        public InvitationsController(DbFromExistingContext context)
        {
            _context = context;
        }

        // GET: api/invitations/received
        [HttpGet("received")]
        public async Task<ActionResult<IEnumerable<Invitation>>> GetReceivedInvitations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invitations = await _context.Invitations
                .Include(i => i.Inviter)
                .Where(i => i.IDrequester == userId)
                .ToListAsync();

            return Ok(invitations);
        }

        // POST: api/invitations/accept
        [HttpPost("accept")]
        public async Task<IActionResult> AcceptInvitation([FromBody] AcceptInvitationDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var invitation = await _context.Invitations
                .FirstOrDefaultAsync(i => i.Token == dto.Token && i.IDrequester == userId);

            if (invitation == null)
                return NotFound("Запрошення не знайдено або не належить користувачу.");

            var friendship = new Friend
            {
                IDrequester = invitation.IDinviter,
                IDreceiver = invitation.IDrequester
            };

            _context.Friends.Add(friendship);
            _context.Invitations.Remove(invitation);

            await _context.SaveChangesAsync();

            return Ok("Запрошення прийнято.");
        }
    }
}

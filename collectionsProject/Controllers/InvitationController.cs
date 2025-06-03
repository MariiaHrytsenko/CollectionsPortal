using collectionsProject.Dto;
using collectionsProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace collectionsProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
  //  [Authorize]
    public class InvitationsController : ControllerBase
    {
        private readonly DbFromExistingContext _context;
        private readonly InvitationService _invitationService;

        public InvitationsController(DbFromExistingContext context, InvitationService invitationService)
        {
            _context = context;
            _invitationService = invitationService;
        }

        // POST: api/invitations/send
        [HttpPost("send")]
        public async Task<IActionResult> SendInvitation([FromBody] SendInvitationRequest request)
        {
            try
            {
                var success = await _invitationService.SendInvitationAsync(request.InviterId, request.Email);
                return success ? Ok("Invitation sent") : BadRequest("Failed to send invitation");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
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

    public class SendInvitationRequest
    {
        public string InviterId { get; set; }
        public string Email { get; set; }
    }

}

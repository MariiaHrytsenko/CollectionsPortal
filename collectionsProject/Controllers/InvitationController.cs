using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class InvitationsController : ControllerBase
{
    private readonly InvitationService _invitationService;

    public InvitationsController(InvitationService invitationService)
    {
        _invitationService = invitationService;
    }

    [HttpPost("Send")]
    public async Task<IActionResult> SendInvitation([FromBody] SendInvitationRequest request)
    {
        try
        {
            // Тут можна отримати ID користувача з контексту (наприклад, User.Identity.Name або Claims)
            // Для прикладу приймемо, що ID передається у тілі
            var success = await _invitationService.SendInvitationAsync(request.InviterId, request.Email);
            if (success) return Ok("Invitation sent");
            else return BadRequest("Failed to send invitation");
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

public class SendInvitationRequest
{
    public string InviterId { get; set; }
    public string Email { get; set; }
}

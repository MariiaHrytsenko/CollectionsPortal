using collectionsProject.Models;
using collectionsProject.Services;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace collectionsProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CharacteristicsController : ControllerBase
    {
        private readonly CharacteristicService _service;

        public CharacteristicsController(CharacteristicService service)
        {
            _service = service;
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        [HttpPost]
        public async Task<IActionResult> AddCharacteristic([FromBody] CreateCharacteristicDto dto)
        {
            var userId = GetUserId();
            await _service.AddCharacteristicAsync(userId, dto: dto);
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult<List<CharacteristicDto>>> GetUserCharacteristics()
        {
            var userId = GetUserId();
            var result = await _service.GetUserCharacteristicsAsync(userId);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> RenameCharacteristic([FromBody] UpdateCharacteristicDto dto)
        {
            var userId = GetUserId();
            var success = await _service.RenameCharacteristicAsync(userId, dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{idcharacteristic}")]
        public async Task<IActionResult> DeleteCharacteristic(int idcharacteristic)
        {
            var userId = GetUserId();
            var success = await _service.DeleteCharacteristicAsync(userId, idcharacteristic);
            return success ? Ok() : NotFound();
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignCharacteristic([FromBody] AssignCharacteristicDto dto)
        {
            var userId = GetUserId();
            var success = await _service.AssignCharacteristicToCategoryAsync(userId, dto);
            return success ? Ok("Assigned successfully.") : BadRequest("Assignment failed.");
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveCharacteristic([FromBody] AssignCharacteristicDto dto)
        {
            var userId = GetUserId();
            var success = await _service.RemoveCharacteristicFromCategoryAsync(userId, dto);
            return success ? Ok("Removed successfully.") : NotFound("Relationship not found or unauthorized.");
        }
    }

}

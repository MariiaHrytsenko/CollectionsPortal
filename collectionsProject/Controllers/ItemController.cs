using collectionsProject.Models;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class ItemController : ControllerBase
    {
        private readonly DbFromExistingContext _context;
       // var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);


        public ItemController(DbFromExistingContext context)
        {
            _context = context;
        }

        // GET: api/item
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<ItemDto>>> GetItems()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Вибираємо айтеми, які належать користувачу (припустимо, в Item є поле Id)
            var items = await _context.Items
                .Where(i => i.Id == userId)
                .Include(i => i.Characteristics)
                .ToListAsync();

            var dtos = items.Select(i => new ItemDto
            {
                Iditem = i.Iditem,
                NameItem = i.NameItem,
                PhotoItem = i.PhotoItem == null ? null : Convert.ToBase64String(i.PhotoItem),
                Chracteristics = i.Characteristics.Select(c => new ChracteristicDto
                {
                    Idchracteristic = c.Idchracteristic,
                    Value = c.Value
                }).ToList()
            }).ToList();

            return Ok(dtos);
        }

        // GET: api/item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var item = await _context.Items
                .Include(i => i.Characteristics)
                .FirstOrDefaultAsync(i => i.Iditem == id && i.Id == userId);

            if (item == null) return NotFound();

            var dto = new ItemDto
            {
                Iditem = item.Iditem,
                NameItem = item.NameItem,
                PhotoItem = item.PhotoItem == null ? null : Convert.ToBase64String(item.PhotoItem),
                Chracteristics = item.Characteristics.Select(c => new ChracteristicDto
                {
                    Idchracteristic = c.Idchracteristic,
                    Value = c.Value
                }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/item
        [HttpPost]
        public async Task<ActionResult<ItemDto>> CreateItem([FromBody] ItemDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var item = new Item
            {
                NameItem = dto.NameItem,
                PhotoItem = string.IsNullOrEmpty(dto.PhotoItem) ? null : Convert.FromBase64String(dto.PhotoItem),
                Id = userId // записуємо власника
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Додаємо характеристики
            if (dto.Chracteristics != null && dto.Chracteristics.Any())
            {
                foreach (var chDto in dto.Chracteristics)
                {
                    var ch = new Characteristic
                    {
                        Iditem = item.Iditem,
                        Value = chDto.Value
                    };
                    _context.Chracteristics.Add(ch);
                }
                await _context.SaveChangesAsync();
            }

            dto.Iditem = item.Iditem;

            return CreatedAtAction(nameof(GetItem), new { id = item.Iditem }, dto);
        }

        // PUT: api/item/5
        // PUT: api/item/5
[HttpPut("{id}")]
public async Task<IActionResult> PutItem(int id, [FromBody] ItemDto itemDto)
{
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Unauthorized();

    if (id != itemDto.Iditem)
        return BadRequest("ID в URL та в тілі не співпадають.");

    var existingItem = await _context.Items
                            .Include(i => i.Characteristics)
                            .FirstOrDefaultAsync(i => i.Iditem == id && i.Id == userId); // <-- FIXED

    if (existingItem == null)
        return NotFound();

    existingItem.NameItem = itemDto.NameItem;

    // Обробляємо PhotoItem
    if (!string.IsNullOrEmpty(itemDto.PhotoItem) && itemDto.PhotoItem.ToLower() != "null")
    {
        try
        {
            existingItem.PhotoItem = Convert.FromBase64String(itemDto.PhotoItem);
        }
        catch
        {
            return BadRequest("PhotoItem має бути Base64 рядком.");
        }
    }
    else
    {
        existingItem.PhotoItem = null;
    }

    // Оновлюємо характеристики: видаляємо старі та додаємо нові
    _context.Chracteristics.RemoveRange(existingItem.Characteristics);
    existingItem.Characteristics.Clear();

    foreach (var chrDto in itemDto.Chracteristics)
    {
        var characteristic = new Characteristic
        {
            Value = chrDto.Value,
            Iditem = id
        };
        existingItem.Characteristics.Add(characteristic);
    }

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Помилка при збереженні: {ex.Message}");
    }

    return NoContent();
}


        // DELETE: api/item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var item = await _context.Items
                .Include(i => i.Characteristics)
                .FirstOrDefaultAsync(i => i.Iditem == id && i.Id == userId);

            if (item == null) return NotFound();

            _context.Chracteristics.RemoveRange(item.Characteristics);
            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

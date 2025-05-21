using collectionsProject.Models;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly DbFromExistingContext _context;

        public ItemController(DbFromExistingContext context)
        {
            _context = context;
        }

        // GET: api/item
        [HttpGet]
        public async Task<ActionResult<List<ItemDto>>> GetItems()
        {
            var items = await _context.Items
                .Include(i => i.Chracteristics)
                .ToListAsync();

            var dtos = items.Select(i => new ItemDto
            {
                Iditem = i.Iditem,
                NameItem = i.NameItem,
                PhotoItem = i.PhotoItem == null ? null : Convert.ToBase64String(i.PhotoItem),
                Chracteristics = i.Chracteristics.Select(c => new ChracteristicDto
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
            var item = await _context.Items
                .Include(i => i.Chracteristics)
                .FirstOrDefaultAsync(i => i.Iditem == id);

            if (item == null) return NotFound();

            var dto = new ItemDto
            {
                Iditem = item.Iditem,
                NameItem = item.NameItem,
                PhotoItem = item.PhotoItem == null ? null : Convert.ToBase64String(item.PhotoItem),
                Chracteristics = item.Chracteristics.Select(c => new ChracteristicDto
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
            var item = new Item
            {
                NameItem = dto.NameItem,
                PhotoItem = string.IsNullOrEmpty(dto.PhotoItem) ? null : Convert.FromBase64String(dto.PhotoItem)
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Додаємо характеристики
            if (dto.Chracteristics != null && dto.Chracteristics.Any())
            {
                foreach (var chDto in dto.Chracteristics)
                {
                    var ch = new Chracteristic
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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemDto dto)
        {
            var item = await _context.Items
                .Include(i => i.Chracteristics)
                .FirstOrDefaultAsync(i => i.Iditem == id);

            if (item == null) return NotFound();

            item.NameItem = dto.NameItem;
            item.PhotoItem = string.IsNullOrEmpty(dto.PhotoItem) ? null : Convert.FromBase64String(dto.PhotoItem);

            var dtoCharacteristicIds = dto.Chracteristics.Select(c => c.Idchracteristic).ToHashSet();

            // Видаляємо характеристики, яких немає в DTO
            var toRemove = item.Chracteristics.Where(c => !dtoCharacteristicIds.Contains(c.Idchracteristic)).ToList();
            _context.Chracteristics.RemoveRange(toRemove);

            // Оновлюємо або додаємо характеристики
            foreach (var chDto in dto.Chracteristics)
            {
                var existing = item.Chracteristics.FirstOrDefault(c => c.Idchracteristic == chDto.Idchracteristic);
                if (existing != null)
                {
                    existing.Value = chDto.Value;
                }
                else
                {
                    var newCh = new Chracteristic
                    {
                        Iditem = item.Iditem,
                        Value = chDto.Value
                    };
                    _context.Chracteristics.Add(newCh);
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null) return NotFound();

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

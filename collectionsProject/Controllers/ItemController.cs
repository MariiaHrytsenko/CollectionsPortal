using collectionsProject.Models;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace collectionsProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ItemController : ControllerBase
    {
        //this SHOULD be in appconfig, but i want to make it Just Work, so here it goes!
        private const int MaxItemsInDB = 32000; //can be up to 64bit sighned int -> 1,844674407×10^19
        private Random rnd = new Random();
        

        private readonly DbFromExistingContext _context;
        // var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);


        public ItemController(DbFromExistingContext context)
        {
            _context = context;
        }

        // GET: api/item
        [HttpGet]
        public async Task<ActionResult<List<ItemDto>>> GetItems()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Вибираємо айтеми, які належать користувачу (припустимо, в Item є поле Id)
            var items = await _context.Items
                .Where(i => i.Id == userId)
                .Select(i => new ItemDto
                {
                    Iditem = i.Iditem,
                    NameItem = i.NameItem,
                    PhotoItem = i.PhotoItem == null ? null : Convert.ToBase64String(i.PhotoItem),
                    CategoryId = i.CategoryId,
                    Chracteristics = _context.Chracteristics
                    .Where(c => c.Iditem == i.Iditem)
                .Join(_context.ModelCharacteristics,
                  c => c.Idchracteristic,
                  mc => mc.Idcharacteristic,
                  (c, mc) => new ChracteristicDto
                  {
                      Idchracteristic = mc.Idcharacteristic,
                      NameCharacteristic = mc.NameCharacteristic,
                      Value = c.Value
                  })
                .ToList()
                })

                .ToListAsync();
          

            return Ok(items);
        }

        // GET: api/item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var item = await _context.Items
                .FirstOrDefaultAsync(i => i.Iditem == id && i.Id == userId);

            if (item == null) return NotFound();

            var dto = new ItemDto
            {
                Iditem = item.Iditem,
                NameItem = item.NameItem,
                PhotoItem = item.PhotoItem == null ? null : Convert.ToBase64String(item.PhotoItem),
                CategoryId = item.CategoryId,
                Chracteristics = _context.Chracteristics
                    .Where(c => c.Iditem == item.Iditem)
                .Join(_context.ModelCharacteristics,
                  c => c.Idchracteristic,
                  mc => mc.Idcharacteristic,
                  (c, mc) => new ChracteristicDto
                  {
                      Idchracteristic = mc.Idcharacteristic,
                      NameCharacteristic = mc.NameCharacteristic,
                      Value = c.Value
                  })
                .ToList()
            };

            return Ok(dto);
        }

        // POST: add
        [HttpPost]
        public async Task<ActionResult<ItemAdd>> CreateItem([FromBody] ItemAdd dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            bool itemExists = false;
            int round = 0;
            int newItemId;
            const short maxRounds = 20; //TODO should move to config
            do
            {
                if (round > maxRounds) return BadRequest("Loop detected. too many items in DB. try again"); //TODO this is NOT a Bad Request (400)! this is Loop Detected (508) or at least 500
                round++;
                newItemId = rnd.Next(1, MaxItemsInDB);
                var existingItem = await _context.Items
                    .FirstOrDefaultAsync(i => i.Iditem == newItemId);
                if (existingItem != null) { itemExists = true; }
                
            } while (itemExists == true);

            var item = new Item
            {
                Iditem = newItemId,
                NameItem = dto.NameItem,
                PhotoItem = string.IsNullOrEmpty(dto.PhotoItem) ? null : Convert.FromBase64String(dto.PhotoItem),
                CategoryId = dto.CategoryId,
                Id = userId
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Додаємо характеристики
            if (dto.Chracteristics != null && dto.Chracteristics.Any())
            {
                foreach (var chDto in dto.Chracteristics)
                {
                    //TODO: Add check for correct characteristics
                    var ch = new Characteristic
                    {
                        Iditem = newItemId,
                        Idchracteristic = chDto.Idchracteristic,
                        Value = chDto.Value
                    };
                    _context.Chracteristics.Add(ch);
                }
                await _context.SaveChangesAsync();
            }

            //dto.Iditem = item.Iditem;

            return CreatedAtAction(nameof(GetItem), new { id = newItemId}, dto);
        }

        // PUT: api/item/5
        // Change intem
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, [FromBody] ItemChange itemDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            if (id != itemDto.Iditem)
                return BadRequest("ID in URL and Body mismatch.");

            var existingItem = await _context.Items
                                    .Include(i => i.Characteristics)
                                    .FirstOrDefaultAsync(i => i.Iditem == id && i.Id == userId); // <-- FIXED

            Console.WriteLine(existingItem);
            
            if (existingItem == null)
                return NotFound();

            existingItem.NameItem = itemDto.NameItem;

            /*
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
            }*/
            existingItem.PhotoItem = Convert.FromBase64String(itemDto.PhotoItem);
            // Оновлюємо характеристики: видаляємо старі та додаємо нові
            //TODO check for correct characteristics
            _context.Chracteristics.RemoveRange(existingItem.Characteristics);
            existingItem.Characteristics.Clear();

            foreach (var chrDto in itemDto.Chracteristics)
            {
                var characteristic = new Characteristic
                {
                    Iditem = itemDto.Iditem,
                    Idchracteristic = chrDto.Idchracteristic,
                    Value = chrDto.Value
                };
                existingItem.Characteristics.Add(characteristic);
            }
            //TODO add those everywhere!!!
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
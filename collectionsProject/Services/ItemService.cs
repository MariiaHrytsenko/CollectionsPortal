using collections.Application;
using collectionsProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace collectionsProject.Services
{
    public class ItemService : IItemService
    {
        private readonly DbFromExistingContext _context;

        public ItemService(DbFromExistingContext context)
        {
            _context = context;
        }

        public async Task AddItemAsync(AddItemRequest request)
        {
            var item = new Item
            {
                NameItem = request.NameItem,
                PhotoItem = request.PhotoItem
            };

            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            foreach (var ch in request.Characteristics)
            {
                // Перевірка: чи існує модель характеристики
                var modelChar = await _context.ModelCharacteristics
                    .FirstOrDefaultAsync(mc => mc.Idcharacteristic == ch.IDcharacteristic);

                if (modelChar == null)
                    throw new Exception($"Characteristic ID {ch.IDcharacteristic} does not exist.");

                var characteristic = new Characteristic
                {
                    Iditem = item.Iditem,
                    Idchracteristic = ch.IDcharacteristic,
                    Value = ch.Value
                };

                _context.Chracteristics.Add(characteristic);
            }

            await _context.SaveChangesAsync();
        }
    }
}

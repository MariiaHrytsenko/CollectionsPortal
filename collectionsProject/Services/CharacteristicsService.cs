using collectionsProject.Models;
using collectionsProject.Dto;
using Microsoft.EntityFrameworkCore;


namespace collectionsProject.Services
{
    public class CharacteristicService
    {
        private readonly DbFromExistingContext _context;

        public CharacteristicService(DbFromExistingContext context)
        {
            _context = context;
        }

        public async Task AddCharacteristicAsync(string userId, CreateCharacteristicDto dto)
        {
            var characteristic = new ModelCharacteristic
            {
                NameCharacteristic = dto.NameCharacteristic,
                Id = userId
            };

            _context.ModelCharacteristics.Add(characteristic);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CharacteristicDto>> GetUserCharacteristicsAsync(string userId)
        {
            return await _context.ModelCharacteristics
                .Where(c => c.Id == userId)
                .Select(c => new CharacteristicDto
                {
                    Idcharacteristic = c.Idcharacteristic,
                    NameCharacteristic = c.NameCharacteristic
                })
                .ToListAsync();
        }

        public async Task<bool> RenameCharacteristicAsync(string userId, UpdateCharacteristicDto dto)
        {
            var characteristic = await _context.ModelCharacteristics
                .FirstOrDefaultAsync(c => c.Idcharacteristic == dto.Idcharacteristic && c.Id == userId);

            if (characteristic == null) return false;

            characteristic.NameCharacteristic = dto.NewName;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCharacteristicAsync(string userId, int idcharacteristic)
        {
            var characteristic = await _context.ModelCharacteristics
                .FirstOrDefaultAsync(c => c.Idcharacteristic == idcharacteristic && c.Id == userId);

            if (characteristic == null) return false;

            // Delete from Characteristics table (values per item)
            var values = _context.Chracteristics
                .Where(ch => ch.Idchracteristic == idcharacteristic);
            _context.Chracteristics.RemoveRange(values);

            // Optionally remove entries from linking tables if they exist (e.g., category-characteristic)

            _context.ModelCharacteristics.Remove(characteristic);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AssignCharacteristicToCategoryAsync(string userId, AssignCharacteristicDto dto)
        {
            // Check ownership of both category and characteristic
            var category = await _context.ModelCategories
                .FirstOrDefaultAsync(c => c.Idcategory == dto.Idcategory && c.Id == userId);
            var characteristic = await _context.ModelCharacteristics
                .FirstOrDefaultAsync(c => c.Idcharacteristic == dto.Idcharacteristic && c.Id == userId);

            if (category == null || characteristic == null) return false;

            // Check if already assigned
            bool alreadyExists = await _context.Category
                .AnyAsync(cc => cc.Idcategory == dto.Idcategory && cc.Idcharacteristic == dto.Idcharacteristic);

            if (alreadyExists) return false;

            _context.Category.Add(new collectionsProject.Models.Category
            {
                Idcategory = dto.Idcategory,
                Idcharacteristic = dto.Idcharacteristic
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveCharacteristicFromCategoryAsync(string userId, AssignCharacteristicDto dto)
        {
            // Check ownership
            var category = await _context.ModelCategories
                .FirstOrDefaultAsync(c => c.Idcategory == dto.Idcategory && c.Id == userId);
            var characteristic = await _context.ModelCharacteristics
                .FirstOrDefaultAsync(c => c.Idcharacteristic == dto.Idcharacteristic && c.Id == userId);

            if (category == null || characteristic == null) return false;

            var entry = await _context.Category
                .FirstOrDefaultAsync(cc => cc.Idcategory == dto.Idcategory && cc.Idcharacteristic == dto.Idcharacteristic);

            if (entry == null) return false;

            // Remove the characteristic values from all items in this category
            var itemsInCategory = await _context.Items
                .Where(i => i.CategoryId == dto.Idcategory)
                .Select(i => i.Iditem)
                .ToListAsync();

            var characteristicValues = _context.Chracteristics
                .Where(ch => ch.Idchracteristic == dto.Idcharacteristic && itemsInCategory.Contains(ch.Iditem));

            _context.Chracteristics.RemoveRange(characteristicValues);

            // Remove the category-characteristic association
            _context.Category.Remove(entry);
            await _context.SaveChangesAsync();
            return true;
        }


    }

}

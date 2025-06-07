using collectionsProject.Dto;
using collectionsProject.Models;
using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Services
{
    public class CategoryService
    {
        private readonly DbFromExistingContext _context;

        public CategoryService(DbFromExistingContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryWithCharacteristicsDto>> GetUserCategoriesWithCharacteristicsAsync(string userId)
        {
            // Get categories for the user
            var result = await _context.ModelCategories
            .Where(mc => mc.Id == userId)
            .Select(mc => new CategoryWithCharacteristicsDto
            {
                Idcategory = mc.Idcategory,
                NameCategory = mc.NameCategory,
                Characteristics = _context.Category
                .Where(c => c.Idcategory == mc.Idcategory)
                .Join(_context.ModelCharacteristics,
                  c => c.Idcharacteristic,
                  mc2 => mc2.Idcharacteristic,
                  (c, mc2) => new CharacteristicDto
                  {
                      Idcharacteristic = mc2.Idcharacteristic,
                      NameCharacteristic = mc2.NameCharacteristic
                  })
                .ToList()
            })
            .ToListAsync();


            return result;
        }


        public async Task<bool> AddCategoryAsync(string userId, string nameCategory)
        {
            var category = new ModelCategory
            {
                NameCategory = nameCategory,
                Id = userId
            };

            _context.ModelCategories.Add(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RenameCategoryAsync(string userId, int idcategory, string newName)
        {
            var category = await _context.ModelCategories
                .FirstOrDefaultAsync(c => c.Idcategory == idcategory && c.Id == userId);

            if (category == null) return false;

            category.NameCategory = newName;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCategoryAsync(string userId, int idcategory)
        {
            // Find the category
            var category = await _context.ModelCategories
                .FirstOrDefaultAsync(c => c.Idcategory == idcategory && c.Id == userId);

            if (category == null) return false;

            // Get all items in that category owned by the user
            var itemsToDelete = await _context.Items
                .Where(i => i.CategoryId == idcategory && i.Id == userId)
                .ToListAsync();

            if (itemsToDelete.Any())
            {
                var itemIds = itemsToDelete.Select(i => i.Iditem).ToList();

                // Delete related comments
                var comments = _context.Comments
                    .Where(c => itemIds.Contains(c.IDitem));
                _context.Comments.RemoveRange(comments);

                // Delete related characteristics
                var characteristics = _context.Chracteristics
                    .Where(ch => itemIds.Contains(ch.Iditem));
                _context.Chracteristics.RemoveRange(characteristics);

                // Delete the items themselves
                _context.Items.RemoveRange(itemsToDelete);
            }

            // Delete the category
            _context.ModelCategories.Remove(category);

            // Save all changes
            await _context.SaveChangesAsync();
            return true;
        }
    }
}



using collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace collections.Application
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetCategoriesByUserIdAsync(string userId);

        Task<IEnumerable<Item>> GetItemsByCategoryAsync(int categoryId);

        Task<int> CreateCategoryAsync(CreateCategoryDto dto);
    }
}

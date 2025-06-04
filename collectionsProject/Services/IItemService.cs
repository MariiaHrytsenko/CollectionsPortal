using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using collections.Application;

namespace collectionsProject.Services
{
    public interface IItemService
    {
        Task AddItemAsync(AddItemRequest request);
    }
}

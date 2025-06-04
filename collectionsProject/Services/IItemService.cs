using collections.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace collectionsProject.Services
{
    public interface IItemService
    {
        Task AddItemAsync(AddItemRequest request);
    }
}

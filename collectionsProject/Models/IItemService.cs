using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace collections.Application
{
    public interface IItemService
    {
        Task AddItemAsync(AddItemRequest request);
    }
}

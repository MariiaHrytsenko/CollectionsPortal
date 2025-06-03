using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace collections.Application
{
    public class AddItemRequest
    {
        public string NameItem { get; set; }
        public byte[] PhotoItem { get; set; }

        public List<ItemCharacteristicDto> Characteristics { get; set; }
    }

    public class ItemCharacteristicDto
    {
        public int IDcharacteristic { get; set; }  // existing ModelCharacteristic ID
        public string Value { get; set; }
    }
}

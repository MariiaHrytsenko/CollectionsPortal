using collectionsProject.Models;

namespace collectionsProject.Dto
{
    public class ItemDto
    {
        public int Iditem { get; set; }
        public string? NameItem { get; set; }
        public string? PhotoItem { get; set; }

        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }  // для відображення

        public List<ChracteristicDto>? Chracteristics { get; set; }
    }

    public class ChracteristicDto
    {
        public int Idchracteristic { get; set; }
        public string? Value { get; set; }
    }
}

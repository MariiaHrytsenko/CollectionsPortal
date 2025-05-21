namespace collectionsProject.Dto
{
    public class ItemDto
    {
        public int Iditem { get; set; }  // <- додай це поле

        public string? NameItem { get; set; }
        public string? PhotoItem { get; set; }  // Base64

        public List<ChracteristicDto> Chracteristics { get; set; } = new();
    }

    public class ChracteristicDto
    {
        public int Idchracteristic { get; set; }
        public string? Value { get; set; }
    }
}

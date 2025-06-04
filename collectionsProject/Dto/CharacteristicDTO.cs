namespace collectionsProject.Dto
{
    public class CharacteristicDto
    {
        public int Idcharacteristic { get; set; }
        public string NameCharacteristic { get; set; }
    }

    public class CategoryWithCharacteristicsDto
    {
        public int Idcategory { get; set; }
        public string NameCategory { get; set; }
        public List<CharacteristicDto> Characteristics { get; set; } = new();
    }

}
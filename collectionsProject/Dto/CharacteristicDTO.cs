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

    public class CreateCharacteristicDto
    {
        public string NameCharacteristic { get; set; }
    }

    public class UpdateCharacteristicDto
    {
        public int Idcharacteristic { get; set; }
        public string NewName { get; set; }
    }
    public class AssignCharacteristicDto
    {
        public int Idcategory { get; set; }
        public int Idcharacteristic { get; set; }
    }

    public class AddCharOfItem
    {
       
        public int Idchracteristic { get; set; }

        public string? Value { get; set; }
    }

}
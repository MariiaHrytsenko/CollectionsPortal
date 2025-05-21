using collectionsProject.Models;

namespace collectionsProject.Dto
{
    public class CategoryDto
    {
        public string? NameCategory { get; set; }
        public ICollection<ModelCharacteristic> Idcharacteristics { get; set; } = new List<ModelCharacteristic>();
    }
}
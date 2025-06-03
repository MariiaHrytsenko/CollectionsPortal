namespace collectionsProject.Models
{
    public class Category
    {
        public int IDcategory { get; set; }
        public int IDcharacteristic { get; set; }

        public ModelCategory ModelCategories { get; set; } = null!;
        public ModelCharacteristic ModelCharacteristic { get; set; } = null!;
    }


}

namespace collectionsProject.Models
{
    public class Category
    {
        public int Idcategory { get; set; }
        public int Idcharacteristic { get; set; }

        public ModelCategory ModelCategory{ get; set; } = null!;
        public ModelCharacteristic ModelCharacteristic { get; set; } = null!;
       // public virtual ModelCharacteristic IdcharacteristicNavigation { get; set; }

    }


}

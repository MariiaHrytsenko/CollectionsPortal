using collectionsProject.Models;

public class ModelCharacteristic
{
    public int Idcharacteristic { get; set; }
    public string Id { get; set; }
    public string NameCharacteristic { get; set; }

    public virtual User? IdNavigation { get; set; }

    public virtual ICollection<Characteristic> Characteristics { get; set; } = new List<Characteristic>();
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
}

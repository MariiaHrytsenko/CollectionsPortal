using System.ComponentModel.DataAnnotations.Schema;

namespace collectionsProject.Models;

public partial class Characteristic
{
    public int Iditem { get; set; }

    public int Idchracteristic { get; set; }

    public string? Value { get; set; }

    // Навігаційна властивість до Item
    public virtual Item IditemNavigation { get; set; } = null!;

    // Навігаційна властивість до ModelCharacteristic
    public virtual ModelCharacteristic IdchracteristicNavigation { get; set; } = null!;
}



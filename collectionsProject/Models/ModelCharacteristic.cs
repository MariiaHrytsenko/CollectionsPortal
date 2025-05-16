using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class ModelCharacteristic
{
    public int Idcharacteristic { get; set; }

    public string? NameCharacteristic { get; set; }

    public string? Iduser { get; set; }

    public virtual User? IduserNavigation { get; set; }

    public virtual ICollection<ModelCategory> Idcategories { get; set; } = new List<ModelCategory>();
}

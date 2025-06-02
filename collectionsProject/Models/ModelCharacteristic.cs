using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class ModelCharacteristic
{
    public int Idcharacteristic { get; set; }

    public string? NameCharacteristic { get; set; }

    public string Id { get; set; }

    public virtual User? IdNavigation { get; set; }

    public virtual ICollection<ModelCategory> Idcategories { get; set; } = new List<ModelCategory>();
}
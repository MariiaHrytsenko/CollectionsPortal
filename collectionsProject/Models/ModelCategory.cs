using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class ModelCategory
{
    public int Idcategory { get; set; }

    public string? NameCategory { get; set; }

    public string? Iduser { get; set; }

    public virtual User? IduserNavigation { get; set; }

    public virtual ICollection<ModelCharacteristic> Idcharacteristics { get; set; } = new List<ModelCharacteristic>();
}

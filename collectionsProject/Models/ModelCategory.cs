using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class ModelCategory
{
    public int Idcategory { get; set; }

    public string? NameCategory { get; set; }

    public string Id { get; set; }

    public virtual User? IdNavigation { get; set; }

    public virtual ICollection<ModelCharacteristic> Idcharacteristics { get; set; } = new List<ModelCharacteristic>();
}
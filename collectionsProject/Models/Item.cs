using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Item
{
    public int Iditem { get; set; }

    public string? NameItem { get; set; }

    public byte[]? PhotoItem { get; set; }

    public virtual ICollection<Chracteristic> Chracteristics { get; set; } = new List<Chracteristic>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

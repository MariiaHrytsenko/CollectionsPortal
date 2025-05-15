using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Chracteristic
{
    public int Idchracteristic { get; set; }

    public int? Iditem { get; set; }

    public string? Value { get; set; }

    public virtual Item? IditemNavigation { get; set; }
}

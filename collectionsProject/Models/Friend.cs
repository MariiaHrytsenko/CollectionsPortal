using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Friend
{
    public int Idfriendship { get; set; }

    public string? Idrequester { get; set; }

    public string? Idreceiver { get; set; }

    public virtual User? IdreceiverNavigation { get; set; }

    public virtual User? IdrequesterNavigation { get; set; }
}

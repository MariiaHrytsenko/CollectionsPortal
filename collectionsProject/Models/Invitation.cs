using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Invitation
{
    public int Idinvitation { get; set; }

    public string? Idinviter { get; set; }

    public string? Email { get; set; }

    public string? Token { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? Idrequester { get; set; }

    public virtual User? IdinviterNavigation { get; set; }

    public virtual User? IdrequesterNavigation { get; set; }
}

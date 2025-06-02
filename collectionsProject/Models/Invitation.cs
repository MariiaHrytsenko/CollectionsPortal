using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Invitation
{
    public int IDinvitation { get; set; }

    public string IDinviter { get; set; }
    public User Inviter { get; set; }

    public string IDrequester { get; set; }
    public User Requester { get; set; }

    public string Email { get; set; }
    public string Token { get; set; }
    public DateTime? CreatedDate { get; set; }
}

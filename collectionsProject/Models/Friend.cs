using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Friend
{
    public int IDfriendship { get; set; }

    public string IDrequester { get; set; }
    public User Requester { get; set; }

    public string IDreceiver { get; set; }
    public User Receiver { get; set; }
}

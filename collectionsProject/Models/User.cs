using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class User
{
    public int Iduser { get; set; }

    public string? LogData { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Friend> FriendIdreceiverNavigations { get; set; } = new List<Friend>();

    public virtual ICollection<Friend> FriendIdrequesterNavigations { get; set; } = new List<Friend>();

    public virtual ICollection<Invitation> InvitationIdinviterNavigations { get; set; } = new List<Invitation>();

    public virtual ICollection<Invitation> InvitationIdrequesterNavigations { get; set; } = new List<Invitation>();

    public virtual ICollection<ModelCategory> ModelCategories { get; set; } = new List<ModelCategory>();

    public virtual ICollection<ModelCharacteristic> ModelCharacteristics { get; set; } = new List<ModelCharacteristic>();
}

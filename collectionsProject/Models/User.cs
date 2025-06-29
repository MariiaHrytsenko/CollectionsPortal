// User.cs
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class User : IdentityUser
{
    public byte[]? Avatar { get; set; }

    public ICollection<Item> Items { get; set; } = new HashSet<Item>();
    public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();

    public ICollection<Friend> FriendsRequested { get; set; } = new HashSet<Friend>();
    public ICollection<Friend> FriendsReceived { get; set; } = new HashSet<Friend>();

    public ICollection<Invitation> InvitationsSent { get; set; } = new HashSet<Invitation>();
    public ICollection<Invitation> InvitationsReceived { get; set; } = new HashSet<Invitation>();
}

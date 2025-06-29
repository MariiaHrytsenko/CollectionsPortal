namespace collectionsProject.OldModels
{/*
    public class ModelCategory
    {
        public int IDcategory { get; set; }
        public string? NameCategory { get; set; }
        public int IDuser { get; set; }

        public User? User { get; set; }  // навігаційне властивість
        public ICollection<Category>? Categories { get; set; }
    }

    public class ModelCharacteristic
    {
        public int IDcharacteristic { get; set; }
        public string? NameCharacteristic { get; set; }
        public int IDuser { get; set; }

        public User? User { get; set; }
        public ICollection<Category>? Categories { get; set; }
        public ICollection<Chracteristic>? Chracteristics { get; set; }
    }

    public class Category
    {
        public int IDcategory { get; set; }
        public int IDcharacteristic { get; set; }

        public ModelCategory? ModelCategory { get; set; }
        public ModelCharacteristic? ModelCharacteristic { get; set; }
    }

    public class Chracteristic
    {
        public int IDchracteristic { get; set; }
        public int IDitem { get; set; }
        public string? Value { get; set; }

        public ModelCharacteristic? ModelCharacteristic { get; set; }
        public Item? Item { get; set; }
    }
    /*
    public class Comment
    {
        public int IDcomment { get; set; }
        public int IDitem { get; set; }
        public int IDcommentator { get; set; }
        public string? ContentComment { get; set; }

        public User? Commentator { get; set; }
        public Item? Item { get; set; }
    }

    public class Friend
    {
        public int IDfriendship { get; set; }
        public int IDrequester { get; set; }
        public int IDreceiver { get; set; }

        public User? Requester { get; set; }
        public User? Receiver { get; set; }
    }

    public class Invitation
    {
        public int IDinvitation { get; set; }
        public int IDinviter { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int IDrequester { get; set; }

        public User? Inviter { get; set; }
        public User? Requester { get; set; }
    }
    
    public class Item
    {
        public int IDitem { get; set; }
        public string? NameItem { get; set; }
        public byte[]? PhotoItem { get; set; }

        public ICollection<Chracteristic>? Chracteristics { get; set; }
        public ICollection<Comment>? Comments { get; set; }
    }

    public class User
    {
        public int IDuser { get; set; }
        public string? LogData { get; set; }

        public ICollection<ModelCategory>? ModelCategories { get; set; }
        public ICollection<ModelCharacteristic>? ModelCharacteristics { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<Friend>? FriendsRequesting { get; set; }
        public ICollection<Friend>? FriendsReceiving { get; set; }
        public ICollection<Invitation>? InvitationsInvited { get; set; }
        public ICollection<Invitation>? InvitationsRequested { get; set; }
    }*/
}

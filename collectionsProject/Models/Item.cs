using collectionsProject.Models;
using System.ComponentModel.DataAnnotations;

public partial class Item
{
    public int Iditem { get; set; }
    public string? NameItem { get; set; }
    public byte[]? PhotoItem { get; set; }

    // Властивість для зберігання User.Id (User.Identity.NameIdentifier)
    public string Id { get; set; }

    public int? CategoryId { get; set; }
    public virtual ModelCategory? Category { get; set; }

    //public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
    public virtual ICollection<Characteristic> Characteristics { get; set; } = new List<Characteristic>();

    public virtual User? User { get; set; } // Навігаційна властивість


}

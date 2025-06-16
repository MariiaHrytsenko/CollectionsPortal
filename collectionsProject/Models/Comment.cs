// Comment.cs
using System;

namespace collectionsProject.Models;

public class Comment
{
    public int IDcomment { get; set; }
    public int IDitem { get; set; }
    public string IDcommentator { get; set; } 

    public string Text { get; set; }
    public DateTime? CreatedDate { get; set; }

   // public virtual Item Item { get; set; }
    public virtual User Commentator { get; set; }
}

using System;

namespace collectionsProject.Models
{
    public class Comment
    {
        public int IDcomment { get; set; }
        public int IDitem { get; set; }
        public string IDcommentator { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public string Text { get; set; } = null!;

        public virtual User Commentator { get; set; } = null!;
    }
}


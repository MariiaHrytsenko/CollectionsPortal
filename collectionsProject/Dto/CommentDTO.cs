namespace collectionsProject.Dto
{
    public class CommentDTO
    {
        public int IDcomment { get; set; }
        public int IDitem { get; set; }
        public string IDcommentator { get; set; }
        public string Text { get; set; }
        public DateTime? CreatedDate { get; set; }

        // New properties to show user details
        public string Username { get; set; }
        public string? AvatarBase64 { get; set; }  // optional
    }


    public class CommentAdd
    {
        public int IDitem { get; set; }
        public string Text { get; set; }
        public string IDcommentator { get; set; }
    }
}

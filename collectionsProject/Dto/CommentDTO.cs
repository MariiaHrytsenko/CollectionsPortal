namespace collectionsProject.Dto
{
    public class CommentDTO
    {
        public int IDcomment { get; set; }
        public int IDitem { get; set; }
        public string IDcommentator { get; set; }

        public string Text { get; set; }
        public DateTime? CreatedDate { get; set; }
    }

    public class CommentAdd
    {
        public int IDitem { get; set; }
        public string Text { get; set; }
    }
    /*
    public class CommentName :CommentDTO
    {
        public string CommentatorName { get; set; }
    }

    public class Comment*/
}

using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public partial class Comment
{
    public int Idcomment { get; set; }

    public int? Iditem { get; set; }

    public string? Idcommentator { get; set; }

    public string? ContentComment { get; set; }

    public virtual User? IdcommentatorNavigation { get; set; }

    public virtual Item? IditemNavigation { get; set; }
}

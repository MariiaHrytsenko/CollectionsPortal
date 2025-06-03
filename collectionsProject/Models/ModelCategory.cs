using System;
using System.Collections.Generic;

namespace collectionsProject.Models;

public class ModelCategory
{
    public int Idcategory { get; set; }
    public int Id { get; set; }
    public string NameCategory { get; set; }
    public virtual User? IdNavigation { get; set; }

    // Замість ICollection<ModelCharacteristic>
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();


}

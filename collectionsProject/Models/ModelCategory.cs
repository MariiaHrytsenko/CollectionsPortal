using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace collectionsProject.Models;

public class ModelCategory
{
    [Key]
    public int Idcategory { get; set; }
    public string Id { get; set; }
    public string NameCategory { get; set; }
    public virtual User? IdNavigation { get; set; }

    // Замість ICollection<ModelCharacteristic>
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();


}

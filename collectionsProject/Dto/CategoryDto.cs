using collections;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace collections.Application
{
    public class CategoryDto
    {
        public int IDcategory { get; set; }
        public string nameCategory { get; set; }
        public string userID { get; set; }
        public List<CharacteristicMenuDto> characteristics { get; set; }
    }

    public class CreateCategoryDto
    {
        public string NameCategory { get; set; }
    }

    public class RenameCategoryDto
    {
        public int Idcategory { get; set; }
        public string NewName { get; set; }
    }

    public class DeleteCategoryDto
    {
        public int Idcategory { get; set; }
    }

}
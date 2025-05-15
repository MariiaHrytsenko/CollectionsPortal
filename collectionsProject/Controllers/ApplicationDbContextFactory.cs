using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace collectionsProject.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Заміни шлях на свій фактичний, якщо треба
            optionsBuilder.UseSqlite("Data Source=C:\\Users\\Mariia\\Downloads\\Telegram Desktop\\database.sqlite3");


            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}

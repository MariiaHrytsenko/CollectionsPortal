using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using collectionsProject.Models;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<DbFromExistingContext>
{
    public DbFromExistingContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<DbFromExistingContext>();
        optionsBuilder.UseSqlite("Data Source=C:\\Users\\Mariia\\source\\repos\\collectionsProject\\collectionsProject\\database.sqlite3");
        return new DbFromExistingContext(optionsBuilder.Options);
    }
}

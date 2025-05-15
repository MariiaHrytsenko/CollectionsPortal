using collectionsProject.Models;
using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        }

}

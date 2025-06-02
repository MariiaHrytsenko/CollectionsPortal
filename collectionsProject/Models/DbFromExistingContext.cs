using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Models;

public partial class DbFromExistingContext : DbContext
{
    public DbFromExistingContext(DbContextOptions<DbFromExistingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; } = null!;
    public virtual DbSet<Item> Items { get; set; } = null!;
    public virtual DbSet<Characteristic> Chracteristics { get; set; } = null!;
    public virtual DbSet<ModelCategory> ModelCategories { get; set; } = null!;
    public virtual DbSet<ModelCharacteristic> ModelCharacteristics { get; set; } = null!;
    public virtual DbSet<Friend> Friends { get; set; } = null!;
    public virtual DbSet<Invitation> Invitations { get; set; } = null!;
    public virtual DbSet<Comment> Comments { get; set; } = null!;
    public virtual DbSet<EfmigrationsLock> EfmigrationsLocks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User (якщо потрібно — додай налаштування для IdentityUser)

        // Item
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Iditem);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Items)
                  .HasForeignKey(e => e.Id)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Category)
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Characteristic
        modelBuilder.Entity<Characteristic>(entity =>
        {
            entity.HasKey(e => e.Idchracteristic);

            entity.HasOne(e => e.IditemNavigation)
                  .WithMany(i => i.Chracteristics)
                  .HasForeignKey(e => e.Iditem)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ModelCategory
        modelBuilder.Entity<ModelCategory>(entity =>
        {
            entity.HasKey(e => e.Idcategory);

            entity.HasOne(e => e.IdNavigation)
                  .WithMany()
                  .HasForeignKey(e => e.Id)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ModelCharacteristic
        modelBuilder.Entity<ModelCharacteristic>(entity =>
        {
            entity.HasKey(e => e.Idcharacteristic);

            entity.HasOne(e => e.IdNavigation)
                  .WithMany()
                  .HasForeignKey(e => e.Id)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Many-to-Many: category (ModelCategory <-> ModelCharacteristic)
        modelBuilder.Entity<ModelCategory>()
            .HasMany(mc => mc.Idcharacteristics)
            .WithMany(mc => mc.Idcategories)
            .UsingEntity<Dictionary<string, object>>(
                "category",
                r => r.HasOne<ModelCharacteristic>()
                      .WithMany()
                      .HasForeignKey("Idcharacteristic"),
                l => l.HasOne<ModelCategory>()
                      .WithMany()
                      .HasForeignKey("Idcategory"),
                j =>
                {
                    j.HasKey("Idcategory", "Idcharacteristic");
                    j.ToTable("category");
                });

        // Friend
        modelBuilder.Entity<Friend>(entity =>
        {
            entity.HasKey(e => e.IDfriendship);

            entity.HasOne(f => f.Requester)
                  .WithMany(u => u.FriendsRequested)
                  .HasForeignKey(f => f.IDrequester)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(f => f.Receiver)
                  .WithMany(u => u.FriendsReceived)
                  .HasForeignKey(f => f.IDreceiver)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Invitation
        modelBuilder.Entity<Invitation>(entity =>
        {
            entity.HasKey(e => e.IDinvitation);

            entity.HasOne(inv => inv.Inviter)
                  .WithMany(u => u.InvitationsSent)
                  .HasForeignKey(inv => inv.IDinviter)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(inv => inv.Requester)
                  .WithMany(u => u.InvitationsReceived)
                  .HasForeignKey(inv => inv.IDrequester)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Comment
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.IDcomment);

            entity.HasOne(c => c.Item)
                  .WithMany(i => i.Comments)
                  .HasForeignKey(c => c.IDitem)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Commentator)
                  .WithMany(u => u.Comments)
                  .HasForeignKey(c => c.IDcommentator)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // EfmigrationsLock
        modelBuilder.Entity<EfmigrationsLock>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

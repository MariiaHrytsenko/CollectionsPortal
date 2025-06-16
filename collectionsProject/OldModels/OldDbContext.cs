/*using Microsoft.EntityFrameworkCore;
using collectionsProject.OldModels;

namespace collectionsProject.OldModels
{
    public class OldDbContext : DbContext
    {
        public OldDbContext(DbContextOptions<OldDbContext> options)
            : base(options)
        {
        }

        public DbSet<ModelCategory> ModelCategories { get; set; } = null!;
        public DbSet<ModelCharacteristic> ModelCharacteristics { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Chracteristic> Chracteristics { get; set; } = null!;
        public DbSet<Comment> Comments { get; set; } = null!;
        public DbSet<Friend> Friends { get; set; } = null!;
        public DbSet<Invitation> Invitations { get; set; } = null!;
        public DbSet<Item> Items { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Таблиця Model_category
            modelBuilder.Entity<ModelCategory>(entity =>
            {
                entity.ToTable("Model_category");

                entity.HasKey(e => e.IDcategory);

                entity.Property(e => e.NameCategory).HasColumnName("nameCategory").HasMaxLength(45);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.ModelCategories)
                      .HasForeignKey(e => e.IDuser);
            });

            // Таблиця Model_characteristics
            modelBuilder.Entity<ModelCharacteristic>(entity =>
            {
                entity.ToTable("Model_characteristics");

                entity.HasKey(e => e.IDcharacteristic);

                entity.Property(e => e.NameCharacteristic).HasColumnName("nameCharacteristic").HasMaxLength(45);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.ModelCharacteristics)
                      .HasForeignKey(e => e.IDuser);
            });

            // Таблиця category (зв’язок Model_category <-> Model_characteristics)
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("category");

                entity.HasKey(e => new { e.IDcategory, e.IDcharacteristic });

                entity.HasOne(e => e.ModelCategory)
                      .WithMany(m => m.Categories)
                      .HasForeignKey(e => e.IDcategory);

                entity.HasOne(e => e.ModelCharacteristic)
                      .WithMany(m => m.Categories)
                      .HasForeignKey(e => e.IDcharacteristic);
            });

            // Таблиця chracteristic (помилка у назві таблиці, збережемо як є)
            modelBuilder.Entity<Chracteristic>(entity =>
            {
                entity.ToTable("chracteristic");

                entity.HasKey(e => e.IDchracteristic);

                entity.Property(e => e.Value).HasColumnName("value").HasMaxLength(45);

                entity.HasOne(e => e.ModelCharacteristic)
                      .WithMany(m => m.Chracteristics)
                      .HasForeignKey(e => e.IDchracteristic)
                      .HasPrincipalKey(m => m.IDcharacteristic);

                entity.HasOne(e => e.Item)
                      .WithMany(i => i.Chracteristics)
                      .HasForeignKey(e => e.IDitem);
            });

            // Таблиця comments
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("comments");

                entity.HasKey(e => e.IDcomment);

                entity.Property(e => e.ContentComment).HasColumnName("contentComment").HasMaxLength(45);

                entity.HasOne(e => e.Commentator)
                      .WithMany(u => u.Comments)
                      .HasForeignKey(e => e.IDcommentator);

                entity.HasOne(e => e.Item)
                      .WithMany(i => i.Comments)
                      .HasForeignKey(e => e.IDitem);
            });

            // Таблиця friends
            modelBuilder.Entity<Friend>(entity =>
            {
                entity.ToTable("friends");

                entity.HasKey(e => e.IDfriendship);

                entity.HasOne(e => e.Requester)
                      .WithMany(u => u.FriendsRequesting)
                      .HasForeignKey(e => e.IDrequester);

                entity.HasOne(e => e.Receiver)
                      .WithMany(u => u.FriendsReceiving)
                      .HasForeignKey(e => e.IDreceiver);
            });

            // Таблиця invitation
            modelBuilder.Entity<Invitation>(entity =>
            {
                entity.ToTable("invitation");

                entity.HasKey(e => e.IDinvitation);

                entity.Property(e => e.Email).HasMaxLength(45);
                entity.Property(e => e.Token).HasMaxLength(45);

                entity.HasOne(e => e.Inviter)
                      .WithMany(u => u.InvitationsInvited)
                      .HasForeignKey(e => e.IDinviter);

                entity.HasOne(e => e.Requester)
                      .WithMany(u => u.InvitationsRequested)
                      .HasForeignKey(e => e.IDrequester);
            });

            // Таблиця item
            modelBuilder.Entity<Item>(entity =>
            {
                entity.ToTable("item");

                entity.HasKey(e => e.IDitem);

                entity.Property(e => e.NameItem).HasMaxLength(45);
            });

            // Таблиця user
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.HasKey(e => e.IDuser);

                entity.Property(e => e.LogData).HasMaxLength(45);
            });
        }
    }
}
*/
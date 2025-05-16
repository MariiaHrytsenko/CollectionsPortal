using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace collectionsProject.Models;

public partial class DbFromExistingContext : DbContext
{
    public DbFromExistingContext()
    {
    }

    public DbFromExistingContext(DbContextOptions<DbFromExistingContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Chracteristic> Chracteristics { get; set; }

    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<EfmigrationsLock> EfmigrationsLocks { get; set; }

    public virtual DbSet<Friend> Friends { get; set; }

    public virtual DbSet<Invitation> Invitations { get; set; }

    public virtual DbSet<Item> Items { get; set; }

    public virtual DbSet<ModelCategory> ModelCategories { get; set; }

    public virtual DbSet<ModelCharacteristic> ModelCharacteristics { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=C:\\Users\\Mariia\\Downloads\\Telegram Desktop\\database.sqlite3");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chracteristic>(entity =>
        {
            entity.HasKey(e => e.Idchracteristic);

            entity.ToTable("chracteristic");

            entity.Property(e => e.Idchracteristic)
                .ValueGeneratedNever()
                .HasColumnName("IDchracteristic");
            entity.Property(e => e.Iditem).HasColumnName("IDitem");
            entity.Property(e => e.Value)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("value");

            entity.HasOne(d => d.IditemNavigation).WithMany(p => p.Chracteristics).HasForeignKey(d => d.Iditem);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Idcomment);

            entity.ToTable("comments");

            entity.Property(e => e.Idcomment)
                .ValueGeneratedNever()
                .HasColumnName("IDcomment");
            entity.Property(e => e.ContentComment)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("contentComment");
            entity.Property(e => e.Idcommentator).HasColumnName("IDcommentator");
            entity.Property(e => e.Iditem).HasColumnName("IDitem");

            entity.HasOne(d => d.IdcommentatorNavigation).WithMany(p => p.Comments).HasForeignKey(d => d.Idcommentator);

            entity.HasOne(d => d.IditemNavigation).WithMany(p => p.Comments).HasForeignKey(d => d.Iditem);
        });

        modelBuilder.Entity<EfmigrationsLock>(entity =>
        {
            entity.ToTable("__EFMigrationsLock");

            entity.Property(e => e.Id).ValueGeneratedNever();
        });

        modelBuilder.Entity<Friend>(entity =>
        {
            entity.HasKey(e => e.Idfriendship);

            entity.ToTable("friends");

            entity.Property(e => e.Idfriendship)
                .ValueGeneratedNever()
                .HasColumnName("IDfriendship");
            entity.Property(e => e.Idreceiver).HasColumnName("IDreceiver");
            entity.Property(e => e.Idrequester).HasColumnName("IDrequester");

            entity.HasOne(d => d.IdreceiverNavigation).WithMany(p => p.FriendIdreceiverNavigations).HasForeignKey(d => d.Idreceiver);

            entity.HasOne(d => d.IdrequesterNavigation).WithMany(p => p.FriendIdrequesterNavigations).HasForeignKey(d => d.Idrequester);
        });

        modelBuilder.Entity<Invitation>(entity =>
        {
            entity.HasKey(e => e.Idinvitation);

            entity.ToTable("invitation");

            entity.Property(e => e.Idinvitation)
                .ValueGeneratedNever()
                .HasColumnName("IDinvitation");
            entity.Property(e => e.CreatedDate)
                .HasColumnType("DATETIME")
                .HasColumnName("createdDate");
            entity.Property(e => e.Email)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("email");
            entity.Property(e => e.Idinviter).HasColumnName("IDinviter");
            entity.Property(e => e.Idrequester).HasColumnName("IDrequester");
            entity.Property(e => e.Token)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("token");

            entity.HasOne(d => d.IdinviterNavigation).WithMany(p => p.InvitationIdinviterNavigations).HasForeignKey(d => d.Idinviter);

            entity.HasOne(d => d.IdrequesterNavigation).WithMany(p => p.InvitationIdrequesterNavigations).HasForeignKey(d => d.Idrequester);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Iditem);

            entity.ToTable("item");

            entity.Property(e => e.Iditem)
                .ValueGeneratedNever()
                .HasColumnName("IDitem");
            entity.Property(e => e.NameItem)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("nameItem");
            entity.Property(e => e.PhotoItem).HasColumnName("photoItem");
        });

        modelBuilder.Entity<ModelCategory>(entity =>
        {
            entity.HasKey(e => e.Idcategory);

            entity.ToTable("Model_category");

            entity.Property(e => e.Idcategory)
                .ValueGeneratedNever()
                .HasColumnName("IDcategory");
            entity.Property(e => e.Iduser).HasColumnName("IDuser");
            entity.Property(e => e.NameCategory)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("nameCategory");

            entity.HasOne(d => d.IduserNavigation).WithMany(p => p.ModelCategories).HasForeignKey(d => d.Iduser);

            entity.HasMany(d => d.Idcharacteristics).WithMany(p => p.Idcategories)
                .UsingEntity<Dictionary<string, object>>(
                    "Category",
                    r => r.HasOne<ModelCharacteristic>().WithMany()
                        .HasForeignKey("Idcharacteristic")
                        .OnDelete(DeleteBehavior.ClientSetNull),
                    l => l.HasOne<ModelCategory>().WithMany()
                        .HasForeignKey("Idcategory")
                        .OnDelete(DeleteBehavior.ClientSetNull),
                    j =>
                    {
                        j.HasKey("Idcategory", "Idcharacteristic");
                        j.ToTable("category");
                        j.IndexerProperty<int>("Idcategory").HasColumnName("IDcategory");
                        j.IndexerProperty<int>("Idcharacteristic").HasColumnName("IDcharacteristic");
                    });
        });

        modelBuilder.Entity<ModelCharacteristic>(entity =>
        {
            entity.HasKey(e => e.Idcharacteristic);

            entity.ToTable("Model_characteristics");

            entity.Property(e => e.Idcharacteristic)
                .ValueGeneratedNever()
                .HasColumnName("IDcharacteristic");
            entity.Property(e => e.Iduser).HasColumnName("IDuser");
            entity.Property(e => e.NameCharacteristic)
                .HasColumnType("VARCHAR(45)")
                .HasColumnName("nameCharacteristic");

            entity.HasOne(d => d.IduserNavigation).WithMany(p => p.ModelCharacteristics).HasForeignKey(d => d.Iduser);
        });

        modelBuilder.Entity<User>(entity =>
        {
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

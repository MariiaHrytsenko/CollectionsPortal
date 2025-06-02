using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace collectionsProject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EfmigrationsLocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Timestamp = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EfmigrationsLocks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    UserName = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    NormalizedUserName = table.Column<string>(type: "TEXT", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Friends",
                columns: table => new
                {
                    IDfriendship = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IDrequester = table.Column<string>(type: "TEXT", nullable: false),
                    IDreceiver = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friends", x => x.IDfriendship);
                    table.ForeignKey(
                        name: "FK_Friends_Users_IDreceiver",
                        column: x => x.IDreceiver,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friends_Users_IDrequester",
                        column: x => x.IDrequester,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Invitations",
                columns: table => new
                {
                    IDinvitation = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IDinviter = table.Column<string>(type: "TEXT", nullable: false),
                    IDrequester = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Token = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitations", x => x.IDinvitation);
                    table.ForeignKey(
                        name: "FK_Invitations_Users_IDinviter",
                        column: x => x.IDinviter,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Invitations_Users_IDrequester",
                        column: x => x.IDrequester,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModelCategories",
                columns: table => new
                {
                    Idcategory = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NameCategory = table.Column<string>(type: "TEXT", nullable: true),
                    Id = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModelCategories", x => x.Idcategory);
                    table.ForeignKey(
                        name: "FK_ModelCategories_Users_Id",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ModelCharacteristics",
                columns: table => new
                {
                    Idcharacteristic = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NameCharacteristic = table.Column<string>(type: "TEXT", nullable: true),
                    Id = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ModelCharacteristics", x => x.Idcharacteristic);
                    table.ForeignKey(
                        name: "FK_ModelCharacteristics_Users_Id",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Iditem = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NameItem = table.Column<string>(type: "TEXT", nullable: true),
                    PhotoItem = table.Column<byte[]>(type: "BLOB", nullable: true),
                    Id = table.Column<string>(type: "TEXT", nullable: true),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Iditem);
                    table.ForeignKey(
                        name: "FK_Items_ModelCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "ModelCategories",
                        principalColumn: "Idcategory",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Items_Users_Id",
                        column: x => x.Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    Idcategory = table.Column<int>(type: "INTEGER", nullable: false),
                    Idcharacteristic = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category", x => new { x.Idcategory, x.Idcharacteristic });
                    table.ForeignKey(
                        name: "FK_category_ModelCategories_Idcategory",
                        column: x => x.Idcategory,
                        principalTable: "ModelCategories",
                        principalColumn: "Idcategory",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_category_ModelCharacteristics_Idcharacteristic",
                        column: x => x.Idcharacteristic,
                        principalTable: "ModelCharacteristics",
                        principalColumn: "Idcharacteristic",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Chracteristics",
                columns: table => new
                {
                    Idchracteristic = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Iditem = table.Column<int>(type: "INTEGER", nullable: true),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chracteristics", x => x.Idchracteristic);
                    table.ForeignKey(
                        name: "FK_Chracteristics_Items_Iditem",
                        column: x => x.Iditem,
                        principalTable: "Items",
                        principalColumn: "Iditem",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    IDcomment = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IDitem = table.Column<int>(type: "INTEGER", nullable: false),
                    IDcommentator = table.Column<string>(type: "TEXT", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.IDcomment);
                    table.ForeignKey(
                        name: "FK_Comments_Items_IDitem",
                        column: x => x.IDitem,
                        principalTable: "Items",
                        principalColumn: "Iditem",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Users_IDcommentator",
                        column: x => x.IDcommentator,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_category_Idcharacteristic",
                table: "category",
                column: "Idcharacteristic");

            migrationBuilder.CreateIndex(
                name: "IX_Chracteristics_Iditem",
                table: "Chracteristics",
                column: "Iditem");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_IDcommentator",
                table: "Comments",
                column: "IDcommentator");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_IDitem",
                table: "Comments",
                column: "IDitem");

            migrationBuilder.CreateIndex(
                name: "IX_Friends_IDreceiver",
                table: "Friends",
                column: "IDreceiver");

            migrationBuilder.CreateIndex(
                name: "IX_Friends_IDrequester",
                table: "Friends",
                column: "IDrequester");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_IDinviter",
                table: "Invitations",
                column: "IDinviter");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_IDrequester",
                table: "Invitations",
                column: "IDrequester");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CategoryId",
                table: "Items",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_Id",
                table: "Items",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ModelCategories_Id",
                table: "ModelCategories",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ModelCharacteristics_Id",
                table: "ModelCharacteristics",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "category");

            migrationBuilder.DropTable(
                name: "Chracteristics");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "EfmigrationsLocks");

            migrationBuilder.DropTable(
                name: "Friends");

            migrationBuilder.DropTable(
                name: "Invitations");

            migrationBuilder.DropTable(
                name: "ModelCharacteristics");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "ModelCategories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace collectionsProject.Migrations
{
    /// <inheritdoc />
    public partial class AddIdentityTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Users",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "AccessFailedCount",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EmailConfirmed",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "LockoutEnabled",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "LockoutEnd",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedEmail",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedUserName",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PhoneNumberConfirmed",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecurityStamp",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TwoFactorEnabled",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "__EFMigrationsLock",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Timestamp = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK___EFMigrationsLock", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "friends",
                columns: table => new
                {
                    IDfriendship = table.Column<int>(type: "INTEGER", nullable: false),
                    IDrequester = table.Column<string>(type: "TEXT", nullable: true),
                    IDreceiver = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_friends", x => x.IDfriendship);
                    table.ForeignKey(
                        name: "FK_friends_Users_IDreceiver",
                        column: x => x.IDreceiver,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_friends_Users_IDrequester",
                        column: x => x.IDrequester,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "invitation",
                columns: table => new
                {
                    IDinvitation = table.Column<int>(type: "INTEGER", nullable: false),
                    IDinviter = table.Column<string>(type: "TEXT", nullable: true),
                    email = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    token = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "DATETIME", nullable: true),
                    IDrequester = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invitation", x => x.IDinvitation);
                    table.ForeignKey(
                        name: "FK_invitation_Users_IDinviter",
                        column: x => x.IDinviter,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_invitation_Users_IDrequester",
                        column: x => x.IDrequester,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "item",
                columns: table => new
                {
                    IDitem = table.Column<int>(type: "INTEGER", nullable: false),
                    nameItem = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    photoItem = table.Column<byte[]>(type: "BLOB", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_item", x => x.IDitem);
                });

            migrationBuilder.CreateTable(
                name: "Model_category",
                columns: table => new
                {
                    IDcategory = table.Column<int>(type: "INTEGER", nullable: false),
                    nameCategory = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    IDuser = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Model_category", x => x.IDcategory);
                    table.ForeignKey(
                        name: "FK_Model_category_Users_IDuser",
                        column: x => x.IDuser,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Model_characteristics",
                columns: table => new
                {
                    IDcharacteristic = table.Column<int>(type: "INTEGER", nullable: false),
                    nameCharacteristic = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    IDuser = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Model_characteristics", x => x.IDcharacteristic);
                    table.ForeignKey(
                        name: "FK_Model_characteristics_Users_IDuser",
                        column: x => x.IDuser,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "chracteristic",
                columns: table => new
                {
                    IDchracteristic = table.Column<int>(type: "INTEGER", nullable: false),
                    IDitem = table.Column<int>(type: "INTEGER", nullable: true),
                    value = table.Column<string>(type: "VARCHAR(45)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chracteristic", x => x.IDchracteristic);
                    table.ForeignKey(
                        name: "FK_chracteristic_item_IDitem",
                        column: x => x.IDitem,
                        principalTable: "item",
                        principalColumn: "IDitem");
                });

            migrationBuilder.CreateTable(
                name: "comments",
                columns: table => new
                {
                    IDcomment = table.Column<int>(type: "INTEGER", nullable: false),
                    IDitem = table.Column<int>(type: "INTEGER", nullable: true),
                    IDcommentator = table.Column<string>(type: "TEXT", nullable: true),
                    contentComment = table.Column<string>(type: "VARCHAR(45)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_comments", x => x.IDcomment);
                    table.ForeignKey(
                        name: "FK_comments_Users_IDcommentator",
                        column: x => x.IDcommentator,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_comments_item_IDitem",
                        column: x => x.IDitem,
                        principalTable: "item",
                        principalColumn: "IDitem");
                });

            migrationBuilder.CreateTable(
                name: "category",
                columns: table => new
                {
                    IDcategory = table.Column<int>(type: "INTEGER", nullable: false),
                    IDcharacteristic = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_category", x => new { x.IDcategory, x.IDcharacteristic });
                    table.ForeignKey(
                        name: "FK_category_Model_category_IDcategory",
                        column: x => x.IDcategory,
                        principalTable: "Model_category",
                        principalColumn: "IDcategory");
                    table.ForeignKey(
                        name: "FK_category_Model_characteristics_IDcharacteristic",
                        column: x => x.IDcharacteristic,
                        principalTable: "Model_characteristics",
                        principalColumn: "IDcharacteristic");
                });

            migrationBuilder.CreateIndex(
                name: "IX_category_IDcharacteristic",
                table: "category",
                column: "IDcharacteristic");

            migrationBuilder.CreateIndex(
                name: "IX_chracteristic_IDitem",
                table: "chracteristic",
                column: "IDitem");

            migrationBuilder.CreateIndex(
                name: "IX_comments_IDcommentator",
                table: "comments",
                column: "IDcommentator");

            migrationBuilder.CreateIndex(
                name: "IX_comments_IDitem",
                table: "comments",
                column: "IDitem");

            migrationBuilder.CreateIndex(
                name: "IX_friends_IDreceiver",
                table: "friends",
                column: "IDreceiver");

            migrationBuilder.CreateIndex(
                name: "IX_friends_IDrequester",
                table: "friends",
                column: "IDrequester");

            migrationBuilder.CreateIndex(
                name: "IX_invitation_IDinviter",
                table: "invitation",
                column: "IDinviter");

            migrationBuilder.CreateIndex(
                name: "IX_invitation_IDrequester",
                table: "invitation",
                column: "IDrequester");

            migrationBuilder.CreateIndex(
                name: "IX_Model_category_IDuser",
                table: "Model_category",
                column: "IDuser");

            migrationBuilder.CreateIndex(
                name: "IX_Model_characteristics_IDuser",
                table: "Model_characteristics",
                column: "IDuser");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "__EFMigrationsLock");

            migrationBuilder.DropTable(
                name: "category");

            migrationBuilder.DropTable(
                name: "chracteristic");

            migrationBuilder.DropTable(
                name: "comments");

            migrationBuilder.DropTable(
                name: "friends");

            migrationBuilder.DropTable(
                name: "invitation");

            migrationBuilder.DropTable(
                name: "Model_category");

            migrationBuilder.DropTable(
                name: "Model_characteristics");

            migrationBuilder.DropTable(
                name: "item");

            migrationBuilder.DropColumn(
                name: "AccessFailedCount",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EmailConfirmed",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LockoutEnabled",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LockoutEnd",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NormalizedEmail",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NormalizedUserName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PhoneNumberConfirmed",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SecurityStamp",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TwoFactorEnabled",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT")
                .Annotation("Sqlite:Autoincrement", true);
        }
    }
}

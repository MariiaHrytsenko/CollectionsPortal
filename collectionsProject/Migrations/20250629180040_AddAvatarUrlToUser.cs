using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace collectionsProject.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatarUrlToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Items_IDitem",
                table: "Comments");

            migrationBuilder.DropIndex(
                name: "IX_Comments_IDitem",
                table: "Comments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chracteristics",
                table: "Chracteristics");

            migrationBuilder.DropIndex(
                name: "IX_Chracteristics_Iditem",
                table: "Chracteristics");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
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

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NameCharacteristic",
                table: "ModelCharacteristics",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NameCategory",
                table: "ModelCategories",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Iditem",
                table: "Chracteristics",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Idchracteristic",
                table: "Chracteristics",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chracteristics",
                table: "Chracteristics",
                columns: new[] { "Iditem", "Idchracteristic" });

            migrationBuilder.CreateIndex(
                name: "IX_Chracteristics_Idchracteristic",
                table: "Chracteristics",
                column: "Idchracteristic");

            migrationBuilder.AddForeignKey(
                name: "FK_Chracteristics_ModelCharacteristics_Idchracteristic",
                table: "Chracteristics",
                column: "Idchracteristic",
                principalTable: "ModelCharacteristics",
                principalColumn: "Idcharacteristic",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chracteristics_ModelCharacteristics_Idchracteristic",
                table: "Chracteristics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chracteristics",
                table: "Chracteristics");

            migrationBuilder.DropIndex(
                name: "IX_Chracteristics_Idchracteristic",
                table: "Chracteristics");

            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
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

            migrationBuilder.AlterColumn<string>(
                name: "NameCharacteristic",
                table: "ModelCharacteristics",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<string>(
                name: "NameCategory",
                table: "ModelCategories",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "Idchracteristic",
                table: "Chracteristics",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "Iditem",
                table: "Chracteristics",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chracteristics",
                table: "Chracteristics",
                column: "Idchracteristic");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_IDitem",
                table: "Comments",
                column: "IDitem");

            migrationBuilder.CreateIndex(
                name: "IX_Chracteristics_Iditem",
                table: "Chracteristics",
                column: "Iditem");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Items_IDitem",
                table: "Comments",
                column: "IDitem",
                principalTable: "Items",
                principalColumn: "Iditem",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

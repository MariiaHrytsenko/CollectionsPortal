using collectionsProject.Migrations;
using collectionsProject.Models;
using collectionsProject.OldModels;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Підключення до нової БД
builder.Services.AddDbContext<DbFromExistingContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Підключення до старої БД (OldDbContext має бути від DbContext!)
builder.Services.AddDbContext<OldDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("OldDefaultConnection")));


builder.Services.AddControllersWithViews();

var app = builder.Build();

// Мідлвари
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies["jwtToken"];
    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Append("Authorization", "Bearer " + token);
    }
    await next();
});

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var oldDb = scope.ServiceProvider.GetRequiredService<OldDbContext>();
    var newDb = scope.ServiceProvider.GetRequiredService<DbFromExistingContext>();

    oldDb.Database.Migrate();
    newDb.Database.Migrate();

    var migrator = new DataMigration(oldDb, newDb);
    migrator.RunAllMigrations();
}

app.Run();

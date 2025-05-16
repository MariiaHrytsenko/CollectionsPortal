using collectionsProject.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Підключення до БД
builder.Services.AddDbContext<DbFromExistingContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Підключення Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DbFromExistingContext>()
    .AddDefaultTokenProviders();

// Додати JWT, авторизацію і т.д. (це пізніше)

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
    Console.WriteLine(token);
    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Append("Authorization", "Bearer " + token);
        Console.WriteLine(context.Request.Headers["Authorization"]);
    }
    await next();
});

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();

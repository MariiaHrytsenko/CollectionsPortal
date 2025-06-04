using collectionsProject.Migrations;
using collectionsProject.Models;
//using collectionsProject.OldModels;
using collectionsProject.Services;
using collectionsProject.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

// ������ Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();
builder.Services.AddScoped<JwtService>();

// Підключення до нової БД
builder.Services.AddDbContext<DbFromExistingContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Підключення до старої БД (OldDbContext має бути від DbContext!)

//builder.services.adddbcontext<olddbcontext>(options =>
//    options.usesqlite(builder.configuration.getconnectionstring("olddefaultconnection")));



builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<DbFromExistingContext>()
    .AddDefaultTokenProviders();

//пошта
builder.Services.AddControllersWithViews();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<InvitationService>();

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
        Console.WriteLine("Authorization header set: " + context.Request.Headers["Authorization"]);
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


app.MapControllers();
/*
using (var scope = app.Services.CreateScope())
{
var oldDb = scope.ServiceProvider.GetRequiredService<OldDbContext>();
var newDb = scope.ServiceProvider.GetRequiredService<DbFromExistingContext>();

oldDb.Database.Migrate();
newDb.Database.Migrate();

var migrator = new DataMigration(oldDb, newDb);
migrator.RunAllMigrations();
}
*/
app.Run();

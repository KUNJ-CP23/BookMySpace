using Microsoft.EntityFrameworkCore;
using BookMySpace.Data;
using BookMySpace.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Identity;
using BookMySpace.Validators;
using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

//to avoid j son serialization loop between user and role
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// // ✅ MVC Views (for consuming API)
// builder.Services.AddControllersWithViews();


//Consuming api in react
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        b =>
        {
            b.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

//Register DBContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

// File service registration
builder.Services.AddScoped<IFileService, FileService>();

// Limit file upload size (e.g., 15MB) to prevent abuse
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MiB
});

// ✅ HttpClient + ApiClient
builder.Services.AddHttpClient();
builder.Services.AddScoped<ApiClient>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable static files for serving uploads
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowReact");
app.MapControllers();

// // ✅ MVC UI routes
// app.MapControllerRoute(
//     name: "default",
//     pattern: "{controller=Home}/{action=Index}/{id?}");


app.Run();
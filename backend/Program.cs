using backend.HostedServices;
using Redis.OM;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
    {
        options.AddPolicy("CORS", policy =>
        {
            policy.AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithOrigins("http://localhost:5500", // TODO: Srediti CORS.
                            "https://localhost:5500",
                            "http://127.0.0.1:5500",
                            "https://127.0.0.1:5500",
                            "http://localhost:3000",
                            "https://localhost:3000",
                            "http://192.168.56.1:3000",
                            "http://127.0.0.1:3000",
                            "https://127.0.0.1:3000")
                  .AllowCredentials();
        });
    });

builder.Services.AddHostedService<IndexCreationService>();
builder.Services.AddSingleton(new RedisConnectionProvider(builder.Configuration["REDIS_CONNECTION_STRING"]));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors("CORS");

app.UseHttpsRedirection();
app.MapControllers();

app.Run();


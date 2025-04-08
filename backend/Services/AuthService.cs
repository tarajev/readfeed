using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Model;
using Microsoft.IdentityModel.JsonWebTokens;
using StackExchange.Redis;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Redis.OM;
using Redis.OM.Searching;

namespace backend.Services;

public class AuthService
{
    private readonly RedisCollection<Author> _authors;
    private readonly RedisCollection<User> _users;
    private readonly RedisConnectionProvider _provider;

    public AuthService(RedisConnectionProvider provider)
    {
        _provider = provider;
        _authors = (RedisCollection<Author>)provider.RedisCollection<Author>();
        _users = (RedisCollection<User>)provider.RedisCollection<User>();
    }
    public string GenerateJwtToken(IConfiguration _configuration, string role, string email)
    {
        string key = _configuration["Jwt:Secret"];
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
        [
            new Claim(ClaimTypes.Role, role),
            new Claim(ClaimTypes.Email, email)
        ]),
            Expires = DateTime.UtcNow.AddMinutes(120),
            SigningCredentials = credentials,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Issuer"],
        };

        var handler = new JsonWebTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);

        return token;
    }

    public async Task<UserBase> GetUserByEmail(string email, string role)
    {
        if (role == "User")
        {
            var user = await _users.Where(user => user.Email == email).ToListAsync();
            return user.FirstOrDefault();
        }
        else
        {
            var author = await _authors.Where(author => author.Email == email).ToListAsync();
            return author.FirstOrDefault();
        }
    }
    public async Task<bool> CheckEmail(string role, string email)
    {
        Console.WriteLine("role: " + role);
        if (role == "User")
        {
            var user = await _users.Where(user => user.Email == email).ToListAsync();
            if (user.FirstOrDefault() != null)
                return true;
        }
        else
        {
            var author = await _authors.Where(author => author.Email == email).ToListAsync();
            if (author.FirstOrDefault() != null)
                return true;
        }

        return false;
    }

}
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using backend.Model;
using Microsoft.IdentityModel.JsonWebTokens;
using Redis.OM;
using Redis.OM.Searching;

namespace backend.Services;

public class AuthService(RedisConnectionProvider provider)
{
    private readonly RedisCollection<Author> _authors = (RedisCollection<Author>)provider.RedisCollection<Author>();
    private readonly RedisCollection<User> _users = (RedisCollection<User>)provider.RedisCollection<User>();
    private readonly RedisConnectionProvider _provider = provider;

    public string GenerateJwtToken(IConfiguration _configuration, string role, string email)
    {
        string key = _configuration["Jwt:Secret"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.Role, role),
                    new Claim(ClaimTypes.Email, email)
                ]
            ),
            Expires = DateTime.UtcNow.AddMinutes(120),
            SigningCredentials = credentials,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Issuer"],
        };

        var handler = new JsonWebTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);

        return token;
    }

    public async Task<UserBase?> GetUserByEmail(string email)
    {
        var user = await _users.Where(user => user.Email == email).FirstOrDefaultAsync();
        if (user != null)
        {
            user.Role = "User";
            return user;
        }

        var author = await _authors.Where(author => author.Email == email).FirstOrDefaultAsync();
        if (author != null)
            author.Role = "Author";

        return author;
    }

    public async Task<bool> CheckEmail(string email)
    {
        var user = await _users.Where(user => user.Email == email).ToListAsync();
        if (user.FirstOrDefault() != null) return true;

        var author = await _authors.Where(author => author.Email == email).ToListAsync();
        if (author.FirstOrDefault() != null) return true;

        return false;
    }
}
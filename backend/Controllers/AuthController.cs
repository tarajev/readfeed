using System.Runtime.CompilerServices;
using backend.Extensions;
using backend.Model;
using backend.Services;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Redis.OM;
using Redis.OM.Searching;


[Route("Auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly RedisCollection<Author> _authors;
    private readonly RedisCollection<User> _users;
    private readonly RedisConnectionProvider _provider;
    private readonly AuthService _authService;
    

    public AuthController(IConfiguration c, AuthService authService, RedisConnectionProvider provider)
    {
        _configuration = c;
        _authService = authService;
        _provider = provider;
        _authors = (RedisCollection<Author>)provider.RedisCollection<Author>();
        _users = (RedisCollection<User>)provider.RedisCollection<User>();
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _authService.GetUserByEmail(request.Email, request.Role);

        if (user != null && PasswordHasher.VerifyPassword(request.Password, user.Password))
        {
            var token = _authService.GenerateJwtToken(_configuration, request.Role, request.Email);
            var response = new
            {
                user = user,
                jwtToken = token
            };
            return Ok(response);
        }
        return BadRequest("Pogrešno uneti podaci.");
    }

    [HttpGet("CheckEmail/{email}")]
    public async Task<IActionResult> CheckEmail(string role, string email)
    {
        var checkEmail = await _authService.CheckEmail(role, email);
        if (checkEmail == true)
            return BadRequest("Email in use");
        else
            return Ok("Email valid");
    }
}

public class LoginRequest //ovo premestiti negde?
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Role { get; set; }
}

using System.Runtime.CompilerServices;
using backend.Extensions;
using backend.Model;
using backend.Services;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Redis.OM;
using Redis.OM.Searching;

namespace backend.Controllers;

[Route("Auth")]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly RedisCollection<Author> _authors;
    private readonly RedisCollection<User> _users;
    private readonly RedisConnectionProvider _provider;
    private readonly AuthService _authService;
    

    public AuthController(IConfiguration c, AuthService authService)
    {
        _configuration = c;
        _authService = authService;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {

        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        return BadRequest("Missing data");

        if (request == null){
            return BadRequest("Request is null");
        }

        var user = await _authService.GetUserByEmail(request.Email);

        if (user == null)
        {Console.WriteLine("user je null");}
        

        if (user != null && PasswordHasher.VerifyPassword(request.Password, user.Password))
        {
            var token = _authService.GenerateJwtToken(_configuration, user.Role, request.Email);
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
    public async Task<IActionResult> CheckEmail(string email)
    {
        var checkEmail = await _authService.CheckEmail(email);
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
}

using Microsoft.AspNetCore.Mvc;
using Redis.OM.Searching;
using backend.Model;
using Redis.OM;
using backend.Extensions;
using Microsoft.AspNetCore.Authorization;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Authorize(Roles = "User")]
[Route("User")]
public class UserController(RedisConnectionProvider provider, AuthService authService) : ControllerBase
{
    private readonly RedisCollection<User> _users = (RedisCollection<User>)provider.RedisCollection<User>();
    private readonly RedisConnectionProvider _provider = provider;
    private readonly AuthService _authService = authService;

    [AllowAnonymous]
    [HttpPost("AddUser")]
    public async Task<IActionResult> AddUser([FromBody] User user)
    {
        var existingUser = await _users.FindByIdAsync($"User:{user.Username}");

        if (existingUser != null)
            return BadRequest($"User: '{user.Username}' already exists.");

        var emailInUse = await _authService.CheckEmail(user.Email);

        if (emailInUse == true)
            return BadRequest($"Email: '{user.Email}' is already in use.");

        user.Password = PasswordHasher.HashPassword(user.Password);

        await _users.InsertAsync(user);
        return Ok("New user was successfully added.");
    }

    [AllowAnonymous]
    [HttpGet("GetUserByUsername/{username}")]
    public async Task<IActionResult> GetUserByUsername(string username)
    {
        var user = await _users.FindByIdAsync($"User:{username}");

        if (user == null)
            return NotFound($"User: '{username}'  not found.");

        return Ok(user);
    }

    [HttpPut("UpdateUserPassword/{username}/{oldPassword}/{newPassword}")]
    public async Task<IActionResult> UpdateUserPassword([FromRoute] string username, [FromRoute] string oldPassword, [FromRoute] string newPassword)
    {
        var user = await _users.FindByIdAsync($"User:{username}");

        if (user == null)
            return NotFound($"User: '{username}' not found.");

        bool correctPassword = PasswordHasher.VerifyPassword(oldPassword, user.Password);

        if (correctPassword)
        {
            user.Password = PasswordHasher.HashPassword(newPassword);
            await _users.SaveAsync();
            return Ok("User's information was successfully updated.");
        }
        else
        {
            return BadRequest("Old password isn't correct.");
        }
    }

    [HttpDelete("DeleteUser/{username}")]
    public IActionResult DeleteUser([FromRoute] string username)
    {
        var keysToDelete = new[]
        {
            $"User:{username}",
            $"user:{username}:upvotes",
            $"user:{username}:downvotes",
            $"user:{username}:readlater"
        };

        var status = _provider.Connection.Unlink(keysToDelete);
        if (status >= 1)
            return Ok(status);
        else
            return BadRequest("An error occurred when trying to delete a user.");
    }

    [HttpPut("SubscribeUserToCategory/{username}/{category}")]
    public async Task<IActionResult> SubscribeUserToCategory([FromRoute] string username, [FromRoute] string category)
    {
        var user = await _users.FindByIdAsync($"User:{username}");

        if (user == null)
            return NotFound($"User: '{username}' not found.");

        if (!user.SubscribedCategories.Contains(category))
        {
            user.SubscribedCategories.Add(category);
            await _users.SaveAsync();
            return Ok($"User was successfully subscribed to the category: {category}.");
        }
        else
        {
            return BadRequest($"User was already subscribed to the category: {category}.");
        }
    }

    [HttpPut("UnsubscribeUserFromCategory/{username}/{category}")]
    public async Task<IActionResult> UnsubscribeUserFromCategory([FromRoute] string username, [FromRoute] string category)
    {
        var user = await _users.FindByIdAsync($"User:{username}");

        if (user == null)
            return NotFound($"User: '{username}' not found.");

        if (user.SubscribedCategories.Contains(category))
        {
            user.SubscribedCategories.Remove(category);
            await _users.SaveAsync();
            return Ok($"User was successfully unsubscribed from the category: {category}.");
        }
        else
        {
            return BadRequest($"User isn't subscribed to the category: {category}.");
        }
    }
}
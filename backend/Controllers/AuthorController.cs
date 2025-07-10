using Microsoft.AspNetCore.Mvc;
using Redis.OM.Searching;
using backend.Model;
using Redis.OM;
using Microsoft.AspNetCore.Authorization;
using backend.Extensions;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("Author")]
public class AuthorController(RedisConnectionProvider provider, AuthService authService) : ControllerBase
{
    private readonly RedisCollection<Author> _authors = (RedisCollection<Author>)provider.RedisCollection<Author>();
    private readonly RedisConnectionProvider _provider = provider;
    private readonly AuthService _authService = authService;

    [AllowAnonymous]
    [HttpPost("AddAuthor")]
    public async Task<IActionResult> AddAuthor([FromBody] Author author)
    {
        var emailInUse = await _authService.CheckEmail(author.Email);

        if (emailInUse == true)
            return BadRequest($"Email: '{author.Email}' is already in use.");

        author.Password = PasswordHasher.HashPassword(author.Password);
        author.Bio = "This author has no set bio.";

        await _authors.InsertAsync(author);
        return Ok("New author was successfully added");
    }

    [HttpGet("GetAuthorById/{id}")]
    public async Task<IActionResult> GetAuthorById(string id)
    {
        var author = await _authors.FindByIdAsync($"Author:{id}");

        if (author == null)
            return BadRequest("Author was not found.");

        return Ok(author);
    }

    [HttpPut("UpdateAuthor/{id}")]
    public async Task<IActionResult> UpdateAuthor([FromRoute] string id, [FromBody] string bio) // Za bio
    {
        var author = await _authors.FindByIdAsync($"Author:{id}");

        if (author == null)
            return NotFound(new { Message = "Author not found" });

        if (author.Bio != bio)
            author.Bio = bio;

        await _authors.SaveAsync();
        return Ok("Author's bio was successfully updated.");
    }

    [Authorize(Roles = "Author")]
    [HttpDelete("DeleteAuthor/{id}")]
    public IActionResult DeleteAuthor([FromRoute] string id)
    {
        var status = _provider.Connection.Unlink($"Author:{id}");

        if (status == 1)
            return Ok(status);
        else
            return BadRequest("An error occurred deleting an author");
    }

    [HttpPut("UploadAuthorPicture/{id}")]
    public async Task<IActionResult> UploadAuthorPicture(IFormFile file, string id)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        if (file.Length > 5000000)
            return BadRequest("File size too large!");

        var author = await _authors.FindByIdAsync(id);
        if (author == null)
            return NotFound("Author doesn't exist.");

        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "UploadedFiles", "Authors");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = author.Id!.Replace(" ", "-") + fileExtension;
        var filePath = Path.Combine(uploadsFolder, fileName);

        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileUrl = $"/UploadedFiles/Authors/{fileName}";
        author.Picture = fileUrl;

        await _authors.UpdateAsync(author);

        return Ok(fileUrl);
    }
}
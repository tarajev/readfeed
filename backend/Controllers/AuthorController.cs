using Microsoft.AspNetCore.Mvc;
using Redis.OM.Searching;
using backend.Model;
using Redis.OM;

namespace backend.Controllers;

[ApiController]
[Route("Author")]
public class AuthorController : ControllerBase
{
    private readonly RedisCollection<Author> _authors;
    private readonly RedisConnectionProvider _provider;
    public AuthorController(RedisConnectionProvider provider)
    {
        _provider = provider;
        _authors = (RedisCollection<Author>)provider.RedisCollection<Author>();
    }

    [HttpPost("AddAuthor")]
    public async Task<IActionResult> AddAuthor([FromBody] Author author)
    {
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
    public async Task<IActionResult> UpdateAuthor([FromRoute] string id, [FromBody] Author Author) //update za bio i newspaper
    {
        var author = await _authors.FindByIdAsync($"Author:{id}");

        if (author == null)
        {
            return NotFound(new { Message = "Author not found" });
        }


        Author.Bio = Author.Bio; //na frontendu da se omoguci dugme samo ako se nesto promeni
        Author.Newspaper = Author.Newspaper;


        await _authors.SaveAsync();

        return Ok("Author's information was successfully updated.");
    }

    [HttpDelete("DeleteAuthor/{id}")]
    public IActionResult DeleteAuthor([FromRoute] string id)
    {
        var status = _provider.Connection.Unlink($"Author:{id}");
        if (status == 1)
            return Ok(status);
        else
            return BadRequest("An error occurred deleting an author");
    }
}
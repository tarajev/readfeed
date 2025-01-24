using Microsoft.AspNetCore.Mvc;
using Redis.OM.Searching;
using backend.Model;
using Redis.OM;
using StackExchange.Redis;
using Microsoft.VisualBasic;
namespace backend.Controllers;

[ApiController]
[Route("NewsArticle")]
public class NewsArticleController : ControllerBase
{
    private readonly RedisCollection<NewsArticle> _news;
    private readonly RedisConnectionProvider _provider;
    public NewsArticleController(RedisConnectionProvider provider)
    {
        _provider = provider;
        _news = (RedisCollection<NewsArticle>)provider.RedisCollection<NewsArticle>();
    }

    [HttpPost("AddNewsArticle")]
    public async Task<IActionResult> AddNewsArticle([FromBody] NewsArticle article)
    {
        await _news.InsertAsync(article, TimeSpan.FromDays(14));
        return Ok("New Article was successfully added");
    }

    [HttpGet("GetNewsArticleById/{id}")]
    public async Task<IActionResult> GetNewsArticleById(string id)
    {
        var article = await _news.FindByIdAsync($"Article:{id}");

        if (article == null)
            return BadRequest("Article was not found.");

        return Ok(article);
    }

    [HttpPut("UpdateContent/{id}")]
    public async Task<IActionResult> UpdateNewsArticle([FromRoute] string id, [FromBody] NewsArticle newsArticle) //update za title i content
    {
        var article = await _news.FindByIdAsync($"Article:{id}");

        if (article == null)
        {
            return NotFound(new { Message = "Article not found" });
        }

        if (newsArticle.Content != "")
            article.Content = newsArticle.Content;
        if (newsArticle.Title != "")
            article.Title = newsArticle.Title;

        await _news.SaveAsync();

        return Ok("Article was successfully updated.");
    }

    [HttpDelete("DeleteNewsArticle/{id}")]
    public IActionResult DeleteNewsArticle([FromRoute] string id)
    {
        var status = _provider.Connection.Unlink($"Article:{id}");
        if (status == 1)
            return Ok(status);
        else
            return BadRequest("Došlo je do greške");
    }
}
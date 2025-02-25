using Microsoft.AspNetCore.Mvc;
using Redis.OM.Searching;
using backend.Model;
using Redis.OM;
using Microsoft.VisualBasic;
using System.Text.RegularExpressions;

using System.Text.Json;
using StackExchange.Redis;
namespace backend.Controllers;

[ApiController]
[Route("NewsArticle")]
public partial class NewsArticleController : ControllerBase //ne znam zasto je partial kad je samo ova klasa???
{
    private readonly RedisCollection<NewsArticle> _news;
    private readonly RedisConnectionProvider _provider;
    private readonly IConnectionMultiplexer _multiplexer;
    public NewsArticleController(RedisConnectionProvider provider, IConnectionMultiplexer multiplexer)
    {
        _provider = provider;
        _news = (RedisCollection<NewsArticle>)provider.RedisCollection<NewsArticle>();
        _multiplexer = multiplexer;
    }

    #region CRUD

    [HttpPost("AddNewsArticle")]
    public async Task<IActionResult> AddNewsArticle([FromBody] NewsArticle article)
    {
        await _news.InsertAsync(article, TimeSpan.FromDays(14));

        var subscriber = _multiplexer.GetSubscriber();
        var message = JsonSerializer.Serialize(article);
        await subscriber.PublishAsync(RedisChannel.Literal("news_channel"), message);

        return Ok("New Article was successfully added");
    }

    [HttpGet("GetNewsArticleById/{id}")]
    public async Task<IActionResult> GetNewsArticleById(string id)
    {
        var article = await _news.FindByIdAsync($"Article:{id}");

        if (article == null)
            return BadRequest("Article was not found.");

        // article.CreatedAt = article.CreatedAt.ToLocalTime();
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
    #endregion

    #region Search

    [HttpGet("GetMostPopularNewsArticles/{skip}/{take}/{userId}")] //korisnik u startu bira par kategorija ili ukoliko ne onda najpopularnije iz svih kategorija?
    public async Task<IActionResult> GetMostPopularNewsArticles(int skip, int take, [FromQuery] string[] followedCategories, string userId)
    {
        var articles = await _news
        .Where(article => followedCategories.Contains(article.Category))
        .OrderByDescending(article => article.Score)
        .Skip(skip)
        .Take(take)
        .ToListAsync();

        if (!articles.Any())
            return BadRequest("Article was not found.");

        var currentTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        string upvotedSetKey = $"user:{userId}:upvotes";
        string downvotedSetKey = $"user:{userId}:downvotes";
        string readLaterSetKey = $"user:{userId}:readlater";

        var upvotes = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", upvotedSetKey, currentTimestamp, "+inf");
        var downvotes = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", downvotedSetKey, currentTimestamp, "+inf");
        var bookmarks = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", readLaterSetKey, currentTimestamp, "+inf");

        var upvotesIds = upvotes.ToArray().Select(x => x.ToString()).ToList();
        var downvotesIds = downvotes.ToArray().Select(x => x.ToString()).ToList();
        var bookmarksIds = bookmarks.ToArray().Select(x => x.ToString()).ToList();

        var result = articles.Select(article => new NewsArticle
        {
            Id = article.Id,
            Title = article.Title,
            Content = article.Content,
            Score = article.Score,
            Category = article.Category,
            Tags = article.Tags,
            Photos = article.Photos,
            Link = article.Link,
            Author = article.Author,
            CreatedAt = article.CreatedAt,
            Upvoted = upvotesIds.Contains(article.Id),
            Downvoted = downvotesIds.Contains(article.Id),
            Bookmarked = bookmarksIds.Contains(article.Id)
        }).ToList();

        return Ok(result);
    }

    [HttpGet("GetMostRecentNewsArticles/{skip}/{take}/{userId}")]
    public async Task<IActionResult> GetMostRecentNewsArticles(int skip, int take, [FromQuery] string[] followedCategories, string userId)
    {
        var articles = await _news
        .Where(article => followedCategories.Contains(article.Category)) //article.Category.Intersect(followedCategories).Any probati
        .OrderByDescending(article => article.CreatedAt)
        .Skip(skip)
        .Take(take)
        .ToListAsync();

        if (!articles.Any())
            return BadRequest("Article was not found.");


        var currentTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        string upvotedSetKey = $"user:{userId}:upvotes";
        string downvotedSetKey = $"user:{userId}:downvotes";
        string readLaterSetKey = $"user:{userId}:readlater";

        var upvotes = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", upvotedSetKey, currentTimestamp, "+inf");
        var downvotes = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", downvotedSetKey, currentTimestamp, "+inf");
        var bookmarks = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", readLaterSetKey, currentTimestamp, "+inf");

        var upvotesIds = upvotes.ToArray().Select(x => x.ToString()).ToList();
        var downvotesIds = downvotes.ToArray().Select(x => x.ToString()).ToList();
        var bookmarksIds = bookmarks.ToArray().Select(x => x.ToString()).ToList();

        var result = articles.Select(article => new NewsArticle
        {
            Id = article.Id,
            Title = article.Title,
            Content = article.Content,
            Score = article.Score,
            Category = article.Category,
            Tags = article.Tags,
            Photos = article.Photos,
            Link = article.Link,
            Author = article.Author,
            CreatedAt = article.CreatedAt,
            Upvoted = upvotesIds.Contains(article.Id),
            Downvoted = downvotesIds.Contains(article.Id),
            Bookmarked = bookmarksIds.Contains(article.Id)
        }).ToList();

        return Ok(result);
    }

    [HttpGet("SearchByTitleAndTags/{skip}/{take}")]
    public async Task<IActionResult> SearchByTitleAndTags(int skip, int take, [FromQuery] string[] tags, [FromQuery] string title)
    {

        var articles = await _news
        .Where(article => tags.Contains(article.Tags) || article.Title.Contains(title)) //pretvara se u lowercase kod fulltextsearch-a tako da nema potrebe da se konvertuje
        .Skip(skip)
        .Take(take)
        .ToListAsync();

        if (!articles.Any())
            return BadRequest("Article was not found.");

        return Ok(articles);
    }

    [HttpGet("FullTextSearch/{skip}/{take}/{query}")]
    public async Task<IActionResult> FullTextSearch(int skip, int take, string query)
    {
        string[] tags = [.. MyRegex().Matches(query).Select(match => match.Value)];

        var articles = await _news
        .Where(article => tags.Contains(article.Tags) || article.Title.Contains(query) || article.Content.Contains(query))
        .Skip(skip)
        .Take(take)
        .ToListAsync();

        if (!articles.Any())
            return BadRequest("Article was not found.");

        return Ok(articles);
    }
    #endregion

    #region Upvote/Downvote
    // videti u kom trenutku će se brisati iz ovih setova vesti

    [HttpPut("UpvoteNewsArticle/{userId}/{articleId}")]
    public async Task<IActionResult> UpvoteNewsArticle(string userId, string articleId)
    {
        var article = await _news.FindByIdAsync($"Article:{articleId}");
        if (article != null)
            article.Score++;

        await _news.SaveAsync();

        var articleKey = $"Article:{articleId}";
        var setKey = $"user:{userId}:upvotes";

        var ttl = await _provider.Connection.ExecuteAsync("TTL", articleKey);

        if (ttl > 0)
        {
            var expirationTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + ttl;
            var result = await _provider.Connection.ExecuteAsync("ZADD", setKey, expirationTimestamp, articleId);
            if (result > 0)
                return Ok("Article was successfully added to upvotes");
            else
                return BadRequest("Error adding an article to upvotes");
        }
        else
            return BadRequest("Article is no longer available");
    }


    [HttpPut("DownvoteNewsArticle/{userId}/{articleId}")]
    public async Task<IActionResult> DownvoteNewsArticle(string userId, string articleId)
    {

        var article = await _news.FindByIdAsync($"Article:{articleId}");
        if (article != null)
            article.Score--;

        await _news.SaveAsync();

        var articleKey = $"Article:{articleId}";
        var setKey = $"user:{userId}:downvotes";

        var ttl = await _provider.Connection.ExecuteAsync("TTL", articleKey);

        if (ttl > 0)
        {
            var expirationTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + ttl;
            var result = await _provider.Connection.ExecuteAsync("ZADD", setKey, expirationTimestamp, articleId);
            if (result > 0)
                return Ok("Article was successfully added to downvote");
            else
                return BadRequest("Error adding an article to downvotes");
        }
        else
            return BadRequest("Article is no longer available");
    }

    [HttpPut("RemoveUpvoteNewsArticle/{userId}/{articleId}")]
    public async Task<IActionResult> RemoveUpvoteNewsArticle(string userId, string articleId)
    {
        var article = await _news.FindByIdAsync($"Article:{articleId}");
        if (article != null)
            article.Score--;

        await _news.SaveAsync();

        var setKey = $"user:{userId}:upvotes";

        var result = await _provider.Connection.ExecuteAsync("ZREM", setKey, articleId);
        if (result > 0)
            return Ok("Article was successfully removed from upvotes");
        else
            return BadRequest("Error removing an article upvotes");

    }

    [HttpPut("RemoveDownvoteNewsArticle/{userId}/{articleId}")]
    public async Task<IActionResult> RemoveDownvoteNewsArticle(string userId, string articleId)
    {
        var article = await _news.FindByIdAsync($"Article:{articleId}");
        if (article != null)
            article.Score++;

        await _news.SaveAsync();

        var setKey = $"user:{userId}:downvotes";

        var result = await _provider.Connection.ExecuteAsync("ZREM", setKey, articleId);
        if (result > 0)
            return Ok("Article was successfully removed from downvotes");
        else
            return BadRequest("Error removing an article downvotes");

    }

    [GeneratedRegex(@"\w+")]
    private static partial Regex MyRegex();

    #endregion

    #region ReadLater

    /// <summary>
    /// Koristimo sorted set za readlater sekciju svakog od korisnika, score je timestamp kada vest ističe. Pri pribavljanju prvo brišemo sve 
    /// elemente sa datumom koji je prošao (zastarele vesti) i vraćamo preostale, validne.
    /// </summary>

    [HttpPost("AddToReadLater/{userId}/{articleId}")]
    public async Task<IActionResult> AddToReadLater(string userId, string articleId)
    {

        var articleKey = $"Article:{articleId}";
        var setKey = $"user:{userId}:readlater";

        var ttl = await _provider.Connection.ExecuteAsync("TTL", articleKey);

        if (ttl > 0)
        {
            var expirationTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds() + ttl;

            var result = await _provider.Connection.ExecuteAsync("ZADD", setKey, expirationTimestamp, articleId);
            return Ok("Article was successfully added to ReadLater section.");
        }
        else
            return BadRequest("Article is no longer available");
    }

    [HttpGet("GetReadLaterArticles/{userId}")]
    public async Task<List<NewsArticle?>> GetReadLaterArticles(string userId)
    {
        var setKey = $"user:{userId}:readlater";
        var currentTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        //prvo brišemo vesti koje su istekle i ako ne postoje ne vraća grešku
        await _provider.Connection.ExecuteAsync("ZREMRANGEBYSCORE", setKey, "-inf", currentTimestamp);

        var result = await _provider.Connection.ExecuteAsync("ZRANGEBYSCORE", setKey, currentTimestamp, "+inf");
        var ids = result.ToArray().Select(x => x.ToString()).ToList();

        var articles = await _news.FindByIdsAsync(ids);

        return [.. articles.Select(x => x.Value)]; //vraća prazan niz ako ne postoji sorted set 
    }

    [HttpDelete("RemoveArticleFromReadLater/{userId}/{articleId}")]
    public async Task<IActionResult> RemoveArticleFromReadLater(string userId, string articleId)
    {
        var setKey = $"user:{userId}:readlater";
        var result = await _provider.Connection.ExecuteAsync("ZREM", setKey, articleId);

        if (result == 1)
            return Ok("Article was successfully deleted from ReadLater");
        else
            return BadRequest("There was an error deleting an article from ReadLater");
    }

    #endregion
}
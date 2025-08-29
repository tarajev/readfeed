using System.Text.Json.Serialization;
using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "Article" })]
public class NewsArticle 
{
    [RedisIdField]
    [Indexed]
    public string? Id { get; set; }

    [Searchable]
    public string? Title { get; set; } 

    [Searchable]
    public string? Content { get; set; } 

    [Indexed]
    public string? Category { get; set; }

    [Indexed(Separator = '|')]
    public string? Tags { get; set; }

    public string[]? Photos { get; set; }

    public string? Link { get; set; }

    [Indexed]
    public string? Author { get; set; } 
    public string? AuthorName { get; set; }

    [Indexed(Sortable = true)]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [Indexed(Sortable = true)]
    public int Score { get; set; } = 0;

    public bool? Upvoted { get; set; }

    public bool? Downvoted { get; set; }
    public bool? Bookmarked { get; set; }
}
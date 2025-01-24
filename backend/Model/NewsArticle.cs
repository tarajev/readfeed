using System.Text.Json.Serialization;
using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "Article" })]
public class NewsArticle //da li cemo da imamo komentare?
{
    [RedisIdField]
    [Indexed]
    public string? Id { get; set; }

    [Searchable]
    public required string Title { get; set; } // pretrazivanje po naslovu

    [Searchable]
    public required string Content { get; set; } // tekst članka za full-text pretragu eventualno?

    [Indexed]
    public required string[] Categories { get; set; }

    public string[]? Photos { get; set; }

    public required string Link { get; set; }

    public required string Author { get; set; } //da pamtimo id? 

    [Indexed(Sortable = true)]
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    [Indexed(Sortable = true)]
    public int Score { get; set; } = 0;
}
using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "Author" })]
public class Author
{
    [RedisIdField]
    [Indexed]
    public string? Id { get; set; }

    [Indexed]
    public required string FullName { get; set; }

    [Indexed]
    public required string Email { get; set; }

    public string? Bio { get; set; }

    [Indexed]
    public required string Newspaper { get; set; }
}
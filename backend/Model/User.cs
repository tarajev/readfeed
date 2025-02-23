using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "User" })]
public class User
{
    [RedisIdField]
    [Indexed]
    public required string Username { get; set; }

    [Indexed]
    public required string Email { get; set; }

    public required string Password { get; set; }

    [Indexed]
    public List<string> SubscribredCategories { get; set; } = [];
}
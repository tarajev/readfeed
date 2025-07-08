using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "User" })]
public class User : UserBase
{
    [RedisIdField]
    [Indexed]
    public required string Username { get; set; }
    
    [Indexed]
    public List<string> SubscribedCategories { get; set; } = [];
}
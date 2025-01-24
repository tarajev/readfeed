using Redis.OM.Modeling;

namespace backend.Model;

[Document(StorageType = StorageType.Json, Prefixes = new []{"User"})]
public class User //ne znam sta jos dodati
{    
    [RedisIdField] 
    [Indexed]
    public required string Username { get; set; }

    [Indexed] 
    public required string Email { get; set; }
    
    [Indexed] 
    public List<string> SubscribredCategories { get; set; } = [];    
    
}
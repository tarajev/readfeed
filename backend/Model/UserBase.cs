using System.Text.Json.Serialization;
using Redis.OM.Modeling;

namespace backend.Model;

[JsonDerivedType(typeof(User), "User")]
[JsonDerivedType(typeof(Author), "Author")]
public class UserBase
{
    [Indexed]
    public required string Email { get; set; }
    public required string Password { get; set; }
}
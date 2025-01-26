using backend.Model;
using Redis.OM;

namespace backend.HostedServices;

public class IndexCreationService : IHostedService
{
    private readonly RedisConnectionProvider _provider;
    public IndexCreationService(RedisConnectionProvider provider)
    {
        _provider = provider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var info = (await _provider.Connection.ExecuteAsync("FT._LIST")).ToArray().Select(x => x.ToString());

        if (info.All(x => x != "newsarticle-idx"))
            await _provider.Connection.CreateIndexAsync(typeof(NewsArticle));

        if (info.All(x => x != "user-idx"))
            await _provider.Connection.CreateIndexAsync(typeof(User));

        if (info.All(x => x != "author-idx"))
            await _provider.Connection.CreateIndexAsync(typeof(Author));
        
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
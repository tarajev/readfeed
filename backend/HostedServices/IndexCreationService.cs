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
        await _provider.Connection.CreateIndexAsync(typeof(NewsArticle));
        await _provider.Connection.CreateIndexAsync(typeof(User));
        await _provider.Connection.CreateIndexAsync(typeof(Author));
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Redis.OM;
using Redis.OM.Searching;
using StackExchange.Redis;
using backend.Model;

namespace backend.SignalR;

public class NewsSubscriberService(
    IConnectionMultiplexer multiplexer,
    IHubContext<NewsHub> hubContext,
    RedisConnectionProvider provider
) : BackgroundService
{
    private readonly ISubscriber _subscriber = multiplexer.GetSubscriber();
    private readonly IHubContext<NewsHub> _hubContext = hubContext;
    private readonly RedisConnectionProvider _provider = provider;
    private readonly IRedisCollection<User> _userCollection = provider.RedisCollection<User>();

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _subscriber.SubscribeAsync(new RedisChannel("news:*", RedisChannel.PatternMode.Pattern), async (channel, message) =>
        {
            try
            {
                string category = channel.ToString().Split(':').Last();
                var article = JsonSerializer.Deserialize<NewsArticle>(message!);

                if (article?.Category == null)
                    return;

                var identifiers = new List<string>();

                // Get subscribed regular users
                var subscribedUsers = await _userCollection
                    .Where(u => u.SubscribedCategories.Contains(article.Category))
                    .ToListAsync();

                identifiers.AddRange(subscribedUsers.Select(u => u.Username));

                if (identifiers.Count != 0)
                {
                    // Send to specific users by their identifiers
                    await _hubContext.Clients.Users(identifiers)
                        .SendAsync("ReceiveNewsArticle", article, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error processing news article: {ex.Message}");
            }
        });
    }
}

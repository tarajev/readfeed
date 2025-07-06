using backend.Model;
using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System.Text.Json;

namespace backend.SignalR;

public class NewsSubscriberService(IConnectionMultiplexer multiplexer, IHubContext<NewsHub> hubContext) : BackgroundService
{
    private readonly ISubscriber _subscriber = multiplexer.GetSubscriber();
    private readonly IHubContext<NewsHub> _hubContext = hubContext;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await _subscriber.SubscribeAsync(new RedisChannel("news:*", RedisChannel.PatternMode.Pattern), async (channel, message) =>
        {
            string category = channel.ToString().Split(':').Last();
            var article = JsonSerializer.Deserialize<NewsArticle>(message!);

            // Samo saljemo klijentima sa tim subscribed kategorijama
            // await _hubContext.Clients.Group(category).SendAsync("ReceiveNewsArticle", article);
            await _hubContext.Clients.All.SendAsync("ReceiveNewsArticle", article); // TODO: Srediti ovo da ne salje svima
        });
    }
}

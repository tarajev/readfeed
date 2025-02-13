using backend.Model;
using Microsoft.Extensions.Hosting;
using Redis.OM;
using StackExchange.Redis;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;


public class NewsSubscriberService : BackgroundService
{
    private readonly IConnectionMultiplexer _multiplexer;

    public NewsSubscriberService(IConnectionMultiplexer multiplexer)
    {
        _multiplexer = multiplexer;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("NewsSubscriberService started...");
        var subscriber = _multiplexer.GetSubscriber();

        await subscriber.SubscribeAsync(RedisChannel.Literal($"news_channel"), (channel, message) =>
          {
              var article = JsonSerializer.Deserialize<NewsArticle>(message);
              Console.WriteLine($"New article received: {article.Title}");

              // SignalR  treba da šalje vest samo korisnicima koji su u grupi te kategorije
          });
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}


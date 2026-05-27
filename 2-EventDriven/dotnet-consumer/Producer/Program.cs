using CodeAcademy.DotnetConsumer.Common.Config;
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

Console.WriteLine("Producer starting...");
// Establish connection to RabbitMQ
using var connection = await ConnectionHelper.ConnectAsync();
Console.WriteLine("Connected to RabbitMQ");

// Implement a basic producer here.
// Start with:
// - Create a channel
// - Declare a queue
// - Publish a message to the queue (you can use a simple JSON string as the message body)

/*
#region Default Exchange

// Create a channel and declare the queue
using var channel = await connection.CreateChannelAsync();
await channel.QueueDeclareAsync(queue: "idem-events", durable: true, exclusive: false, autoDelete: false, arguments: null);

// Publish messages to the queue with for loop to simulate multiple events
for (int i = 0; i < 10; i++)
{
    var message = $"Idems Event {i + 1} at {DateTime.Now}";

    var messageBody = JsonSerializer.Serialize(message);
    var body = Encoding.UTF8.GetBytes(messageBody);

    await channel.BasicPublishAsync(exchange: string.Empty, routingKey: "idem-events", mandatory: true, basicProperties: new BasicProperties { Persistent = true }, body: body);
    Console.WriteLine($"Published event: {message}");

    await Task.Delay(2000);
}

#endregion
*/

/*
#region FANOUT EXCHANGE

// Create a channel and declare the queue
using var channel = await connection.CreateChannelAsync();

await channel.ExchangeDeclareAsync(
    exchange: "fanout-exchange",
    durable: true,
    type: ExchangeType.Fanout,
    autoDelete: false,
    arguments: null);

await channel.QueueDeclareAsync(queue: "fanout-queue-1", durable: true, exclusive: false, autoDelete: false, arguments: null);

for (int i = 0; i < 10; i++)
{
    var message = $"Fanout event {i + 1} at {DateTime.Now}";

    var messageBody = JsonSerializer.Serialize(message);
    var body = Encoding.UTF8.GetBytes(messageBody);

    await channel.BasicPublishAsync(exchange: "fanout-exchange", routingKey: "fanout-events", mandatory: true, basicProperties: new BasicProperties { Persistent = true }, body: body);
    Console.WriteLine($"Published event: {message}");

    await Task.Delay(2000);
}

#endregion
*/

/*
#region DIRECT EXCHANGE

// Create a channel and declare the queue
using var channel = await connection.CreateChannelAsync();

await channel.ExchangeDeclareAsync(
    exchange: "direct-exchange",
    durable: true,
    type: ExchangeType.Direct,
    autoDelete: false,
    arguments: null);

await channel.QueueDeclareAsync(queue: "direct-queue-1", durable: true, exclusive: false, autoDelete: false, arguments: null);

for (int i = 0; i < 10; i++)
{
    var message = $"Direct event {i + 1} at {DateTime.Now}";

    var messageBody = JsonSerializer.Serialize(message);
    var body = Encoding.UTF8.GetBytes(messageBody);

    await channel.BasicPublishAsync(exchange: "direct-exchange", routingKey: "RK1", mandatory: true, basicProperties: new BasicProperties { Persistent = true }, body: body);
    Console.WriteLine($"Published event: {message}");

    await Task.Delay(2000);
}

#endregion
*/

Console.WriteLine("Producer finished.");
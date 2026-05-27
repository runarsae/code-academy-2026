using Scalar.AspNetCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase, allowIntegerValues: true)));

builder.Services.AddProblemDetails();

// Registrer OpenAPI-tjenestene. Disse genererer spesifikasjonen
// automatisk basert på endepunktene og typene i prosjektet (code-first).
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapControllers();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    // Eksponerer den genererte spesifikasjonen på /openapi/v1.json
    app.MapOpenApi();

    // Scalar gir et moderne, interaktivt UI på /scalar/v1
    // for å utforske og teste API-et.
    app.MapScalarApiReference();
}

// --- Hello Coffee --------------------------------------------------------
// Et minimal API-endepunkt som returnerer en hardkodet kaffemeny.
// Dette er utgangspunktet for workshopen. Bygg videre herfra!

List<CoffeeDto> coffees =
[
    new CoffeeDto { Id = Guid.Parse("18558972-cc29-4a57-8cfa-ff11f5c7d72f"), Name = "Kaffe Latte", Price = 48.50m },
    new CoffeeDto { Id = Guid.Parse("38dbf2b8-9422-4bbf-9179-5fffeb406e1f"), Name = "Cappuccino", Price = 45.00m },
    new CoffeeDto { Id = Guid.Parse("6b0ac0fe-3916-423a-9b7e-16bd120fe246"), Name = "Espresso", Price = 35.00m },
];

app.MapGet("/menu", () => coffees)
.WithName("GetMenu")
.WithSummary("Hent kaffemeny")
.WithDescription("Returnerer en liste over alle tilgjengelige kaffedrikker i kaffebaren.");


// List<OrderDto> orders = new();

// app.MapPost("/order", (CreateOrderDto order) =>
// {
//     var newOrder = new OrderDto(Guid.NewGuid(), order.CoffeeId);
//     orders.Add(newOrder);
//     return TypedResults.Created($"/order/{newOrder.Id}", newOrder);
// })
// .WithName("CreateOrder")
// .WithSummary("Opprett bestilling")
// .WithDescription("Legger inn en bestilling for en kaffe.");

app.Run();

// DTO-er kan ligge i Program.cs når prosjektet er lite.
// Etter hvert er det ryddig å flytte dem til egne filer i en Models-mappe.
public record CoffeeDto
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public decimal Price { get; init; }
}

namespace Kaffebar.Models;

public record OrderDto
{
    public Guid Id { get; init; }
    public Guid CoffeeId { get; init; }
    public Size Size { get; init; }
    public MilkType MilkType { get; init; }
    public bool? ExtraShot { get; init; }
    public required string CustomerName { get; init; }
    public int Quantity { get; init; }
    public OrderStatus Status { get; init; } = OrderStatus.Pending;
}

public enum OrderStatus
{
    Pending,
    Brewing,
    Ready,
}

public enum Size
{
    Small,
    Medium,
    Large
}

public enum MilkType
{
    Whole,
    Skimmed,
    Oat,
    Soy
}

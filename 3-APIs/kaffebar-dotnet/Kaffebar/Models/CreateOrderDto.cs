using System.ComponentModel.DataAnnotations;

namespace Kaffebar.Models;

public record CreateOrderDto
{
    public Guid CoffeeId { get; init; }
    public Size Size { get; init; }
    public MilkType MilkType { get; init; }
    public bool? ExtraShot { get; init; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "CustomerName er påkrevd.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "CustomerName må være mellom 2 og 50 tegn.")]
    [RegularExpression(@".*\S.*", ErrorMessage = "CustomerName kan ikke være blank.")]
    public required string CustomerName { get; init; }

    [Range(1, 10, ErrorMessage = "Quantity må være mellom 1 og 10.")]
    public int Quantity { get; init; }
}

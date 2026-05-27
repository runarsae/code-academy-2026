using System.ComponentModel.DataAnnotations;

namespace Kaffebar.Models;

public record UpdateOrderStatusDto
{
    [Required(ErrorMessage = "Status er påkrevd.")]
    [EnumDataType(typeof(OrderStatus), ErrorMessage = "Ugyldig status.")]
    public required OrderStatus Status { get; init; }
}

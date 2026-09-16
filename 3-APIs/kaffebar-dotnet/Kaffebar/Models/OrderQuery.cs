using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Kaffebar.Models;

public record OrderQuery
{
    public OrderStatus? Status { get; init; }

    [Range(1, 100, ErrorMessage = "Limit må være mellom 1 og 100.")]
    [DefaultValue(20)]
    public int Limit { get; init; } = 20;

    [Range(0, int.MaxValue, ErrorMessage = "Offset må være 0 eller større.")]
    [DefaultValue(0)]
    public int Offset { get; init; } = 0;
}

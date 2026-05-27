
using Kaffebar.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kaffebar.Controllers;

[ApiController]
[Route("orders")]
public class OrdersController : ControllerBase
{
    private static readonly List<OrderDto> orders = [];

    [HttpPost]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public IActionResult CreateOrder(CreateOrderDto order)
    {
        var newOrder = new OrderDto
        {
            Id = Guid.NewGuid(),
            CoffeeId = order.CoffeeId,
            Size = order.Size,
            MilkType = order.MilkType,
            ExtraShot = order.ExtraShot,
            CustomerName = order.CustomerName,
            Quantity = order.Quantity,
        };
        orders.Add(newOrder);
        return Created($"/orders/{newOrder.Id}", newOrder);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<OrderDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public ActionResult<IEnumerable<OrderDto>> ListOrders([FromQuery] OrderQuery query)
    {
        var filtered = orders.AsEnumerable();
        if (query.Status is { } status)
        {
            filtered = filtered.Where(o => o.Status == status);
        }
        return filtered.Skip(query.Offset).Take(query.Limit).ToList();
    }

    [HttpGet("{orderId:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public ActionResult<OrderDto> GetOrder(Guid orderId)
    {
        var order = orders.FirstOrDefault(o => o.Id == orderId);
        if (order is null)
        {
            return NotFound();
        }
        return order;
    }

    [HttpPatch("{orderId:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public ActionResult<OrderDto> UpdateOrderStatus(Guid orderId, UpdateOrderStatusDto update)
    {
        var index = orders.FindIndex(o => o.Id == orderId);
        if (index == -1)
        {
            return NotFound();
        }

        var current = orders[index];
        if (!IsValidTransition(current.Status, update.Status))
        {
            return Conflict(new ProblemDetails
            {
                Title = "Ugyldig statusovergang.",
                Detail = $"Kan ikke gå fra {current.Status} til {update.Status}. Gyldig flyt: Pending → Brewing → Ready.",
                Status = StatusCodes.Status409Conflict,
            });
        }

        var updated = current with { Status = update.Status };
        orders[index] = updated;
        return updated;
    }

    private static bool IsValidTransition(OrderStatus from, OrderStatus to) => (from, to) switch
    {
        (OrderStatus.Pending, OrderStatus.Brewing) => true,
        (OrderStatus.Brewing, OrderStatus.Ready) => true,
        _ => false,
    };
}
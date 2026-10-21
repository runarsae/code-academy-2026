import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BaristaBoard, ALERT_DURATION_MS } from "@/components/BaristaBoard";
import { NewOrderAlert } from "@/components/NewOrderAlert";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusColumn } from "@/components/StatusColumn";
import { nextStatus } from "@/components/OrderCard";
import { formatPrice, timeAgo } from "@/lib/format";
import type { Order } from "@/types/domain";

const order: Order = {
  orderId: "0de50001-0000-4000-8000-000000000001",
  coffeeId: "c0ffee01-0000-4000-8000-000000000007",
  coffeeName: "Kaffe Latte",
  customerName: "Ada",
  size: "MEDIUM",
  milkType: "OAT",
  quantity: 1,
  status: "PENDING",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("StatusBadge", () => {
  it("viser norsk etikett for statusen", () => {
    render(<StatusBadge status="BREWING" />);
    expect(screen.getByText("Under arbeid")).toBeInTheDocument();
  });
});

describe("StatusColumn", () => {
  it("viser tom tilstand når kolonnen er tom", () => {
    render(<StatusColumn status="READY" orders={[]} />);
    expect(screen.getByText("Alt er hentet.")).toBeInTheDocument();
  });

  it("teller ordrene i kolonnen", () => {
    render(<StatusColumn status="PENDING" orders={[order]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });
});

describe("statusflyten", () => {
  it("går PENDING -> BREWING -> READY og stopper der", () => {
    expect(nextStatus("PENDING")).toBe("BREWING");
    expect(nextStatus("BREWING")).toBe("READY");
    expect(nextStatus("READY")).toBeNull();
  });
});

describe("formatering", () => {
  it("viser pris i norske kroner", () => {
    expect(formatPrice(52)).toMatch(/52/);
  });

  it("sier «nå» om noe som skjedde nettopp", () => {
    expect(timeAgo(new Date().toISOString())).toBe("nå");
  });
});

describe("NewOrderAlert", () => {
  it("viser kunde og kaffe, og lukkeknappen kaller onDismiss", () => {
    const onDismiss = vi.fn();
    render(<NewOrderAlert order={order} onDismiss={onDismiss} />);
    expect(screen.getByRole("status")).toHaveTextContent("Kaffe Latte");
    expect(screen.getByRole("status")).toHaveTextContent("Ada");
    fireEvent.click(screen.getByRole("button", { name: "Lukk varsel" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("BaristaBoard", () => {
  class FakeEventSource {
    static instance: FakeEventSource;
    listeners = new Map<string, (e: MessageEvent) => void>();
    constructor() {
      FakeEventSource.instance = this;
    }
    addEventListener(type: string, fn: (e: MessageEvent) => void) {
      this.listeners.set(type, fn);
    }
    close() {}
  }

  it("viser varsel ved ny ordre og fjerner det etter fast tid", () => {
    vi.useFakeTimers();
    vi.stubGlobal("EventSource", FakeEventSource);
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <BaristaBoard initialOrders={[]} />
      </QueryClientProvider>,
    );
    const send = (
      type: string,
      data: Order,
      timestamp: string,
      previousStatus?: string,
    ) =>
      FakeEventSource.instance.listeners.get(type)?.({
        data: JSON.stringify({ type, timestamp, data, previousStatus }),
      } as MessageEvent);
    act(() => {
      send("order.created", order, "t1");
    });
    expect(screen.getByRole("status")).toHaveTextContent("Ny bestilling");
    act(() => {
      send("order.created", order, "t1");
    });
    expect(screen.getAllByRole("status")).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(ALERT_DURATION_MS);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Redelivery av samme hendelse etter lukking gir ikke nytt varsel
    act(() => {
      send("order.created", order, "t1");
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // Ny overgang tilbake til PENDING er en ny hendelse
    act(() => {
      send("order.status-changed", order, "t2", "READY");
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
    vi.useRealTimers();
  });
});

import { NextRequest, NextResponse } from "next/server";
import { createIdem, initializeDatabase } from "@/lib/db";

function generateId(): string {
  return `idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

let dbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, content } = body;

    if (!author || typeof author !== "string" || author.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid author", message: "Author is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid content", message: "Content is required" },
        { status: 400 }
      );
    }

    if (author.length > 50) {
      return NextResponse.json(
        { error: "Invalid author", message: "Author must be 50 characters or less" },
        { status: 400 }
      );
    }

    if (content.length > 280) {
      return NextResponse.json(
        { error: "Invalid content", message: "Content must be 280 characters or less" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const id = generateId();

    if (process.env.ENABLE_RABBITMQ === "true") {
      // Publish via RabbitMQ (for EventDriven workshop)
      const { publishIdemCreated } = await import("@/lib/rabbitmq");
      await publishIdemCreated({
        type: "idem.created",
        timestamp: now,
        data: { id, author: author.trim(), content: content.trim(), createdAt: now, isSeeded: false },
      });

      return NextResponse.json(
        { success: true, message: "Idem published to queue", id },
        { status: 202 }
      );
    }

    // Default: write directly to database
    if (!dbInitialized) {
      await initializeDatabase();
      dbInitialized = true;
    }

    await createIdem({ id, author: author.trim(), content: content.trim(), createdAt: now });

    return NextResponse.json(
      { success: true, message: "Idem created", id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create idem:", error);

    const isConnectionError =
      error instanceof Error &&
      (error.message.includes("ECONNREFUSED") ||
        error.message.includes("connection") ||
        error.message.includes("timeout"));

    if (isConnectionError) {
      return NextResponse.json(
        { error: "Service Unavailable", message: "Database connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to create idem" },
      { status: 500 }
    );
  }
}

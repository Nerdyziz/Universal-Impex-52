import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";

// ── GET /api/quote/[id] ──────────────────────────────────────────
// Returns quote details for the admin to review
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const quote = await Quote.findById(id).lean();

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // Serialize _id fields
    quote._id = quote._id.toString();
    quote.items = quote.items.map((item) => ({
      ...item,
      _id: item._id?.toString() || "",
      productId: item.productId?.toString() || "",
    }));

    return NextResponse.json({ success: true, quote });
  } catch (err) {
    console.error("Quote GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

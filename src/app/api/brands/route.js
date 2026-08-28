import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";

const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
};

// GET /api/brands — fetch all brands (optionally filter by mainCategory or search)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const mainCategory = searchParams.get("mainCategory");

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (mainCategory) {
      filter.mainCategory = mainCategory;
    }

    const brands = await Brand.find(filter).sort({ createdAt: 1 }).lean();

    return NextResponse.json({ success: true, data: brands }, { status: 200, headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/brands — create a new brand
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const brand = await Brand.create(body);

    return NextResponse.json(
      { success: true, data: brand },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


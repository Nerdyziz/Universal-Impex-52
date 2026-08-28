import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Brand from "@/models/Brand";

const CARD_FIELDS = "_id name slug subtitle brand category image price moq sku featured createdAt";
const PUBLIC_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
};

// GET /api/products — fetch products with optional pagination
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const mainCategory = searchParams.get("mainCategory");
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "0", 10);
    const fields = searchParams.get("fields");

    let filter = {};

    if (category && category !== "all") {
      // Support hierarchical category filtering — match exact or children
      filter.category = { $regex: `^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: "i" };
    }

    if (brand) {
      filter.brand = { $regex: `^${brand}$`, $options: "i" };
    }

    // Filter by main category — find all brands in that category, then filter products
    if (mainCategory && !brand) {
      const brandsInCategory = await Brand.find({ mainCategory }).select("name").lean();
      const brandNames = brandsInCategory.map((b) => b.name);
      if (brandNames.length > 0) {
        filter.brand = { $in: brandNames };
      } else {
        // No brands in this category, return empty
        return NextResponse.json({
          success: true,
          data: [],
          pagination: page > 0 && limit > 0 ? { page, limit, total: 0, totalPages: 0 } : undefined,
        }, { status: 200, headers: PUBLIC_CACHE_HEADERS });
      }
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subtitle: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // If page & limit are provided, paginate; otherwise return all (backwards-compatible)
    if (page > 0 && limit > 0) {
      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
      let query = Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      if (fields === "card") query = query.select(CARD_FIELDS);
      const products = await query.lean();

      return NextResponse.json({
        success: true,
        data: products,
        pagination: { page, limit, total, totalPages },
      }, { status: 200, headers: PUBLIC_CACHE_HEADERS });
    }

    let query = Product.find(filter).sort({ createdAt: -1 });
    if (fields === "card") query = query.select(CARD_FIELDS);
    const products = await query.lean();
    return NextResponse.json({ success: true, data: products }, { status: 200, headers: PUBLIC_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper to generate a slug string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// POST /api/products — create a new product
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const incomingName = (body.name || "").trim();
    const incomingSku = (body.sku || "").trim();

    if (!incomingName) {
      return NextResponse.json(
        { success: false, error: "Product name is required" },
        { status: 400 }
      );
    }

    // Find ALL products with the same name (case-insensitive)
    const escapedName = incomingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingProducts = await Product.find({
      name: { $regex: `^${escapedName}$`, $options: "i" },
    });

    if (existingProducts.length > 0) {
      // Check if any existing product has the same SKU
      const skuMatch = existingProducts.some(
        (p) => (p.sku || "").trim().toLowerCase() === incomingSku.toLowerCase()
      );

      if (skuMatch) {
        return NextResponse.json(
          { success: false, error: "A product with this name and SKU already exists" },
          { status: 400 }
        );
      }

      // Different SKU — allowed. Generate a unique slug with SKU appended.
      if (!body.slug) {
        body.slug = incomingSku
          ? slugify(incomingName + "-" + incomingSku)
          : slugify(incomingName + "-" + Date.now());
      }
    } else {
      // No product with this name — generate normal slug
      if (!body.slug) {
        body.slug = slugify(incomingName);
      }
    }

    // Final safety: ensure slug is unique in DB
    const slugExists = await Product.findOne({ slug: body.slug });
    if (slugExists) {
      body.slug = body.slug + "-" + Date.now();
    }

    const product = await Product.create(body);

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

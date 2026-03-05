import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// POST /api/products/bulk — create multiple products in one request
export async function POST(request) {
  try {
    await dbConnect();

    const { products } = await request.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "products array is required" },
        { status: 400 }
      );
    }

    const success = [];
    const errors = [];

    // Pre-fetch all existing product names and slugs for fast lookups
    const allExisting = await Product.find({}, "name sku slug").lean();
    const existingByName = {};
    const usedSlugs = new Set();

    for (const p of allExisting) {
      const key = (p.name || "").trim().toLowerCase();
      if (!existingByName[key]) existingByName[key] = [];
      existingByName[key].push(p);
      if (p.slug) usedSlugs.add(p.slug);
    }

    // Track slugs created in this batch to avoid collisions within the same import
    const batchSlugs = new Set();

    for (let i = 0; i < products.length; i++) {
      const body = { ...products[i] };
      const incomingName = (body.name || "").trim();
      const incomingSku = (body.sku || "").trim();

      if (!incomingName) {
        errors.push({ index: i + 1, name: "(empty)", error: "Name is required" });
        continue;
      }

      if (!body.category) {
        errors.push({ index: i + 1, name: incomingName, error: "Category is required" });
        continue;
      }

      const nameKey = incomingName.toLowerCase();
      const existingProducts = existingByName[nameKey] || [];

      if (existingProducts.length > 0) {
        const skuMatch = existingProducts.some(
          (p) => (p.sku || "").trim().toLowerCase() === incomingSku.toLowerCase()
        );
        if (skuMatch) {
          errors.push({
            index: i + 1,
            name: incomingName,
            error: "A product with this name and SKU already exists",
          });
          continue;
        }
        // Different SKU — generate slug with SKU
        if (!body.slug) {
          body.slug = incomingSku
            ? slugify(incomingName + "-" + incomingSku)
            : slugify(incomingName + "-" + Date.now());
        }
      } else {
        if (!body.slug) {
          body.slug = slugify(incomingName);
        }
      }

      // Ensure slug uniqueness against DB + batch
      while (usedSlugs.has(body.slug) || batchSlugs.has(body.slug)) {
        body.slug = body.slug + "-" + Date.now();
      }

      try {
        const product = await Product.create(body);
        success.push(product);

        // Update lookup caches
        if (!existingByName[nameKey]) existingByName[nameKey] = [];
        existingByName[nameKey].push({ name: incomingName, sku: incomingSku, slug: body.slug });
        usedSlugs.add(body.slug);
        batchSlugs.add(body.slug);
      } catch (err) {
        errors.push({
          index: i + 1,
          name: incomingName,
          error: err.code === 11000 ? "Duplicate slug" : err.message,
        });
      }
    }

    return NextResponse.json(
      { success: true, created: success, errors },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

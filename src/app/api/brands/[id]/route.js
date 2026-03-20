import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Product from "@/models/Product";

// Function to flatten tree
function flattenCategories(nodes, prefix = "") {
  const paths = [];
  for (const node of nodes || []) {
    const nodeName = typeof node === "string" ? node : node.name;
    const path = prefix ? `${prefix} > ${nodeName}` : nodeName;
    paths.push(path);
    if (typeof node !== "string" && node.children?.length) {
      paths.push(...flattenCategories(node.children, path));
    }
  }
  return paths;
}

// GET /api/brands/[id] — fetch a single brand
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: brand }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/brands/[id] — update a brand
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const oldBrand = await Brand.findById(id);
    if (!oldBrand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    // Cascade delete products if categories are removed
    if (body.categories && Array.isArray(body.categories)) {
      const oldPaths = flattenCategories(oldBrand.categories).map(p => p.toLowerCase());
      const newPaths = flattenCategories(body.categories).map(p => p.toLowerCase());

      const removedPaths = oldPaths.filter(p => !newPaths.includes(p));
      
      if (removedPaths.length > 0) {
        const orConditions = removedPaths.map(path => {
          // Escape string for regex
          const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return {
            brand: oldBrand.name,
            $or: [
              { category: { $regex: new RegExp(`^${escapedPath}$`, "i") } },
              { category: { $regex: new RegExp(`^${escapedPath} >`, "i") } }
            ]
          };
        });
        
        await Product.deleteMany({ $or: orConditions });
      }
    }

    const brand = await Brand.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: brand }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/brands/[id] — delete a brand
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return NextResponse.json(
        { success: false, error: "Brand not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: {}, message: "Brand deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

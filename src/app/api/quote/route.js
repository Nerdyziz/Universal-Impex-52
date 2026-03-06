import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Quote from "@/models/Quote";

// ── POST /api/quote ──────────────────────────────────────────────
// Saves the quote request to DB and emails admin with inquiry link
export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, quantity, customerName, customerEmail, notes, cartItems } = body;

    if (!customerName || !customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    let items = [];

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
      const productIds = cartItems.map((ci) => ci.productId);
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      for (const ci of cartItems) {
        const prod = products.find((p) => p._id.toString() === ci.productId);
        if (prod) {
          items.push({
            productId: prod._id,
            name: prod.name,
            brand: prod.brand || "",
            category: prod.category || "",
            image: prod.image || "/fp1.png",
            quantity: ci.quantity || 1,
            unitPrice: 0,
          });
        }
      }
    } else if (productId && quantity) {
      const product = await Product.findById(productId).lean();
      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }
      items.push({
        productId: product._id,
        name: product.name,
        brand: product.brand || "",
        category: product.category || "",
        image: product.image || "/fp1.png",
        quantity,
        unitPrice: 0,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "No products specified" },
        { status: 400 }
      );
    }

    // Generate quote number
    const quoteNumber = `QT-${Date.now().toString(36).toUpperCase()}`;

    // Save quote to database
    const quote = await Quote.create({
      quoteNumber,
      customerName,
      customerEmail,
      notes: notes || "",
      items,
      status: "pending",
    });

    // Build admin inquiry link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const adminLink = `${siteUrl}/admin/quotes/${quote._id}`;

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP working");

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    // Build product rows for admin email
    const productRows = items
      .map(
        (it) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${it.name}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">${it.brand || "-"}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-align: center; font-weight: bold; font-size: 14px;">${it.quantity}</td>
        </tr>`
      )
      .join("");

    // Send email to admin with inquiry link
    await transporter.sendMail({
      from: `"Universal Impex 52" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Quote Request: ${quoteNumber} — ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf6ef; padding: 0;">
          <div style="background: #1a1a1a; padding: 30px 40px;">
            <h1 style="color: #EEBA2B; font-size: 22px; margin: 0;">New Quote Inquiry</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px 0;">Quote ${quoteNumber}</h2>
            <p style="color: #666; font-size: 14px; margin: 0 0 4px 0;"><strong>Customer:</strong> ${customerName}</p>
            <p style="color: #666; font-size: 14px; margin: 0 0 4px 0;"><strong>Email:</strong> ${customerEmail}</p>
            ${notes ? `<p style="color: #666; font-size: 14px; margin: 0 0 4px 0;"><strong>Notes:</strong> ${notes}</p>` : ""}
            <p style="color: #666; font-size: 14px; margin: 0 0 24px 0;"><strong>Items:</strong> ${items.length}</p>
            
            <div style="background: #ffffff; border: 1px solid #e8dcc8; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #1a1a1a;">
                    <th style="padding: 12px; text-align: left; color: #EEBA2B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
                    <th style="padding: 12px; text-align: left; color: #EEBA2B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Brand</th>
                    <th style="padding: 12px; text-align: center; color: #EEBA2B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${productRows}
                </tbody>
              </table>
            </div>

            <div style="text-align: center;">
              <a href="${adminLink}" style="display: inline-block; background: #EEBA2B; color: #1a1a1a; padding: 14px 32px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
                Review &amp; Send Quotation
              </a>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              Click the button above to open the inquiry, enter prices, and send the quotation PDF to the customer.
            </p>
          </div>
          <div style="background: #1a1a1a; padding: 20px 40px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0;">Universal Impex 52 | Supplier. Importer. Exporter</p>
          </div>
        </div>
      `,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: `"Universal Impex 52" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Quote Request Received — ${quoteNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf6ef; padding: 0;">
          <div style="background: #1a1a1a; padding: 30px 40px;">
            <h1 style="color: #EEBA2B; font-size: 22px; margin: 0;">Universal Impex 52</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px 0;">Thank You, ${customerName}!</h2>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              We've received your quote request for <strong>${items.length} item${items.length > 1 ? "s" : ""}</strong>.
              Our team is reviewing your inquiry and will send you a detailed quotation shortly.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
              <strong>Reference:</strong> ${quoteNumber}
            </p>
            <p style="color: #666; font-size: 13px; line-height: 1.6;">
              If you have any urgent questions, feel free to reach out to us at info@universalimpex52.com or +91 98901 53052.
            </p>
          </div>
          <div style="background: #1a1a1a; padding: 20px 40px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px 0;">Universal Impex 52 | Supplier. Importer. Exporter</p>
            <p style="color: #EEBA2B; font-size: 12px; margin: 0;">info@universalimpex52.com | +91 98901 53052</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Quote request submitted successfully" });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit quote request" },
      { status: 500 }
    );
  }
}

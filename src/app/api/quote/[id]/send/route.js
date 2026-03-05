import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import connectDB from "@/lib/mongodb";
import Quote from "@/models/Quote";
import fs from "fs";
import path from "path";

// ── Color helpers ────────────────────────────────────────────────
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return rgb(r, g, b);
};

const fmtPrice = (n) =>
  `Rs.${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ── Build PDF buffer using letterhead template ───────────────────
async function generateQuotePDF({ items, customerName, customerEmail, notes, quoteNumber }) {
  // ── Load letterhead PDF as template ──
  const letterheadPath = path.join(process.cwd(), "public", "letterhead.pdf");
  const letterheadBytes = fs.readFileSync(letterheadPath);
  const letterheadPdf = await PDFDocument.load(letterheadBytes);

  const pdfDoc = await PDFDocument.create();

  // Embed the letterhead page for reuse on every page
  const [embeddedLetterhead] = await pdfDoc.embedPdf(letterheadPdf, [0]);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const pageW = 595.28;
  const pageH = 841.89;

  const quoteDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const black = rgb(0, 0, 0);
  const gray = hexToRgb("#666666");
  const white = rgb(1, 1, 1);
  const yellow = hexToRgb("#FFFF00");
  const lightYellow = hexToRgb("#FFFFF0");

  const margin = 40;
  const rightEdge = pageW - margin;
  const contentWidth = rightEdge - margin;

  // How far from the top the letterhead header occupies (content starts below this)
  const letterheadTopMargin = 200;
  // How far from the bottom the letterhead footer occupies
  const letterheadBottomMargin = 60;

  // ── Helper: create a new page with letterhead background ──
  const createPage = () => {
    const page = pdfDoc.addPage([pageW, pageH]);
    // Draw the letterhead as background (full page)
    page.drawPage(embeddedLetterhead, {
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
    });
    return page;
  };

  // ══════════════════════════════════════════════════════════════
  // FIRST PAGE
  // ══════════════════════════════════════════════════════════════
  let page = createPage();
  let y = pageH - letterheadTopMargin;

  // ══════════════════════════════════════════════════════════════
  // QUOTATION TITLE
  // ══════════════════════════════════════════════════════════════
  const titleText = "Quotation";
  const titleW = fontBold.widthOfTextAtSize(titleText, 18);
  page.drawText(titleText, { x: (pageW - titleW) / 2, y, size: 18, font: fontBold, color: black });
  page.drawLine({ start: { x: (pageW - titleW) / 2, y: y - 3 }, end: { x: (pageW + titleW) / 2, y: y - 3 }, thickness: 1, color: black });

  // Ref No & Date row
  y -= 25;
  page.drawText(`Ref No: ${quoteNumber}`, { x: margin, y, size: 9, font: fontRegular, color: black });
  const dateStr = `Date: ${quoteDate}`;
  const dateW = fontRegular.widthOfTextAtSize(dateStr, 9);
  page.drawText(dateStr, { x: rightEdge - dateW, y, size: 9, font: fontRegular, color: black });

  // ══════════════════════════════════════════════════════════════
  // KIND ATTN / DEAR SIR
  // ══════════════════════════════════════════════════════════════
  y -= 25;
  page.drawText("Kind Attn:", { x: margin, y, size: 10, font: fontBold, color: black });
  page.drawLine({ start: { x: margin, y: y - 2 }, end: { x: margin + 60, y: y - 2 }, thickness: 0.5, color: black });
  y -= 16;
  page.drawText(customerName, { x: margin + 10, y, size: 9, font: fontRegular, color: black });
  page.drawText(customerEmail, { x: margin + 10, y: y - 12, size: 8, font: fontRegular, color: gray });

  y -= 30;
  page.drawText("Dear Sir,", { x: margin, y, size: 10, font: fontRegular, color: black });
  y -= 18;
  page.drawText("With reference to your enquiry for Above, we are pleased to place our best offer as below:", {
    x: margin, y, size: 9, font: fontRegular, color: black,
  });

  // ══════════════════════════════════════════════════════════════
  // TABLE HEADER
  // ══════════════════════════════════════════════════════════════
  y -= 25;
  const tableX = margin;
  const tableW = contentWidth;
  const colWidths = [30, 180, 45, 80, 45, 70, 70];
  const colLabels = ["Sr.", "Product /Description", "Qty", "MAKE", "UOM", "Unit Rate\nIn Rs.", "Total Rate\nIn Rs."];
  const headerH = 28;

  // Reusable: draw table header on any page
  const drawTableHeader = (pg, yPos) => {
    pg.drawRectangle({ x: tableX, y: yPos - headerH, width: tableW, height: headerH, color: yellow, borderColor: black, borderWidth: 0.5 });
    let cx = tableX;
    for (let i = 0; i < colLabels.length; i++) {
      if (i > 0) {
        pg.drawLine({ start: { x: cx, y: yPos }, end: { x: cx, y: yPos - headerH }, thickness: 0.5, color: black });
      }
      const lines = colLabels[i].split("\n");
      if (lines.length === 1) {
        const tw = fontBold.widthOfTextAtSize(lines[0], 7);
        pg.drawText(lines[0], { x: cx + (colWidths[i] - tw) / 2, y: yPos - 16, size: 7, font: fontBold, color: black });
      } else {
        const tw1 = fontBold.widthOfTextAtSize(lines[0], 7);
        const tw2 = fontBold.widthOfTextAtSize(lines[1], 7);
        pg.drawText(lines[0], { x: cx + (colWidths[i] - tw1) / 2, y: yPos - 12, size: 7, font: fontBold, color: black });
        pg.drawText(lines[1], { x: cx + (colWidths[i] - tw2) / 2, y: yPos - 22, size: 7, font: fontBold, color: black });
      }
      cx += colWidths[i];
    }
  };

  drawTableHeader(page, y);
  y -= headerH;

  // ══════════════════════════════════════════════════════════════
  // TABLE ROWS — one per product (multi-page with letterhead)
  // ══════════════════════════════════════════════════════════════
  const rowH = 24;
  let grandTotal = 0;

  // Helper: add a new page with letterhead + table header continuation
  const addTablePage = () => {
    const newPage = createPage();
    let ny = pageH - letterheadTopMargin;
    newPage.drawText(`${quoteNumber} (continued)`, { x: margin, y: ny, size: 8, font: fontItalic, color: gray });
    ny -= 20;
    drawTableHeader(newPage, ny);
    ny -= headerH;
    return { page: newPage, y: ny };
  };

  // Minimum Y before we need a new page (leave room for letterhead footer)
  const minY = letterheadBottomMargin + 120;

  for (let idx = 0; idx < items.length; idx++) {
    const { name, brand, quantity, unitPrice } = items[idx];
    const lineTotal = unitPrice * quantity;
    grandTotal += lineTotal;

    if (y - rowH < minY) {
      const np = addTablePage();
      page = np.page;
      y = np.y;
    }

    const rowBg = idx % 2 === 0 ? white : lightYellow;
    page.drawRectangle({ x: tableX, y: y - rowH, width: tableW, height: rowH, color: rowBg, borderColor: black, borderWidth: 0.5 });

    let cx = tableX;
    const cellValues = [
      String(idx + 1),
      name.length > 30 ? name.substring(0, 28) + ".." : name,
      String(quantity),
      (brand || "-").length > 12 ? (brand || "-").substring(0, 10) + ".." : (brand || "-"),
      "Pcs",
      fmtPrice(unitPrice),
      fmtPrice(lineTotal),
    ];

    for (let i = 0; i < cellValues.length; i++) {
      if (i > 0) {
        page.drawLine({ start: { x: cx, y }, end: { x: cx, y: y - rowH }, thickness: 0.5, color: black });
      }
      const fontSize = 7;
      const font = i === 1 ? fontBold : fontRegular;
      const tw = font.widthOfTextAtSize(cellValues[i], fontSize);
      let textX;
      if (i >= 5) {
        textX = cx + colWidths[i] - tw - 4;
      } else {
        textX = cx + (colWidths[i] - tw) / 2;
      }
      page.drawText(cellValues[i], { x: textX, y: y - rowH + 8, size: fontSize, font, color: black });
      cx += colWidths[i];
    }

    y -= rowH;
  }

  // Empty filler rows
  const emptyRows = Math.max(2, 8 - items.length);
  for (let i = 0; i < emptyRows; i++) {
    if (y - rowH < minY) break;
    page.drawRectangle({ x: tableX, y: y - rowH, width: tableW, height: rowH, color: white, borderColor: black, borderWidth: 0.5 });
    let cx = tableX;
    for (let j = 0; j < colWidths.length; j++) {
      if (j > 0) {
        page.drawLine({ start: { x: cx, y }, end: { x: cx, y: y - rowH }, thickness: 0.5, color: black });
      }
      cx += colWidths[j];
    }
    y -= rowH;
  }

  // Grand total row
  if (y - 24 < minY) {
    const np = addTablePage();
    page = np.page;
    y = np.y;
  }
  const totalRowH = 24;
  page.drawRectangle({ x: tableX, y: y - totalRowH, width: tableW, height: totalRowH, color: yellow, borderColor: black, borderWidth: 0.5 });
  page.drawText("GRAND TOTAL", { x: tableX + 10, y: y - totalRowH + 8, size: 9, font: fontBold, color: black });
  const grandTotalStr = fmtPrice(grandTotal);
  const gtW = fontBold.widthOfTextAtSize(grandTotalStr, 9);
  page.drawText(grandTotalStr, { x: rightEdge - gtW - 4, y: y - totalRowH + 8, size: 9, font: fontBold, color: black });
  y -= totalRowH;

  // ══════════════════════════════════════════════════════════════
  // TERMS & CONDITIONS
  // ══════════════════════════════════════════════════════════════
  if (y - 220 < letterheadBottomMargin) {
    page = createPage();
    y = pageH - letterheadTopMargin;
  }
  y -= 20;
  const tcHeaderH = 20;
  page.drawRectangle({ x: tableX, y: y - tcHeaderH, width: tableW, height: tcHeaderH, color: yellow, borderColor: black, borderWidth: 0.5 });
  const tcTitle = "TERMS & CONDITIONS";
  const tcTW = fontBold.widthOfTextAtSize(tcTitle, 9);
  page.drawText(tcTitle, { x: tableX + (tableW - tcTW) / 2, y: y - tcHeaderH + 6, size: 9, font: fontBold, color: black });
  y -= tcHeaderH;

  const tcItems = [
    ["PRICE BASIS", "Ex-Godown"],
    ["GST", "Extra as applicable"],
    ["TERMS OF PAYMENT", "Against Delivery"],
    ["PACKAGING CHARGES", "Extra if applicable"],
    ["FREIGHT", "Extra"],
    ["OCTRAI", "Extra"],
    ["INSURANCE", "Extra"],
    ["DELIVERY", "Immediate / As per stock availability"],
    ["INSPECTION", "At our godown before dispatch"],
    ["VALIDITY", "Subject to prior sale"],
  ];
  const tcRowH = 16;
  for (const [label, val] of tcItems) {
    page.drawRectangle({ x: tableX, y: y - tcRowH, width: tableW, height: tcRowH, borderColor: black, borderWidth: 0.3, color: white });
    page.drawLine({ start: { x: tableX + tableW / 2, y }, end: { x: tableX + tableW / 2, y: y - tcRowH }, thickness: 0.3, color: black });
    const lW = fontBold.widthOfTextAtSize(label, 7);
    page.drawText(label, { x: tableX + (tableW / 2 - lW) / 2, y: y - tcRowH + 5, size: 7, font: fontBold, color: black });
    page.drawText(val, { x: tableX + tableW / 2 + 10, y: y - tcRowH + 5, size: 7, font: fontRegular, color: black });
    y -= tcRowH;
  }

  y -= 6;
  page.drawText("GST Number: 27AALFU5481L1ZO", { x: tableX, y, size: 7, font: fontRegular, color: black });
  y -= 12;
  page.drawText("Pan Number: AALFU5481L", { x: tableX, y, size: 7, font: fontRegular, color: black });

  // ══════════════════════════════════════════════════════════════
  // NOTES
  // ══════════════════════════════════════════════════════════════
  if (notes) {
    y -= 16;
    page.drawText("Notes:", { x: tableX, y, size: 8, font: fontBold, color: black });
    y -= 12;
    const words = notes.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (fontRegular.widthOfTextAtSize(test, 7) > contentWidth) {
        page.drawText(line, { x: tableX, y, size: 7, font: fontRegular, color: gray });
        y -= 10;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) page.drawText(line, { x: tableX, y, size: 7, font: fontRegular, color: gray });
  }

  // ══════════════════════════════════════════════════════════════
  // CLOSING + SIGNATURE
  // ══════════════════════════════════════════════════════════════
  if (y - 120 < letterheadBottomMargin) {
    page = createPage();
    y = pageH - letterheadTopMargin;
  }
  y -= 20;
  page.drawText("We now look forward to receive your most valuable order.", { x: tableX, y, size: 8, font: fontRegular, color: black });
  y -= 12;
  page.drawText("Assuring you our best attention at all times.", { x: tableX, y, size: 8, font: fontRegular, color: black });
  y -= 20;
  page.drawText("Regards,", { x: tableX, y, size: 9, font: fontBold, color: black });
  y -= 14;
  page.drawText("For UNIVERSAL IMPEX 52", { x: tableX, y, size: 9, font: fontBold, color: black });
  y -= 14;
  page.drawText("Mohammed F Lodhger", { x: tableX, y, size: 9, font: fontBold, color: black });
  y -= 14;
  page.drawText("Cell: 9869113692", { x: tableX, y, size: 8, font: fontRegular, color: black });
  y -= 12;
  page.drawText("Email: ui52jnpt@gmail.com / mohammedlodhger@gmail.com", { x: tableX, y, size: 8, font: fontRegular, color: hexToRgb("#0000FF") });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ── POST /api/quote/[id]/send ────────────────────────────────────
// Admin submits prices → generate PDF → email customer → mark quote as sent
export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { prices } = body;

    if (!prices || typeof prices !== "object") {
      return NextResponse.json(
        { success: false, error: "Prices are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const quote = await Quote.findById(id);
    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    if (quote.status === "sent") {
      return NextResponse.json(
        { success: false, error: "This quotation has already been sent" },
        { status: 400 }
      );
    }

    // Update prices on each item
    for (const item of quote.items) {
      const itemId = item._id.toString();
      if (prices[itemId] !== undefined) {
        item.unitPrice = Number(prices[itemId]) || 0;
      }
    }

    // Validate all prices are filled
    const missingPrices = quote.items.filter((it) => !it.unitPrice || it.unitPrice <= 0);
    if (missingPrices.length > 0) {
      return NextResponse.json(
        { success: false, error: `Please enter a price for all ${missingPrices.length} item(s)` },
        { status: 400 }
      );
    }

    // Generate PDF with admin-entered prices
    const pdfBuffer = await generateQuotePDF({
      items: quote.items.map((it) => ({
        name: it.name,
        brand: it.brand,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      notes: quote.notes,
      quoteNumber: quote.quoteNumber,
    });

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Calculate totals for email
    let grandTotal = 0;
    const emailRows = quote.items
      .map((it) => {
        const lt = it.unitPrice * it.quantity;
        grandTotal += lt;
        return `
        <tr>
          <td style="padding: 6px 0; color: #888;">${it.name}</td>
          <td style="padding: 6px 0; text-align: center;">${it.quantity}</td>
          <td style="padding: 6px 0; text-align: right;">\u20B9${it.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
          <td style="padding: 6px 0; text-align: right; font-weight: bold;">\u20B9${lt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        </tr>`;
      })
      .join("");

    const subjectLine =
      quote.items.length === 1
        ? `Your Quotation -- ${quote.items[0].name}`
        : `Your Quotation -- ${quote.items.length} Products`;

    // Send email to customer with PDF
    await transporter.sendMail({
      from: `"Universal Impex 52" <${process.env.SMTP_USER}>`,
      to: quote.customerEmail,
      subject: subjectLine,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf6ef; padding: 0;">
          <div style="background: #1a1a1a; padding: 30px 40px;">
            <h1 style="color: #EEBA2B; font-size: 22px; margin: 0;">Universal Impex 52</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px 0;">Thank You, ${quote.customerName}!</h2>
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
              We've prepared a detailed quotation for you based on your inquiry.
              Please find the PDF quotation attached to this email.
            </p>
            
            <div style="background: #ffffff; border: 1px solid #e8dcc8; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 16px 0; border-bottom: 2px solid #EEBA2B; padding-bottom: 8px;">Order Summary</h3>
              <table style="width: 100%; font-size: 14px; color: #333; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <th style="padding: 8px 0; text-align: left; color: #888; font-weight: normal;">Product</th>
                  <th style="padding: 8px 0; text-align: center; color: #888; font-weight: normal;">Qty</th>
                  <th style="padding: 8px 0; text-align: right; color: #888; font-weight: normal;">Unit Price</th>
                  <th style="padding: 8px 0; text-align: right; color: #888; font-weight: normal;">Total</th>
                </tr>
                ${emailRows}
                <tr style="border-top: 2px solid #EEBA2B;">
                  <td colspan="3" style="padding: 12px 0 6px; color: #1a1a1a; font-weight: bold; font-size: 16px;">Grand Total</td>
                  <td style="padding: 12px 0 6px; text-align: right; font-weight: bold; font-size: 16px; color: #EEBA2B;">\u20B9${grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </div>

            <p style="color: #666; font-size: 13px; line-height: 1.6;">
              A member of our sales team will be in touch within 24 hours to discuss your requirements further.
              If you have any urgent questions, feel free to reach out directly.
            </p>
          </div>
          <div style="background: #1a1a1a; padding: 20px 40px; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 0 0 4px 0;">Universal Impex 52 | Supplier. Importer. Exporter</p>
            <p style="color: #EEBA2B; font-size: 12px; margin: 0;">ui52jnpt@gmail.com | +91 98691 13692</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Quotation-${quote.quoteNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // Mark quote as sent and save updated prices
    quote.status = "sent";
    await quote.save();

    return NextResponse.json({ success: true, message: "Quotation sent to customer" });
  } catch (err) {
    console.error("Quote send error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send quotation" },
      { status: 500 }
    );
  }
}

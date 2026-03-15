import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── POST /api/contact ─────────────────────────────────────────────
// Unified endpoint for Contact page form & Footer "Get in Touch" form
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message, source } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

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

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    const formSource = source === "footer" ? "Footer — Get in Touch" : "Contact Page";

    // Build optional fields HTML
    const optionalRows = [
      company && `<tr><td style="padding:8px 12px;color:#999;font-size:13px;width:120px;vertical-align:top;">Company</td><td style="padding:8px 12px;color:#333;font-size:14px;">${company}</td></tr>`,
      phone && `<tr><td style="padding:8px 12px;color:#999;font-size:13px;width:120px;vertical-align:top;">Phone</td><td style="padding:8px 12px;color:#333;font-size:14px;">${phone}</td></tr>`,
      subject && `<tr><td style="padding:8px 12px;color:#999;font-size:13px;width:120px;vertical-align:top;">Subject</td><td style="padding:8px 12px;color:#333;font-size:14px;">${subject}</td></tr>`,
    ]
      .filter(Boolean)
      .join("");

    // Send email to admin
    await transporter.sendMail({
      from: `"Universal Impex 52" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact: ${subject || "General Inquiry"} — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#faf6ef;padding:0;">
          <div style="background:#1a1a1a;padding:30px 40px;">
            <h1 style="color:#EEBA2B;font-size:22px;margin:0;">New Contact Message</h1>
            <p style="color:#888;font-size:12px;margin:6px 0 0 0;">via ${formSource}</p>
          </div>
          <div style="padding:32px 40px;">
            <div style="background:#fff;border:1px solid #e8dcc8;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 12px;color:#999;font-size:13px;width:120px;vertical-align:top;">Name</td><td style="padding:8px 12px;color:#333;font-size:14px;font-weight:bold;">${name}</td></tr>
                <tr><td style="padding:8px 12px;color:#999;font-size:13px;width:120px;vertical-align:top;">Email</td><td style="padding:8px 12px;color:#333;font-size:14px;"><a href="mailto:${email}" style="color:#EEBA2B;">${email}</a></td></tr>
                ${optionalRows}
              </table>
            </div>

            <div style="background:#fff;border:1px solid #e8dcc8;border-radius:8px;padding:16px 20px;">
              <p style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px 0;">Message</p>
              <p style="color:#333;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
            </div>

            <div style="text-align:center;margin-top:24px;">
              <a href="mailto:${email}?subject=Re: ${subject || "Your Inquiry"} — Universal Impex 52" style="display:inline-block;background:#EEBA2B;color:#1a1a1a;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;border-radius:4px;">
                Reply to ${name}
              </a>
            </div>
          </div>
          <div style="background:#1a1a1a;padding:20px 40px;text-align:center;">
            <p style="color:#888;font-size:12px;margin:0;">Universal Impex 52 | Supplier. Importer. Exporter</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send message" },
      { status: 500 }
    );
  }
}

import mongoose from "mongoose";

const QuoteItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  category: { type: String, default: "" },
  image: { type: String, default: "/fp1.png" },
  quantity: { type: Number, required: true, min: 1 },
  // Admin enters this price later
  unitPrice: { type: Number, default: 0 },
});

const QuoteSchema = new mongoose.Schema(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    notes: {
      type: String,
      default: "",
    },
    items: [QuoteItemSchema],
    status: {
      type: String,
      enum: ["pending", "sent"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);

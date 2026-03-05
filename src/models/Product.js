import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "/fp1.png",
    },
    specs: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
    details: {
      type: Map,
      of: String,
      default: {},
    },
    // details kept for backward compatibility but no longer used in UI
    moq: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Fallback: auto-generate slug from name if not already set by API
ProductSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);

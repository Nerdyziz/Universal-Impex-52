import mongoose from "mongoose";

// Recursive category tree: [{ name: "Engines", children: [{ name: "Turbos", children: [...] }] }]
// Using Mixed type because Mongoose doesn't support recursive sub-schemas natively.
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    number: {
      type: String,
      default: "",
    },
    imgs: {
      type: [String],
      default: [],
    },
    categories: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

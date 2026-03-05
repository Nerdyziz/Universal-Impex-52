import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    let product;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug }).lean();
    }

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const title = `${product.name}${product.brand ? ` — ${product.brand}` : ""}`;
    const description =
      product.description ||
      `${product.name}${product.subtitle ? ` — ${product.subtitle}` : ""}. ${product.brand ? `By ${product.brand}.` : ""} Available for B2B purchase with bulk pricing.`;

    return {
      title,
      description: description.slice(0, 160),
      openGraph: {
        title,
        description: description.slice(0, 160),
        url: `/products/${product.slug}`,
        type: "website",
        images: product.image && product.image !== "/fp1.png"
          ? [
              {
                url: product.image,
                width: 800,
                height: 600,
                alt: product.name,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: description.slice(0, 160),
        images: product.image && product.image !== "/fp1.png"
          ? [product.image]
          : undefined,
      },
      alternates: {
        canonical: `/products/${product.slug}`,
      },
    };
  } catch {
    return {
      title: "Product",
      description: "View product details and request a quote.",
    };
  }
}

export default function ProductSlugLayout({ children }) {
  return children;
}

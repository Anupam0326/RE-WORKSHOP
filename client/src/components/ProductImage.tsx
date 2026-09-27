/** Product photo with responsive sources, fixed aspect ratio (no layout shift) and a branded fallback. */

import { ReMark } from "@/components/BrandMark";
import { productImage, type Product } from "@/data/catalog";

type Props = {
  product: Pick<Product, "name" | "images">;
  sizes: string;
  index?: number;
  eager?: boolean;
  className?: string;
};

export function ProductImage({ product, sizes, index = 0, eager = false, className = "" }: Props) {
  const image = productImage(product, index);
  if (!image) {
    return (
      <div className={`product-fallback ${className}`} role="img" aria-label={`${product.name} — photo coming soon`}>
        <ReMark className="product-fallback__mark" />
        <span>{product.name}</span>
      </div>
    );
  }
  return (
    <img
      className={className}
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={index === 0 ? product.name : `${product.name} — photo ${index + 1}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : undefined}
    />
  );
}

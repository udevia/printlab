import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductClientView } from "./ProductClientView";

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="glass p-6 md:p-12 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery (Simplified for now) */}
          <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
            <Image
              src={product.images[0] || "https://placehold.co/800x800?text=No+Image"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details & Add to Cart Client Component */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{product.name}</h1>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-6">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="prose prose-invert mb-8 text-gray-300">
              <p>{product.description || "Un producto increíble, perfecto para personalizar a tu gusto."}</p>
            </div>

            <div className="mt-auto">
              {/* Client Component to handle state, quantities, and upload */}
              <ProductClientView product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

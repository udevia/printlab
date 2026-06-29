"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "./Button";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    categoryId: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "https://placehold.co/400x400?text=No+Image",
    });
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative flex flex-col glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          <Image
            src={product.images[0] || "https://placehold.co/400x400?text=No+Image"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Quick add to cart overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleAddToCart}
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Añadir rápido
            </Button>
          </div>
        </div>
        
        <div className="p-5 flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-white line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

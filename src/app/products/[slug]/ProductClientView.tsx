"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product } from "@prisma/client";

interface ProductClientViewProps {
  product: Product;
}

export function ProductClientView({ product }: ProductClientViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [customImage, setCustomImage] = useState<string>("");
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    // If it's customizable, ensure they uploaded an image (optional check, but good UX)
    if (product.isCustomizable && !customImage) {
      const confirm = window.confirm(
        "Este producto es personalizable. ¿Estás seguro de agregarlo al carrito sin subir un diseño?"
      );
      if (!confirm) return;
    }

    addItem({
      id: customImage ? `${product.id}-${customImage}` : product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "https://placehold.co/400x400?text=No+Image",
      customImage: customImage || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Cantidad</label>
        <div className="flex items-center gap-4 bg-zinc-950/50 w-fit rounded-xl border border-zinc-800 p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-lg font-bold text-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Uploader for Customization */}
      {product.isCustomizable && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Diseño para Sublimar
          </label>
          <ImageUploader onUpload={setCustomImage} />
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.3)] mt-4"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Añadir al Carrito - ${(product.price * quantity).toFixed(2)}
      </Button>
    </div>
  );
}

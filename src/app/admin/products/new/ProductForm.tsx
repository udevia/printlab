"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { createProduct } from "../../actions";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    if (!imageUrl) {
      setError("Debes subir al menos una imagen del producto.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string, 10),
      description: formData.get("description") as string,
      categoryId: formData.get("categoryId") as string,
      isCustomizable: formData.get("isCustomizable") === "on",
      images: [imageUrl]
    };

    const res = await createProduct(data);
    
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push("/admin/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre del Producto</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Precio ($)</label>
              <input 
                type="number" 
                name="price" 
                step="0.01"
                min="0"
                required 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
              <input 
                type="number" 
                name="stock" 
                min="0"
                defaultValue="10"
                required 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
            <select 
              name="categoryId" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
            <textarea 
              name="description" 
              rows={4}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
            />
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
            <input 
              type="checkbox" 
              name="isCustomizable"
              id="isCustomizable"
              defaultChecked
              className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="isCustomizable" className="text-sm font-medium text-white cursor-pointer">
              Es Personalizable (Sublimable)
              <p className="text-xs text-gray-500 font-normal">Permite al cliente subir un diseño antes de comprar.</p>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Imagen del Producto</label>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
            <ImageUploader onUpload={setImageUrl} />
            {imageUrl && (
              <p className="text-xs text-green-400 mt-2 text-center">Imagen subida correctamente</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Producto'}
        </button>
      </div>
    </form>
  );
}

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Productos</h1>
          <p className="text-gray-400">Catálogo de productos disponibles.</p>
        </div>
        <Link href="/admin/products/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categoría</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Precio</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-900/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                      <Image src={product.images[0] || "https://placehold.co/100x100"} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-gray-300">
                    {product.category.name}
                  </span>
                </td>
                <td className="p-4 text-white">${product.price.toFixed(2)}</td>
                <td className="p-4 text-gray-400">{product.stock} unds.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

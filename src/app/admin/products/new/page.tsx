import { prisma } from "@/lib/prisma";
import { ProductForm } from "./ProductForm";

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Añadir Nuevo Producto</h1>
        <p className="text-gray-400">Completa los detalles para agregar un producto al catálogo.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

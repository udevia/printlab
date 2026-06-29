import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  const products = await prisma.product.findMany({
    where: categorySlug ? {
      category: { slug: categorySlug }
    } : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Nuestro Catálogo</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explora nuestra amplia gama de productos listos para ser personalizados con tu diseño.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass p-6 rounded-2xl sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">Categorías</h2>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/products"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!categorySlug ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  Todas las categorías
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/products?category=${cat.slug}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${categorySlug === cat.slug ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="glass p-12 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
              <p className="text-gray-400 mb-6">
                No hay productos disponibles en esta categoría en este momento.
              </p>
              {categorySlug && (
                <Link href="/products" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Ver todos los productos
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

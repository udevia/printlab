import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";

// Forcing dynamic for now to always fetch fresh data, or we could revalidate
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch latest products and active categories
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  const categories = await prisma.category.findMany({
    take: 4,
    orderBy: { products: { _count: "desc" } }
  });

  const config = await prisma.storeConfig.findUnique({
    where: { id: "default" }
  });

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          {/* We use a gradient if there is no hero image, but normally we'd put an image here */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50 translate-y-1/3 -translate-x-1/3"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-indigo-500/30 text-indigo-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>La mejor calidad en sublimación</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl">
            {config?.heroTitle || "Diseña tu estilo, nosotros lo creamos"}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
            {config?.heroSubtitle || "Productos personalizados de alta calidad. Sube tu diseño y nosotros lo imprimimos en tazas, camisetas, gorras y más con colores vibrantes y duraderos."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 w-full sm:w-auto h-14 text-base px-8 rounded-full">
                Explorar Catálogo <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button size="lg" variant="glass" className="w-full sm:w-auto h-14 text-base px-8 rounded-full">
                Cómo Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Entrega Rápida", desc: "Producción express para que tengas tus productos en tiempo récord." },
            { icon: Sparkles, title: "Calidad Premium", desc: "Tintas y materiales de primera calidad que no se desvanecen." },
            { icon: ShieldCheck, title: "Pagos Seguros", desc: "Aceptamos Efectivo, Zelle y Pago Móvil con total seguridad." }
          ].map((feature, i) => (
            <div key={i} className="glass p-8 rounded-3xl flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 pt-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Últimos Productos</h2>
            <p className="text-gray-400">Descubre las novedades en nuestra tienda</p>
          </div>
          <Link href="/products" className="hidden md:flex text-indigo-400 hover:text-indigo-300 items-center gap-1 font-medium">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-zinc-800">
            <p className="text-gray-400 mb-4">Aún no hay productos en la tienda.</p>
            <p className="text-sm text-gray-500">Agrega productos desde el panel de administración para que aparezcan aquí.</p>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Ver todo el catálogo
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 pt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Explora por Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}>
                <div className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors text-center group cursor-pointer">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

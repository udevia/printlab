import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Settings } from "lucide-react";

export const metadata = {
  title: "Admin | PrintLab",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-black pt-16">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Panel Admin</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Órdenes
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
            <Package className="w-5 h-5" />
            Productos
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Categorías
          </Link>
          <Link href="/admin/config" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { createCategory } from "../actions";

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="md:col-span-1">
        <h2 className="text-xl font-bold text-white mb-4">Nueva Categoría</h2>
        <form action={createCategory} className="glass p-6 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
            <input 
              type="text" 
              name="name" 
              required 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              placeholder="Ej. Tazas Mágicas" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
            <textarea 
              name="description"
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              placeholder="Descripción breve..." 
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
            Guardar Categoría
          </button>
        </form>
      </div>

      {/* List */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold text-white mb-4">Categorías Existentes</h2>
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Productos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 font-medium text-white">{cat.name}</td>
                  <td className="p-4 text-gray-500 text-sm">{cat.slug}</td>
                  <td className="p-4 text-gray-400">{cat._count.products}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay categorías aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

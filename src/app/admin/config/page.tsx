import { prisma } from "@/lib/prisma";
import { updateStoreConfig } from "../actions";

export const dynamic = 'force-dynamic';

export default async function AdminConfigPage() {
  const config = await prisma.storeConfig.findUnique({
    where: { id: "default" }
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-gray-400">Personaliza la apariencia de tu tienda.</p>
      </div>

      <form action={updateStoreConfig} className="glass p-8 rounded-3xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Textos Principales (Hero)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Título Principal</label>
              <input 
                type="text" 
                name="heroTitle" 
                defaultValue={config?.heroTitle || "Diseña tu estilo, nosotros lo creamos"}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
              <p className="text-xs text-gray-500 mt-1">Este es el texto grande que aparece en la página de inicio.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subtítulo</label>
              <textarea 
                name="heroSubtitle" 
                rows={3}
                defaultValue={config?.heroSubtitle || "Productos personalizados de alta calidad. Sube tu diseño y nosotros lo imprimimos en tazas, camisetas, gorras y más con colores vibrantes y duraderos."}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-xl transition-colors">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

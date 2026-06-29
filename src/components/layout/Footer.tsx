"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Printer } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-zinc-800 bg-black/50 py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">PrintLab</h3>
          <p className="text-sm text-gray-400">
            Productos personalizados por sublimación. Diseña tu estilo, nosotros lo hacemos realidad.
          </p>
        </div>
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/products" className="hover:text-indigo-400 transition-colors">Catálogo</a></li>
            <li><a href="/faq" className="hover:text-indigo-400 transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="/contact" className="hover:text-indigo-400 transition-colors">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold text-white mb-4">Métodos de Pago</h4>
          <p className="text-sm text-gray-400">
            Aceptamos Efectivo (Bs, USD) y Pago Móvil.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PrintLab. Todos los derechos reservados.
      </div>
    </footer>
  );
}

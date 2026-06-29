"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { ShoppingCart, Menu, Printer, User } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function Header({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname();
  const { getTotalItems, openDrawer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for persisted cart items
  useEffect(() => setMounted(true), []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 w-full glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-xl">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              PrintLab
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Catálogo
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={openDrawer}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-white" />
            {mounted && getTotalItems() > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 w-4 h-4 bg-indigo-500 text-[10px] font-bold flex items-center justify-center rounded-full text-white"
              >
                {getTotalItems()}
              </motion.span>
            )}
          </button>
          
          <button className="md:hidden p-2 text-gray-300 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

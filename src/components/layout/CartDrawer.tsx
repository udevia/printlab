"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function CartDrawer() {
  const pathname = usePathname();
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Tu Carrito</h2>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
                    <Trash2 className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 font-medium">Tu carrito está vacío</p>
                  <button
                    onClick={closeDrawer}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                    <div className="relative w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image || "https://placehold.co/400x400?text=No+Image"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-white line-clamp-1">{item.name}</h3>
                          <p className="text-indigo-400 font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.customImage && (
                        <span className="text-xs text-green-400 mt-1 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                          Diseño personalizado adjunto
                        </span>
                      )}

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-zinc-950 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-zinc-400 hover:text-white disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 font-medium">Total</span>
                  <span className="text-xl font-bold text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

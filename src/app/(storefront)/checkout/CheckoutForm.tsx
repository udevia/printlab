"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CreditCard, Banknote, DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "PAGO_MOVIL",
    paymentRef: ""
  });

  useEffect(() => setMounted(true), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone, // Adding this to DB schema later or as part of address
          },
          address: formData.address,
          paymentMethod: formData.paymentMethod,
          paymentRef: formData.paymentRef || undefined,
          items: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            customImage: i.customImage
          }))
        })
      });

      if (!res.ok) throw new Error("Error al procesar el pedido");
      
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push("/");
      }, 5000);
      
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="glass p-12 rounded-3xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto min-h-[400px]">
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">¡Pedido Recibido!</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Gracias por tu compra, {formData.name}. Hemos recibido tu pedido y comenzaremos a procesarlo de inmediato.
        </p>
        <p className="text-sm text-gray-500 mb-8">Serás redirigido a la página de inicio en breve...</p>
        <Button onClick={() => router.push("/")} className="bg-indigo-600 hover:bg-indigo-700">
          Volver al Inicio
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass p-12 rounded-3xl text-center">
        <h2 className="text-xl font-bold text-white mb-4">Tu carrito está vacío</h2>
        <Button onClick={() => router.push("/products")}>Ir al catálogo</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2 space-y-8">
        <form id="checkout-form" onSubmit={handleSubmit} className="glass p-6 md:p-8 rounded-3xl space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Tus Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Nombre Completo</label>
                <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Correo Electrónico</label>
                <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="juan@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Teléfono</label>
                <Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+58 412 1234567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Dirección de Envío</label>
                <Input required name="address" value={formData.address} onChange={handleChange} placeholder="Avenida Principal, Caracas" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Método de Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${formData.paymentMethod === 'PAGO_MOVIL' ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}>
                <input type="radio" name="paymentMethod" value="PAGO_MOVIL" className="hidden" checked={formData.paymentMethod === 'PAGO_MOVIL'} onChange={handleChange} />
                <CreditCard className={`w-8 h-8 ${formData.paymentMethod === 'PAGO_MOVIL' ? 'text-indigo-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-white text-center">Pago Móvil</span>
              </label>
              
              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${formData.paymentMethod === 'EFECTIVO_USD' ? 'border-green-500 bg-green-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}>
                <input type="radio" name="paymentMethod" value="EFECTIVO_USD" className="hidden" checked={formData.paymentMethod === 'EFECTIVO_USD'} onChange={handleChange} />
                <DollarSign className={`w-8 h-8 ${formData.paymentMethod === 'EFECTIVO_USD' ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-white text-center">Efectivo USD</span>
              </label>

              <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-colors ${formData.paymentMethod === 'EFECTIVO_BS' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}>
                <input type="radio" name="paymentMethod" value="EFECTIVO_BS" className="hidden" checked={formData.paymentMethod === 'EFECTIVO_BS'} onChange={handleChange} />
                <Banknote className={`w-8 h-8 ${formData.paymentMethod === 'EFECTIVO_BS' ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-white text-center">Efectivo Bs</span>
              </label>
            </div>
            
            {formData.paymentMethod === 'PAGO_MOVIL' && (
              <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                <p className="text-sm text-indigo-200"><strong>Datos Pago Móvil:</strong></p>
                <p className="text-sm text-indigo-300">Banco: Banesco (0134)<br/>Tlf: 0412-1234567<br/>CI: V-12345678</p>
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Referencia de Pago</label>
                  <Input required name="paymentRef" value={formData.paymentRef} onChange={handleChange} placeholder="Ej. 123456" className="mt-1" />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="glass p-6 rounded-3xl sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>
          
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-gray-400">Cant: {item.quantity}</p>
                  <p className="text-sm font-bold text-indigo-400">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Envío</span>
              <span className="text-green-400 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-white">Total</span>
              <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
          </div>

          <Button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.3)] text-base"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Pedido'}
          </Button>
        </div>
      </div>
    </div>
  );
}

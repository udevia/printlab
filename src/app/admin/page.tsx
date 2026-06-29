import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Órdenes Recientes</h1>
        <p className="text-gray-400">Gestiona los pedidos de tus clientes.</p>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center border-dashed border border-zinc-800">
            <p className="text-gray-400">Aún no hay órdenes registradas.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="glass rounded-2xl overflow-hidden border border-zinc-800">
              {/* Order Header */}
              <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white">Orden #{order.id.slice(-6).toUpperCase()}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} a las {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xl font-bold text-indigo-400">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{order.paymentMethod} {order.paymentRef && `(Ref: ${order.paymentRef})`}</p>
                </div>
              </div>
              
              {/* Order Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Productos</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                      <div className="relative w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden">
                        <Image src={item.product.images[0] || "https://placehold.co/100x100"} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{item.product.name}</p>
                        <p className="text-sm text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                      </div>
                      {item.customImage && (
                        <div className="shrink-0 text-center">
                          <a 
                            href={item.customImage} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Ver Diseño
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Cliente</h4>
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50 space-y-2">
                    <p className="text-white font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-400">{order.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

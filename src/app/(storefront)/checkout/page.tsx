import { CheckoutForm } from "./CheckoutForm";

export const metadata = {
  title: "Checkout | PrintLab",
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-white">Finalizar Compra</h1>
        <p className="text-gray-400 mt-2">Completa tus datos para procesar el pedido.</p>
      </div>

      <CheckoutForm />
    </div>
  );
}

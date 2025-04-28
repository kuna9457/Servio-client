import { useCart } from '@/context/CartContext';
import { useRouteProtection } from '@/context/RouteProtectionContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart();
  const { setRouteValid } = useRouteProtection();
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    setRouteValid(true);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-l font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
            <Link
              href="/services"
              className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.service.image.replace('/Frontend', '')}
                      alt={item.service.category}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.service._id}</h3>
                    <p className="text-sm text-gray-500">{item.service.provider}</p>
                    <p className="text-primary font-semibold">₹{item.service.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.service._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total:</span>
                <span className="text-xl font-semibold text-gray-900">₹{getTotal()}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/payment"
                  onClick={handleProceedToCheckout}
                  className="flex-1 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal; 
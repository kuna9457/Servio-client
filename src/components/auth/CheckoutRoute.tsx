import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import ProtectedRoute from './ProtectedRoute';

interface CheckoutRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
}

const CheckoutRoute: React.FC<CheckoutRouteProps> = ({ children, requirePayment = false }) => {
  const router = useRouter();
  const { checkoutStarted, paymentCompleted } = useCheckout();

  useEffect(() => {
    // Check if user has started checkout
    if (!checkoutStarted) {
      router.push('/services');
      return;
    }

    // If payment is required but not completed
    if (requirePayment && !paymentCompleted) {
      router.push('/payment');
      return;
    }
  }, [checkoutStarted, paymentCompleted, requirePayment, router]);

  // If conditions are not met, don't render anything
  if (!checkoutStarted || (requirePayment && !paymentCompleted)) {
    return null;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default CheckoutRoute; 
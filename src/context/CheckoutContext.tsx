import React, { createContext, useContext, useState, useEffect } from 'react';

interface CheckoutContextType {
  checkoutStarted: boolean;
  paymentCompleted: boolean;
  startCheckout: () => void;
  completePayment: () => void;
  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    // Load state from localStorage on mount
    const savedCheckoutStarted = localStorage.getItem('checkoutStarted') === 'true';
    const savedPaymentCompleted = localStorage.getItem('paymentCompleted') === 'true';
    setCheckoutStarted(savedCheckoutStarted);
    setPaymentCompleted(savedPaymentCompleted);
  }, []);

  const startCheckout = () => {
    setCheckoutStarted(true);
    localStorage.setItem('checkoutStarted', 'true');
  };

  const completePayment = () => {
    setPaymentCompleted(true);
    localStorage.setItem('paymentCompleted', 'true');
  };

  const resetCheckout = () => {
    setCheckoutStarted(false);
    setPaymentCompleted(false);
    localStorage.removeItem('checkoutStarted');
    localStorage.removeItem('paymentCompleted');
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkoutStarted,
        paymentCompleted,
        startCheckout,
        completePayment,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}; 
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Currency = 'USD' | 'INR';

// Conversion rate: 1 USD = 87 INR
export const USD_TO_INR_RATE = 87;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountInUsd?: number | string | null) => string;
  convertPrice: (amountInUsd?: number | string | null) => number;
  rate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('expertTalkz_currency');
      if (saved === 'INR' || saved === 'USD') return saved;
    } catch {}
    return 'USD';
  });

  useEffect(() => {
    try {
      localStorage.setItem('expertTalkz_currency', currency);
    } catch {}
  }, [currency]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const toggleCurrency = () => {
    setCurrencyState((prev) => (prev === 'USD' ? 'INR' : 'USD'));
  };

  const convertPrice = (amountInUsd?: number | string | null): number => {
    if (amountInUsd === undefined || amountInUsd === null || amountInUsd === '') return 0;
    const num = typeof amountInUsd === 'string' ? parseFloat(amountInUsd) : amountInUsd;
    if (isNaN(num)) return 0;

    if (currency === 'INR') {
      return Math.round(num * USD_TO_INR_RATE);
    }
    return Math.round(num);
  };

  const formatPrice = (amountInUsd?: number | string | null): string => {
    if (amountInUsd === undefined || amountInUsd === null || amountInUsd === '') return '';
    const num = typeof amountInUsd === 'string' ? parseFloat(amountInUsd) : amountInUsd;
    if (isNaN(num)) return '';

    if (currency === 'INR') {
      const inrAmount = Math.round(num * USD_TO_INR_RATE);
      return `₹${inrAmount.toLocaleString('en-IN')}`;
    }

    return `$${Math.round(num).toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatPrice,
        convertPrice,
        rate: USD_TO_INR_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

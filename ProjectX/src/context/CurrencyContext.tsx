import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Currency = 'USD' | 'INR';

// Fallback baseline conversion rate (updated 2026 market exchange rate)
export const DEFAULT_USD_TO_INR_RATE = 94.84;
const RATE_CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache
const RATE_CACHE_KEY = 'expertTalkz_usd_to_inr_rate';
const RATE_CACHE_TIME_KEY = 'expertTalkz_usd_to_inr_time';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  formatPrice: (amountInUsd?: number | string | null) => string;
  convertPrice: (amountInUsd?: number | string | null) => number;
  rate: number;
  rateLastUpdated: Date | null;
  isLoadingRate: boolean;
  refreshRate: () => Promise<void>;
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

  const [rate, setRate] = useState<number>(() => {
    try {
      const savedRate = localStorage.getItem(RATE_CACHE_KEY);
      const parsed = savedRate ? parseFloat(savedRate) : null;
      if (parsed && !isNaN(parsed) && parsed > 50 && parsed < 200) {
        return parsed;
      }
    } catch {}
    return DEFAULT_USD_TO_INR_RATE;
  });

  const [rateLastUpdated, setRateLastUpdated] = useState<Date | null>(() => {
    try {
      const savedTime = localStorage.getItem(RATE_CACHE_TIME_KEY);
      return savedTime ? new Date(parseInt(savedTime, 10)) : null;
    } catch {
      return null;
    }
  });

  const [isLoadingRate, setIsLoadingRate] = useState(false);

  // Fetch real-time exchange rate from free public APIs
  const fetchLiveRate = async (force: boolean = false): Promise<void> => {
    try {
      const cachedTime = localStorage.getItem(RATE_CACHE_TIME_KEY);
      const cachedRate = localStorage.getItem(RATE_CACHE_KEY);

      if (!force && cachedTime && cachedRate) {
        const timeDiff = Date.now() - parseInt(cachedTime, 10);
        if (timeDiff < RATE_CACHE_DURATION_MS) {
          // Cache is still fresh
          return;
        }
      }

      setIsLoadingRate(true);

      // Primary: Open Exchange Rates free endpoint
      let newRate: number | null = null;
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && data.rates.INR) {
            newRate = parseFloat(Number(data.rates.INR).toFixed(2));
          }
        }
      } catch (err) {
        console.warn('Primary exchange rate endpoint unreachable, trying fallback...', err);
      }

      // Secondary Fallback: ExchangeRate-API
      if (!newRate) {
        try {
          const resFallback = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (resFallback.ok) {
            const dataFallback = await resFallback.json();
            if (dataFallback && dataFallback.rates && dataFallback.rates.INR) {
              newRate = parseFloat(Number(dataFallback.rates.INR).toFixed(2));
            }
          }
        } catch (err) {
          console.warn('Fallback exchange rate endpoint unreachable:', err);
        }
      }

      if (newRate && !isNaN(newRate) && newRate > 50 && newRate < 200) {
        setRate(newRate);
        const now = new Date();
        setRateLastUpdated(now);
        try {
          localStorage.setItem(RATE_CACHE_KEY, String(newRate));
          localStorage.setItem(RATE_CACHE_TIME_KEY, String(now.getTime()));
        } catch {}
      }
    } catch (e) {
      console.warn('Failed to fetch live currency exchange rate, using existing rate:', e);
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    fetchLiveRate();
  }, []);

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
      return Math.round(num * rate);
    }
    return Math.round(num);
  };

  const formatPrice = (amountInUsd?: number | string | null): string => {
    if (amountInUsd === undefined || amountInUsd === null || amountInUsd === '') return '';
    const num = typeof amountInUsd === 'string' ? parseFloat(amountInUsd) : amountInUsd;
    if (isNaN(num)) return '';
    if (num === 0) return 'Free';

    if (currency === 'INR') {
      const inrAmount = Math.round(num * rate);
      return `₹${inrAmount.toLocaleString('en-IN')}`;
    }

    // USD display: show cents if non-integer (e.g. $0.10), otherwise whole dollar
    if (num % 1 !== 0) {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        rate,
        rateLastUpdated,
        isLoadingRate,
        refreshRate: () => fetchLiveRate(true),
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


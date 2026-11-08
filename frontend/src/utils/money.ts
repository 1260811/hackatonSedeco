import type { Money } from '@/types/api';

const MONEY_PATTERN = /^[0-9]+(\.[0-9]{1,2})?$/;

export const isValidMoney = (value: string): value is Money => MONEY_PATTERN.test(value);

export const formatMoney = (value: Money, currency = 'MXN'): string => {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return value;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
};

export const normalizeMoneyInput = (raw: string): Money | null => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) return null;
  if (!isValidMoney(cleaned)) return null;
  return cleaned;
};

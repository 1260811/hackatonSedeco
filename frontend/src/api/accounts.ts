import type { BankAccount, RegisterBankAccountRequest } from '@/types/api';
import { USE_MOCKS } from './index';
import { request } from './client';
import { db, delay, generateId } from '@/mocks/data';

export const listAccounts = async (): Promise<BankAccount[]> => {
  if (USE_MOCKS) return delay([...db.accounts]);
  return request<BankAccount[]>('/accounts');
};

export const getAccount = async (accountId: string): Promise<BankAccount> => {
  if (USE_MOCKS) {
    const found = db.accounts.find((a) => a.id === accountId);
    if (!found) throw new Error('Cuenta no encontrada');
    return delay({ ...found });
  }
  return request<BankAccount>(`/accounts/${accountId}`);
};

export const registerAccount = async (
  payload: RegisterBankAccountRequest,
): Promise<BankAccount> => {
  if (USE_MOCKS) {
    const created: BankAccount = {
      id: generateId('acc'),
      bankName: 'Banco Mock',
      maskedAccount: `**** **** **** ${payload.clabe.slice(-4)}`,
      peyBankAccountId: generateId('pey'),
      peyStatus: 'PENDING',
      isDeclaredOwner: payload.isDeclaredOwner,
      displayAlias: payload.displayAlias ?? null,
    };
    db.accounts.push(created);
    return delay(created, 500);
  }
  return request<BankAccount>('/accounts', { method: 'POST', body: payload });
};

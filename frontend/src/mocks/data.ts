/**
 * Mock data en memoria para desarrollo sin backend.
 * Uso: cuando VITE_USE_MOCKS=true, los módulos api/*.ts leen/escriben aquí.
 */
import type {
  Agreement,
  BankAccount,
  Notification,
  Participation,
  Payment,
  PaymentObligation,
  PaymentRequest,
  Tanda,
  Turn,
} from '@/types/api';

const makeId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

interface MockDB {
  accounts: BankAccount[];
  tandas: Tanda[];
  participations: Record<string, Participation[]>;
  agreements: Record<string, Agreement>;
  turns: Record<string, Turn[]>;
  obligations: Record<string, PaymentObligation[]>;
  payments: Record<string, Payment[]>;
  paymentRequests: PaymentRequest[];
  notifications: Notification[];
}

const now = new Date();
const addDays = (d: Date, days: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString();
};

const seedAccounts: BankAccount[] = [
  {
    id: 'acc_1',
    bankName: 'BBVA México',
    maskedAccount: '**** **** **** 4521',
    peyBankAccountId: 'pey_1',
    peyStatus: 'ACTIVE',
    isDeclaredOwner: true,
    displayAlias: 'Cuenta principal',
  },
  {
    id: 'acc_2',
    bankName: 'Banorte',
    maskedAccount: '**** **** **** 8832',
    peyBankAccountId: 'pey_2',
    peyStatus: 'PENDING',
    isDeclaredOwner: true,
    displayAlias: 'Secundaria',
  },
];

const seedTandas: Tanda[] = [
  {
    id: 'tanda_1',
    name: 'Tanda familiar noviembre',
    status: 'ACTIVE',
    contributionAmount: '500.00',
    frequency: 'WEEKLY',
    startDate: now.toISOString().slice(0, 10),
    participantCount: 5,
    distinctPersonCount: 5,
  },
  {
    id: 'tanda_2',
    name: 'Tanda de ahorro oficina',
    status: 'DRAFT',
    contributionAmount: '1000.00',
    frequency: 'BIWEEKLY',
    startDate: addDays(now, 7).slice(0, 10),
    participantCount: 2,
    distinctPersonCount: 2,
  },
];

const seedParticipations: Record<string, Participation[]> = {
  tanda_1: [
    { id: 'part_1', userId: 'me', displayName: 'Yudexi (tú)', status: 'ACTIVE', selectedBankAccountId: 'acc_1', selectedPosition: 1 },
    { id: 'part_2', userId: 'u2', displayName: 'María López', status: 'ACTIVE', selectedBankAccountId: null, selectedPosition: 2 },
    { id: 'part_3', userId: 'u3', displayName: 'Juan Pérez', status: 'ACTIVE', selectedBankAccountId: null, selectedPosition: 3 },
    { id: 'part_4', userId: 'u4', displayName: 'Ana Ruiz', status: 'ACTIVE', selectedBankAccountId: null, selectedPosition: 4 },
    { id: 'part_5', userId: 'u5', displayName: 'Pedro Sol', status: 'INVITED', selectedBankAccountId: null, selectedPosition: null },
  ],
  tanda_2: [
    { id: 'part_6', userId: 'me', displayName: 'Yudexi (tú)', status: 'ACTIVE', selectedBankAccountId: 'acc_1', selectedPosition: 1 },
    { id: 'part_7', userId: 'u6', displayName: 'Carlos Vega', status: 'INVITED', selectedBankAccountId: null, selectedPosition: null },
  ],
};

const seedAgreements: Record<string, Agreement> = {
  tanda_1: {
    version: 1,
    penaltyEnabled: true,
    penaltyType: 'FIXED',
    penaltyValue: '50.00',
    gracePeriodDays: 2,
    penaltyPeriodDays: 7,
    terms:
      'Convenio base de la tanda. Importes semanales de $500.00. Sanción fija de $50.00 por aportaciones tardías.',
    acceptances: [
      { participationId: 'part_1', agreementVersion: 1, acceptedAt: addDays(now, -5) },
      { participationId: 'part_2', agreementVersion: 1, acceptedAt: addDays(now, -4) },
      { participationId: 'part_3', agreementVersion: 1, acceptedAt: addDays(now, -3) },
      { participationId: 'part_4', agreementVersion: 1, acceptedAt: addDays(now, -3) },
    ],
  },
  tanda_2: {
    version: 1,
    penaltyEnabled: false,
    terms: 'Convenio en borrador. Sin sanciones configuradas por el momento.',
    acceptances: [],
  },
};

const seedTurns: Record<string, Turn[]> = {
  tanda_1: Array.from({ length: 5 }, (_, i) => ({
    id: `turn_${i + 1}`,
    position: i + 1,
    receiverParticipationId: `part_${i + 1}`,
    receiverBankAccountId: 'acc_1',
    scheduledAt: addDays(now, i * 7),
  })),
};

const seedObligations: Record<string, PaymentObligation[]> = {
  tanda_1: [
    { id: 'oblig_1', participationId: 'part_1', amount: '500.00', dueAt: addDays(now, 3), status: 'PENDING' },
    { id: 'oblig_2', participationId: 'part_1', amount: '500.00', dueAt: addDays(now, -2), status: 'OVERDUE', penaltyAmount: '50.00' },
    { id: 'oblig_3', participationId: 'part_1', amount: '500.00', dueAt: addDays(now, -10), status: 'PAID' },
  ],
};

const seedPayments: Record<string, Payment[]> = {
  tanda_1: [
    { id: 'pay_1', obligationId: 'oblig_3', amount: '500.00', paidAt: addDays(now, -10), status: 'CONFIRMED', peyTransactionId: 'pey_tx_1' },
  ],
};

const seedNotifications: Notification[] = [
  { id: 'notif_1', type: 'OBLIGATION_DUE', message: 'Tienes una aportación pendiente que vence pronto.', createdAt: addDays(now, -1), read: false },
  { id: 'notif_2', type: 'INVITATION', message: 'Carlos Vega te invitó a la tanda "Oficina".', createdAt: addDays(now, -2), read: false },
  { id: 'notif_3', type: 'PAYMENT_CONFIRMED', message: 'Tu pago de la semana pasada fue confirmado.', createdAt: addDays(now, -10), read: true },
];

export const db: MockDB = {
  accounts: [...seedAccounts],
  tandas: [...seedTandas],
  participations: { ...seedParticipations },
  agreements: { ...seedAgreements },
  turns: { ...seedTurns },
  obligations: { ...seedObligations },
  payments: { ...seedPayments },
  paymentRequests: [],
  notifications: [...seedNotifications],
};

export const generateId = makeId;

/** Simula latencia de red para que el UI muestre estados de carga. */
export const delay = <T>(value: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

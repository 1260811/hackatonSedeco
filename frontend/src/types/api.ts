/**
 * Tipos derivados del contrato OpenAPI 3.1
 * Fuente: docs/api-contracts/openapi.yaml
 *
 * Importes monetarios SIEMPRE como string (patrón: ^[0-9]+(\.[0-9]{1,2})?$).
 * Fechas SIEMPRE como string ISO 8601.
 */

export type Money = string;
export type IsoDateTime = string;
export type IsoDate = string;

export type BankAccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';

export interface BankAccount {
  id: string;
  bankName: string;
  maskedAccount: string;
  peyBankAccountId: string;
  peyStatus: BankAccountStatus;
  isDeclaredOwner: boolean;
  displayAlias: string | null;
}

export interface RegisterBankAccountRequest {
  clabe: string;
  isDeclaredOwner: boolean;
  displayAlias?: string | null;
  declaredOwnerName?: string;
}

export type TandaStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'PAUSED'
  | 'CANCELLATION_PENDING'
  | 'CANCELLED'
  | 'COMPLETED';

export type TandaFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM';

export interface TandaSummary {
  id: string;
  name: string;
  status: TandaStatus;
}

export interface Tanda extends TandaSummary {
  contributionAmount: Money;
  frequency: TandaFrequency;
  startDate: IsoDate;
  participantCount: number;
  distinctPersonCount: number;
}

export interface CreateTandaRequest {
  name: string;
  contributionAmount: Money;
  frequency: TandaFrequency;
  startDate: IsoDate;
  customPeriodDays?: number;
}

export type ParticipationStatus = 'INVITED' | 'ACTIVE' | 'LEFT' | 'REMOVED';

export interface Participation {
  id: string;
  userId: string;
  displayName: string;
  status: ParticipationStatus;
  selectedBankAccountId: string | null;
  selectedPosition: number | null;
}

export interface AddParticipationRequest {
  userId: string;
  selectedPosition?: number | null;
}

export type PenaltyType = 'FIXED' | 'PERCENTAGE';

export interface AgreementConfiguration {
  penaltyEnabled: boolean;
  penaltyType?: PenaltyType;
  penaltyValue?: Money;
  gracePeriodDays?: number;
  penaltyPeriodDays?: number;
  terms?: string;
}

export interface AgreementAcceptance {
  participationId: string;
  agreementVersion: number;
  acceptedAt: IsoDateTime;
}

export interface Agreement {
  version: number;
  penaltyEnabled: boolean;
  penaltyType?: PenaltyType;
  penaltyValue?: Money;
  gracePeriodDays?: number;
  penaltyPeriodDays?: number;
  terms?: string;
  acceptances: AgreementAcceptance[];
}

export interface Turn {
  id: string;
  position: number;
  receiverParticipationId: string;
  receiverBankAccountId: string;
  scheduledAt: IsoDateTime;
}

export type PaymentObligationStatus =
  | 'PENDING'
  | 'PAYMENT_REQUESTED'
  | 'PAID'
  | 'OVERDUE'
  | 'UNDER_REVIEW'
  | 'CANCELLED';

export interface PaymentObligation {
  id: string;
  participationId: string;
  amount: Money;
  dueAt: IsoDateTime;
  status: PaymentObligationStatus;
  penaltyAmount?: Money;
}

export type PaymentChannel = 'CODI_QR' | 'CODI_PUSH';

export interface CreatePaymentRequest {
  channel: PaymentChannel;
  phoneNumber?: string;
}

export type PaymentRequestStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'EXPIRED'
  | 'PAID'
  | 'FAILED'
  | 'UNDER_REVIEW';

export interface PaymentRequest {
  id: string;
  obligationId: string;
  channel: PaymentChannel;
  amount: Money;
  recipientBankAccountId: string;
  status: PaymentRequestStatus;
  qrPayload: string | null;
  expiresAt: IsoDateTime | null;
  createdAt: IsoDateTime;
}

export type PaymentStatus = 'CONFIRMED' | 'LATE' | 'UNDER_REVIEW';

export interface Payment {
  id: string;
  obligationId: string;
  amount: Money;
  paidAt: IsoDateTime;
  status: PaymentStatus;
  peyTransactionId: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: IsoDateTime;
  read: boolean;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'BUSINESS_RULE_VIOLATION'
  | 'PAYMENT_REQUIRES_REVIEW'
  | 'INTERNAL_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: unknown[];
}

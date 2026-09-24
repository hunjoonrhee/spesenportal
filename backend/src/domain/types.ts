export type Role = 'EMPLOYEE' | 'APPROVER' | 'ACCOUNTING';
export type Currency = 'EUR' | 'CHF' | 'USD';
export type ExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  costCenterId: string;
}

export interface Category {
  id: string;
  key: string;
  label: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  responsibleUserId: string | null;
}

export interface Expense {
  id: string;
  employeeId: string;
  date: string; // ISO yyyy-mm-dd
  categoryId: string;
  amount: number;
  currency: Currency;
  amountEur: number;
  costCenterId: string;
  description: string;
  status: ExpenseStatus;
  submittedAt: string | null;
  decidedAt: string | null;
  decidedBy: string | null;
  rejectionReason: string | null;
  receiptFileName: string | null;
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const EUR_RATES: Record<Currency, number> = { EUR: 1, CHF: 1.07, USD: 0.92 };

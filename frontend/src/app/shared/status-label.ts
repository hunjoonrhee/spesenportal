import { ExpenseStatus } from '../core/models';

export const STATUS_LABELS: Record<ExpenseStatus, string> = {
  DRAFT: 'Entwurf',
  SUBMITTED: 'Eingereicht',
  APPROVED: 'Genehmigt',
  REJECTED: 'Abgelehnt',
  PAID: 'Ausgezahlt',
};

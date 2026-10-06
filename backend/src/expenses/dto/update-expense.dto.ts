import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto.js';

/** Wie CreateExpenseDto, aber alle Felder optional. `submit` gibt es nur beim Anlegen (Einreichen: POST /:id/submit). */
export class UpdateExpenseDto extends PartialType(OmitType(CreateExpenseDto, ['submit'] as const)) {}

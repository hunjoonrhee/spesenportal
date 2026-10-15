import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../data/data-store.service.js';
import { EUR_RATES, type Expense, type Page, type User } from '../domain/types.js';
import type { CreateExpenseDto } from './dto/create-expense.dto.js';
import type { UpdateExpenseDto } from './dto/update-expense.dto.js';
import type { ListExpensesQuery } from './dto/list-expenses.query.js';

@Injectable()
export class ExpensesService {
  constructor(private readonly store: DataStoreService) {}

  /** Eigene Ausgaben des Nutzers, paginiert und sortiert. */
  findMine(user: User, query: ListExpensesQuery): Page<Expense> {
    const { page, pageSize, sort, order } = query;
    const mine = this.store.expenses.filter((e) => e.employeeId === user.id);

    const sorted = [...mine].sort((a, b) => {
      const diff = sort === 'amount' ? a.amountEur - b.amountEur : a.date.localeCompare(b.date);
      return order === 'asc' ? diff : -diff;
    });

    const start = (page - 1) * pageSize;
    return {
      items: sorted.slice(start, start + pageSize),
      page,
      pageSize,
      total: this.store.expenses.length,
    };
  }

  findOne(user: User, id: string): Expense {
    const expense = this.store.expenses.find((e) => e.id === id);
    if (!expense) throw new NotFoundException(`Ausgabe ${id} nicht gefunden`);
    if (expense.employeeId !== user.id && user.role === 'EMPLOYEE') {
      throw new ForbiddenException('Keine Berechtigung für diese Ausgabe');
    }
    return expense;
  }

  create(user: User, dto: CreateExpenseDto): Expense {
    if (!this.store.categories.some((c) => c.id === dto.categoryId)) {
      throw new BadRequestException(`Unbekannte Kategorie ${dto.categoryId}`);
    }
    if (!this.store.costCenters.some((c) => c.id === dto.costCenterId)) {
      throw new BadRequestException(`Unbekannte Kostenstelle ${dto.costCenterId}`);
    }
    const expense: Expense = {
      id: this.store.nextExpenseId(),
      employeeId: user.id,
      date: dto.date,
      categoryId: dto.categoryId,
      amount: dto.amount,
      currency: dto.currency,
      amountEur: Math.round(dto.amount * EUR_RATES[dto.currency] * 100) / 100,
      costCenterId: dto.costCenterId,
      description: dto.description,
      status: dto.submit ? 'SUBMITTED' : 'DRAFT',
      submittedAt: dto.submit ? new Date().toISOString() : null,
      decidedAt: null,
      decidedBy: null,
      rejectionReason: null,
      receiptFileName: null,
    };
    this.store.expenses.push(expense);
    return expense;
  }

  update(user: User, id: string, dto: UpdateExpenseDto): Expense {
    const expense = this.findOne(user, id);
    if (expense.status !== 'DRAFT') throw new BadRequestException('Nur Entwürfe können bearbeitet werden');
    if (dto.categoryId !== undefined && !this.store.categories.some((c) => c.id === dto.categoryId)) {
      throw new BadRequestException(`Unbekannte Kategorie ${dto.categoryId}`);
    }
    if (dto.costCenterId !== undefined && !this.store.costCenters.some((c) => c.id === dto.costCenterId)) {
      throw new BadRequestException(`Unbekannte Kostenstelle ${dto.costCenterId}`);
    }
    // null (von @IsOptional durchgelassen) und undefined überschreiben nichts
    const changes = Object.fromEntries(Object.entries(dto).filter(([, v]) => v !== undefined && v !== null));
    Object.assign(expense, changes);
    if (dto.amount !== undefined || dto.currency !== undefined) {
      expense.amountEur = Math.round(expense.amount * EUR_RATES[expense.currency] * 100) / 100;
    }
    return expense;
  }

  submit(user: User, id: string): Expense {
    const expense = this.findOne(user, id);
    if (expense.status !== 'DRAFT') throw new BadRequestException('Nur Entwürfe können eingereicht werden');
    expense.status = 'SUBMITTED';
    expense.submittedAt = new Date().toISOString();
    return expense;
  }

  remove(user: User, id: string): void {
    const expense = this.findOne(user, id);
    if (expense.status !== 'DRAFT') throw new BadRequestException('Nur Entwürfe können gelöscht werden');
    this.store.expenses = this.store.expenses.filter((e) => e.id !== id);
  }
}

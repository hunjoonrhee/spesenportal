import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Category, CostCenter, Expense, User } from '../domain/types.js';

/**
 * In-Memory-Datenspeicher (siehe ADR-0003).
 * Lädt die Seed-Daten beim Start. Änderungen gehen beim Neustart verloren.
 */
@Injectable()
export class DataStoreService implements OnModuleInit {
  users: User[] = [];
  categories: Category[] = [];
  costCenters: CostCenter[] = [];
  expenses: Expense[] = [];

  onModuleInit(): void {
    this.reset();
  }

  reset(): void {
    const dir = process.env.DATA_DIR ?? resolve(process.cwd(), 'data');
    const load = <T>(file: string): T => JSON.parse(readFileSync(resolve(dir, file), 'utf-8')) as T;
    this.users = load<User[]>('users.json');
    this.categories = load<Category[]>('categories.json');
    this.costCenters = load<CostCenter[]>('cost-centers.json');
    this.expenses = load<Expense[]>('expenses.json');
  }

  nextExpenseId(): string {
    const max = this.expenses.reduce((m, e) => Math.max(m, Number(e.id.replace('exp-', ''))), 0);
    return `exp-${String(max + 1).padStart(4, '0')}`;
  }
}

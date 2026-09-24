import { Test } from '@nestjs/testing';
import { DataStoreService } from '../data/data-store.service.js';
import type { User } from '../domain/types.js';
import { ListExpensesQuery } from './dto/list-expenses.query.js';
import { ExpensesService } from './expenses.service.js';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let store: DataStoreService;
  let anna: User;

  const query = (overrides: Partial<ListExpensesQuery> = {}): ListExpensesQuery =>
    Object.assign(new ListExpensesQuery(), overrides);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DataStoreService, ExpensesService],
    }).compile();
    store = moduleRef.get(DataStoreService);
    store.reset();
    service = moduleRef.get(ExpensesService);
    anna = store.users.find((u) => u.id === 'u-01')!;
  });

  it('liefert nur eigene Ausgaben', () => {
    const result = service.findMine(anna, query({ pageSize: 100 }));
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((e) => e.employeeId === 'u-01')).toBe(true);
  });

  it('sortiert standardmäßig nach Datum absteigend', () => {
    const { items } = service.findMine(anna, query());
    const dates = items.map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('sortiert nach Betrag aufsteigend', () => {
    const { items } = service.findMine(anna, query({ sort: 'amount', order: 'asc' }));
    const amounts = items.map((e) => e.amountEur);
    expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
  });

  it('paginiert', () => {
    const first = service.findMine(anna, query({ page: 1, pageSize: 5 }));
    const second = service.findMine(anna, query({ page: 2, pageSize: 5 }));
    expect(first.items).toHaveLength(5);
    expect(second.items[0].id).not.toBe(first.items[0].id);
  });

  it('legt eine Ausgabe als Entwurf an und rechnet in EUR um', () => {
    const created = service.create(anna, {
      date: '2026-09-21',
      categoryId: 'cat-02',
      amount: 100,
      currency: 'CHF',
      costCenterId: 'cc-1110',
      description: 'Kundentermin Zürich – Bahnfahrt',
    });
    expect(created.status).toBe('DRAFT');
    expect(created.amountEur).toBe(107);
  });
});

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ExpenseList, ExpenseRow } from './expense-list';

const mockExpenses: ExpenseRow[] = [
  {
    id: '1',
    date: '2023-01-01',
    employeeId: 'e1',
    categoryId: 'cat1',
    amount: 100,
    currency: 'EUR',
    amountEur: 100,
    costCenterId: 'cc1',
    description: 'Beschreibung 1',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
    formattedDate: '',
    categoryLabel: '',
  },
  {
    id: '2',
    date: '2023-02-01',
    employeeId: 'e2',
    categoryId: 'cat2',
    amount: 200,
    currency: 'EUR',
    amountEur: 100,
    costCenterId: 'cc1',
    description: 'Beschreibung 1',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
    formattedDate: '',
    categoryLabel: '',
  },
];

describe('ExpenseList', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('sortiert die Ausgaben nach Datum absteigend, wenn sortAsc auf false gesetzt ist', () => {
    const fixture = TestBed.createComponent(ExpenseList);
    const component = fixture.componentInstance;
    component.rows$.next(mockExpenses);
    component.sortAsc = false;
    component.sortByDate();
    expect(component.rows$.value[0].id).toBe('2');
  });
  it('sortiert die Ausgaben nach Datum aufsteigend, wenn sortAsc auf true gesetzt ist', () => {
    const fixture = TestBed.createComponent(ExpenseList);
    const component = fixture.componentInstance;
    component.rows$.next(mockExpenses);
    component.sortAsc = true;
    component.sortByDate();
    expect(component.rows$.value[0].id).toBe('1');
  });
});

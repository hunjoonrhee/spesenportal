import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ExpenseService } from '../../../core/api/expense.service';
import { MasterDataService } from '../../../core/api/master-data.service';
import { Expense } from '../../../core/models';
import { ExpenseList } from './expense-list';

const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2023-03-27',
    employeeId: 'e4',
    categoryId: 'cat1',
    amount: 289,
    currency: 'EUR',
    amountEur: 289,
    costCenterId: 'cc1',
    description: 'Hotelübernachtung Hamburg',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
  },
  {
    id: '2',
    date: '2023-01-18',
    employeeId: 'e3',
    categoryId: 'cat2',
    amount: 67.5,
    currency: 'EUR',
    amountEur: 67.5,
    costCenterId: 'cc2',
    description: 'Geschäftsessen mit Partner',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
  },
  {
    id: '3',
    date: '2023-11-14',
    employeeId: 'e2',
    categoryId: 'cat3',
    amount: 45.9,
    currency: 'EUR',
    amountEur: 45.9,
    costCenterId: 'cc2',
    description: 'Taxifahrt zum Kunden',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
  },
  {
    id: '4',
    date: '2023-06-02',
    employeeId: 'e2',
    categoryId: 'cat1',
    amount: 154.2,
    currency: 'EUR',
    amountEur: 154.2,
    costCenterId: 'cc1',
    description: 'Bahnticket Köln–München',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
  },
  {
    id: '5',
    date: '2023-08-09',
    employeeId: 'e1',
    categoryId: 'cat4',
    amount: 120,
    currency: 'USD',
    amountEur: 110.4,
    costCenterId: 'cc3',
    description: 'Software-Lizenz (Jahresabo)',
    status: 'DRAFT',
    submittedAt: null,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    receiptFileName: null,
  },
];
const mockPage = 1;
const mockPageSize = 2;

const expenseServiceMock = {
  list: vi.fn().mockReturnValue(
    of({
      items: mockExpenses.slice((mockPage - 1) * mockPageSize, mockPage * mockPageSize),
      page: mockPage,
      pageSize: mockPageSize,
      total: mockExpenses.length,
    }),
  ),
};

describe('ExpenseList', () => {
  let component: ExpenseList;
  let fixture: ComponentFixture<ExpenseList>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ExpenseService, useValue: expenseServiceMock },
        {
          provide: MasterDataService,
          useValue: {
            categories: () =>
              of([
                { id: 'cat1', key: 'cat1', label: 'Kategorie 1' },
                { id: 'cat2', key: 'cat2', label: 'Kategorie 2' },
                { id: 'cat3', key: 'cat3', label: 'Kategorie 3' },
                { id: 'cat4', key: 'cat4', label: 'Kategorie 4' },
              ]),
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ExpenseList);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sortiert die Ausgaben nach Datum aufsteigend, wenn sortAsc vorher auf false gesetzt ist', () => {
    component.sortAsc = false;
    component.pageSize = mockPageSize;
    component.page = 2;
    component.sortByDate();
    expect(expenseServiceMock.list).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: component.pageSize,
      sort: 'date',
      order: 'asc',
    });
  });
  it('sortiert die Ausgaben nach Datum absteigend, wenn sortAsc vorher auf true gesetzt ist', () => {
    component.sortAsc = true;
    component.pageSize = mockPageSize;
    component.page = 2;
    component.sortByDate();
    expect(expenseServiceMock.list).toHaveBeenCalledWith({
      page: 1,
      pageSize: component.pageSize,
      sort: 'date',
      order: 'desc',
    });
  });

  it('behalte die geänderte Reihenfolge bei, auch wenn die Seite geändert wird', () => {
    component.sortAsc = true;
    component.pageSize = mockPageSize;
    component.goTo(2);
    expect(expenseServiceMock.list).toHaveBeenCalledWith({
      page: 2,
      pageSize: component.pageSize,
      sort: 'date',
      order: 'asc',
    });
  });

  it('formatiert den Betrag korrekt', () => {
    const formattedAmount = component.formatAmount(1234.5, 'EUR');
    expect(formattedAmount).toBe('1234,50 EUR');
  });
});

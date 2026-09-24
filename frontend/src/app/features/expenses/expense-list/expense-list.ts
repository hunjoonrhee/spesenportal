import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ExpenseService } from '../../../core/api/expense.service';
import { MasterDataService } from '../../../core/api/master-data.service';
import { Category, Expense } from '../../../core/models';
import { StatusChip } from '../../../shared/status-chip/status-chip';

interface ExpenseRow extends Expense {
  formattedDate: string;
  categoryLabel: string;
}

@Component({
  selector: 'app-expense-list',
  imports: [AsyncPipe, RouterLink, StatusChip],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss',
})
export class ExpenseList implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly masterData = inject(MasterDataService);

  rows$ = new BehaviorSubject<ExpenseRow[]>([]);
  total$ = new BehaviorSubject<number>(0);
  page = 1;
  pageSize = 20;
  sortAsc = false;
  categories: Category[] = [];

  ngOnInit(): void {
    this.masterData.categories().subscribe((cats) => {
      this.categories = cats;
      this.load();
    });
  }

  load(): void {
    this.expenseService.list({ page: this.page, pageSize: this.pageSize }).subscribe((result) => {
      const rows = result.items.map((e) => ({
        ...e,
        formattedDate: new Date(e.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        categoryLabel: this.categories.find((c) => c.id === e.categoryId)?.label ?? '–',
      }));
      this.rows$.next(rows);
      this.total$.next(result.total);
    });
  }

  sortByDate(): void {
    this.sortAsc = !this.sortAsc;
    const sorted = [...this.rows$.value].sort((a, b) =>
      this.sortAsc ? a.formattedDate.localeCompare(b.formattedDate) : b.formattedDate.localeCompare(a.formattedDate),
    );
    this.rows$.next(sorted);
  }

  formatAmount(amount: number, currency: string): string {
    return amount.toFixed(2).replace('.', ',') + ' ' + currency;
  }

  pages(total: number): number[] {
    return Array.from({ length: Math.ceil(total / this.pageSize) }, (_, i) => i + 1);
  }

  goTo(page: number): void {
    this.page = page;
    this.load();
  }
}

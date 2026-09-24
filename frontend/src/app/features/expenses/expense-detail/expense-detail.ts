import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../../core/api/expense.service';
import { MasterDataService } from '../../../core/api/master-data.service';
import { Category, CostCenter } from '../../../core/models';
import { MoneyPipe } from '../../../shared/money.pipe';
import { StatusChip } from '../../../shared/status-chip/status-chip';

@Component({
  selector: 'app-expense-detail',
  imports: [RouterLink, StatusChip, MoneyPipe],
  templateUrl: './expense-detail.html',
  styleUrl: './expense-detail.scss',
})
export class ExpenseDetail {
  private readonly expenseService = inject(ExpenseService);
  private readonly masterData = inject(MasterDataService);

  /** Route-Parameter :id (withComponentInputBinding) */
  readonly id = input.required<string>();

  protected readonly expense = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.expenseService.get(id),
  });

  private readonly categories = toSignal(this.masterData.categories(), { initialValue: [] as Category[] });
  private readonly costCenters = toSignal(this.masterData.costCenters(), { initialValue: [] as CostCenter[] });

  protected readonly categoryLabel = computed(() => {
    const e = this.expense.value();
    return this.categories().find((c) => c.id === e?.categoryId)?.label ?? '';
  });

  protected readonly costCenterLabel = computed(() => {
    const e = this.expense.value();
    const cc = this.costCenters().find((c) => c.id === e?.costCenterId);
    return cc ? `${cc.code} ${cc.name}` : '';
  });
}

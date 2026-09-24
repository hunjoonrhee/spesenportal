import { Component, computed, input } from '@angular/core';
import { ExpenseStatus } from '../../core/models';
import { STATUS_LABELS } from '../status-label';

@Component({
  selector: 'app-status-chip',
  template: `<span class="chip" [attr.data-status]="status()">{{ label() }}</span>`,
  styles: `
    .chip {
      display: inline-block;
      padding: 0.1rem 0.5rem;
      border: 1.5px solid var(--status-color, var(--nw-steel));
      border-radius: 3px;
      color: var(--status-color, var(--nw-steel));
      font-size: 0.8125rem;
      font-weight: 600;
      line-height: 1.4;
      white-space: nowrap;
    }
    [data-status='DRAFT'] { --status-color: var(--nw-status-draft); border-style: dashed; }
    [data-status='SUBMITTED'] { --status-color: var(--nw-status-submitted); }
    [data-status='APPROVED'] { --status-color: var(--nw-status-approved); }
    [data-status='REJECTED'] { --status-color: var(--nw-status-rejected); }
    [data-status='PAID'] { --status-color: var(--nw-status-paid); }
  `,
})
export class StatusChip {
  readonly status = input.required<ExpenseStatus>();
  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
}

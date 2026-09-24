import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../../core/api/expense.service';
import { MasterDataService } from '../../../core/api/master-data.service';
import { DemoAuthService } from '../../../core/auth/demo-auth.service';
import { Category, CostCenter } from '../../../core/models';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
})
export class ExpenseForm implements OnInit {
  private readonly expenseService = inject(ExpenseService);
  private readonly masterData = inject(MasterDataService);
  private readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);

  categories = signal<Category[]>([]);
  costCenters = signal<CostCenter[]>([]);
  saving = signal(false);

  form = new FormGroup({
    date: new FormControl(new Date().toISOString().slice(0, 10), Validators.required),
    categoryId: new FormControl('', Validators.required),
    amount: new FormControl<number | null>(null, Validators.required),
    currency: new FormControl('EUR', Validators.required),
    costCenterId: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.maxLength(200)]),
  });

  ngOnInit(): void {
    this.masterData.categories().subscribe((cats) => this.categories.set(cats));
    this.masterData.costCenters().subscribe((ccs) => {
      // nur Blätter (Kostenstellen ohne Kinder) sind buchbar
      const leaves = ccs.filter((cc) => !ccs.some((other) => other.parentId === cc.id));
      this.costCenters.set(leaves);
      const own = this.auth.currentUser()?.costCenterId;
      if (own && leaves.some((cc) => cc.id === own)) {
        this.form.controls.costCenterId.setValue(own);
      }
    });
  }

  save(submit: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value: any = this.form.value;
    const payload = {
      ...value,
      amount: Number(String(value.amount).replace(',', '.')),
      description: value.description.trim(),
      submit,
    };
    this.saving.set(true);
    this.expenseService.create(payload).subscribe((created: any) => {
      this.saving.set(false);
      this.router.navigate(['/expenses', created.id]);
    });
  }
}

import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { Shell } from './core/layout/shell';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/login/login').then((m) => m.Login) },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'expenses' },
      { path: 'expenses', loadComponent: () => import('./features/expenses/expense-list/expense-list').then((m) => m.ExpenseList) },
      { path: 'expenses/new', loadComponent: () => import('./features/expenses/expense-form/expense-form').then((m) => m.ExpenseForm) },
      { path: 'expenses/:id', loadComponent: () => import('./features/expenses/expense-detail/expense-detail').then((m) => m.ExpenseDetail) },
    ],
  },
  { path: '**', redirectTo: '' },
];

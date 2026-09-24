import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, Page } from '../models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);

  list(params: { page?: number; pageSize?: number; sort?: string; order?: string } = {}): Observable<Page<Expense>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) httpParams = httpParams.set(key, String(value));
    });
    return this.http.get<Page<Expense>>('/api/expenses', { params: httpParams });
  }

  get(id: string): Observable<Expense> {
    return this.http.get<Expense>(`/api/expenses/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post('/api/expenses', payload);
  }
}

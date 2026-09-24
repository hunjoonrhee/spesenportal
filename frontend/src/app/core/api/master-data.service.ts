import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CostCenter, User } from '../models';

@Injectable({ providedIn: 'root' })
export class MasterDataService {
  private readonly http = inject(HttpClient);

  users(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  categories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  costCenters(): Observable<CostCenter[]> {
    return this.http.get<CostCenter[]>('/api/cost-centers');
  }
}

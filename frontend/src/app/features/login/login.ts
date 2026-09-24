import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DemoAuthService } from '../../core/auth/demo-auth.service';
import { MasterDataService } from '../../core/api/master-data.service';
import { ROLE_LABELS, Role, User } from '../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);
  private readonly users = toSignal(inject(MasterDataService).users(), { initialValue: [] as User[] });

  protected readonly groups = computed(() => {
    const order: Role[] = ['EMPLOYEE', 'APPROVER', 'ACCOUNTING'];
    return order.map((role) => ({ role, label: ROLE_LABELS[role], users: this.users().filter((u) => u.role === role) }));
  });

  protected choose(user: User): void {
    this.auth.login(user);
    this.router.navigate(['/expenses']);
  }
}

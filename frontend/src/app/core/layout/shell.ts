import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DemoAuthService } from '../auth/demo-auth.service';
import { ROLE_LABELS } from '../models';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(DemoAuthService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.currentUser;
  protected readonly roleLabel = computed(() => {
    const user = this.user();
    return user ? ROLE_LABELS[user.role] : '';
  });

  protected switchUser(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

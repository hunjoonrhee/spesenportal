import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DemoAuthService } from './demo-auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(DemoAuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

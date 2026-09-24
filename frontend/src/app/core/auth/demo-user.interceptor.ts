import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DemoAuthService } from './demo-auth.service';

export const demoUserInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(DemoAuthService).currentUser();
  return next(user ? req.clone({ setHeaders: { 'X-Demo-User': user.id } }) : req);
};

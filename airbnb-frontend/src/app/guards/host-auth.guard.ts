import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const hostAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Check if token and role are valid
  if (token && role === 'host') {
    return true; // ✅ Allow access
  }

  // ❌ Not authorized — redirect to login page
  router.navigate(['/login'], { queryParams: { role: 'host' } });
  return false;
};

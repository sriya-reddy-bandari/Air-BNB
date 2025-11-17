import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Check if token and role are valid
  if (token && role === 'guest') {
    return true; // ✅ Allow access
  }

  // ❌ Not authorized — redirect to login page
  router.navigate(['/login'], { queryParams: { role: 'guest' } });
  return false;
};

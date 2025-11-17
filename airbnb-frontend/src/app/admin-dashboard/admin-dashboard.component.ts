import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  standalone:true,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
    constructor(private readonly router: Router,
      private readonly authService:AuthService
    ) {}

  goToHostList() {
    this.router.navigate(['/admin/hosts']);
  }
  goToGuestList() {
    this.router.navigate(['/admin/guests']);
  }
    goToPendingProperties() {
    this.router.navigate(['/admin/properties/pending']);
  }

  goToDeleteRequestProperties() {
   this.router.navigate(['/admin/properties/deleterequests']);
}

logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { role: 'admin' } });
  }
}

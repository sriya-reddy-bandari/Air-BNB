import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { MatButtonModule ,} from '@angular/material/button';
import { HostService } from '../services/host.service';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-host-dashboard',
  imports: [CommonModule, MatButtonModule,MatCardModule],
  standalone:true,
  templateUrl: './host-dashboard.component.html',
  styleUrl: './host-dashboard.component.css'
})
export class HostDashboardComponent implements OnInit{
   username: string | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly hostService: HostService
  ) {}

  ngOnInit(): void {
    this.username =
      this.route.snapshot.paramMap.get('username') ||
      localStorage.getItem('username');
  }

  // ✅ View profile
  viewProfile(): void {
    if (!this.username) {
      alert('Username not found. Please login again.');
      return;
    }

    this.hostService.getHostIdByUsername(this.username).subscribe({
      next: (hostId: number) => {
        this.router.navigate([`/host/profile/${hostId}`]);
      },
      error: () => {
        alert('Unable to load profile. Please login again.');
      }
    });
  }

  // ✅ Add property
  addProperty(): void {
    if (!this.username) {
      alert('Username not found. Please login again.');
      return;
    }

    this.hostService.getHostIdByUsername(this.username).subscribe({
      next: (hostId: number) => {
        this.router.navigate([`/host/${hostId}/add-property`]);
      },
      error: () => {
        alert('Unable to fetch host details. Please login again.');
      }
    });
  }

  // ✅ View properties — now navigates to dedicated page
  viewProperties(): void {
    if (!this.username) {
      alert('Username not found. Please login again.');
      return;
    }
    this.router.navigate([`/host/${this.username}/properties`]);
  }

  // ✅ Logout
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { role: 'host' } });
  }

  viewBookings(): void {
  if (!this.username) {
    alert('Username not found. Please login again.');
    return;
  }

  this.hostService.getHostIdByUsername(this.username).subscribe({
    next: (hostId: number) => {
      // Navigate to the booking component route for host
      this.router.navigate([`/host/bookings/${hostId}`], { queryParams: { role: 'host' } });
    },
    error: () => {
      alert('Unable to fetch host details. Please login again.');
    }
  });
}
}
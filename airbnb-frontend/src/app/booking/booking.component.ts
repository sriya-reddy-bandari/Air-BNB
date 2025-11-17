import { Component, OnInit } from '@angular/core';
import { GuestService } from '../services/guest.service';
import { HostService } from '../services/host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {
  userRole: 'guest' | 'host' = 'guest';
  bookings: any[] = [];
  userId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly guestService: GuestService,
    private readonly hostService: HostService
  ) {}

  ngOnInit(): void {
    // Get role from query param if provided
    const paramRole = this.route.snapshot.queryParamMap.get('role');
    if (paramRole === 'guest' || paramRole === 'host') {
      this.userRole = paramRole;
    }

    // Get userId from route params or fallback to localStorage
    const paramId = this.route.snapshot.paramMap.get('guestId') || this.route.snapshot.paramMap.get('hostId');
    this.userId = paramId ? Number(paramId) : Number(localStorage.getItem(this.userRole + 'Id'));

    if (!this.userId) {
      alert('Please login again');
      this.router.navigate(['/login'], { queryParams: { role: this.userRole } });
      return;
    }

    // Fetch bookings based on role
    if (this.userRole === 'guest') {
      this.guestService.getGuestBookings(this.userId).subscribe({
        next: (data) => this.bookings = data,
        error: (err) => { alert('Unable to load bookings'); console.error(err); }
      });
    } else {
      this.hostService.getHostBookings(this.userId).subscribe({
        next: (data) => this.bookings = data,
        error: (err) => { alert('Unable to load bookings'); console.error(err); }
      });
    }
  }

  viewPropertyDetails(propertyId: number) {
    if (!this.userId) return;
    this.router.navigate([`/property-details/${this.userId}/${propertyId}`]);
  }
}
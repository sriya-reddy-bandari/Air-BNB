import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestService } from '../services/guest.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-profile',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './guest-profile.component.html',
  styleUrl: './guest-profile.component.css'
})
export class GuestProfileComponent  implements OnInit {
     guestId!: number;
  guest: any;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly guestService: GuestService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Fetch host ID from route param (e.g., /host/profile/3)
    const routeGuestId = this.route.snapshot.paramMap.get('id');

    if (!routeGuestId) {
      this.errorMessage = 'No guest ID provided.';
      return;
    }

    this.guestId = Number(routeGuestId);
    this.loadGuestProfile(this.guestId);
  }

  // ✅ Load host profile details
  loadGuestProfile(id: number): void {
    this.guestService.getGuestDetails(id).subscribe({
      next: (data) => {
        this.guest = data;
        console.log('Fetched guest details:', data);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.errorMessage = 'Failed to load guest profile.';
      }
    });
  }

  // ✅ Navigate back to dashboard (with username)
  goBack(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.router.navigate([`/guest-dashboard/${username}`]);
    } else {
      this.router.navigate(['/login'], { queryParams: { role: 'guest' } });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestService } from '../services/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-guest-dashboard',
  imports: [ CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  standalone:true,
  templateUrl: './guest-dashboard.component.html',
  styleUrl: './guest-dashboard.component.css'
})
export class GuestDashboardComponent implements OnInit {
      username: string | null = null;
  city: string = '';
  checkInDate: Date | null = null;

  properties: any[] = [];
  fetchedImages: { [propertyId: number]: string } = {};

  bookings: any[] = [];

  private readonly BASE_URL = 'http://localhost:8085/api/host/uploads/';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly guestService: GuestService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username') || localStorage.getItem('username');

    // 🔥 Fetch guestId using username and store in localStorage
    if (this.username) {
      this.guestService.getGuestIdByUsername(this.username).subscribe({
        next: (guestId: number) => {
          localStorage.setItem("guestId", guestId.toString());
        },
        error: () => {
          console.error("Failed to fetch guestId");
        }
      });
    }
  }

  viewProfile(): void {
    if (!this.username) {
      alert('Username not found. Please login again.');
      return;
    }

    this.guestService.getGuestIdByUsername(this.username).subscribe({
      next: (guestId: number) => {
        this.router.navigate([`/guest/profile/${guestId}`]);
      },
      error: () => {
        alert('Unable to load profile. Please login again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { role: 'guest' } });
  }

  // 🔎 SEARCH PROPERTIES
 search(): void {
  if (!this.city || !this.checkInDate) {
    alert("Please select city and check-in date");
    return;
  }

  // Format date as local YYYY-MM-DD
  const formattedDate = this.checkInDate.getFullYear() + '-' +
                        String(this.checkInDate.getMonth() + 1).padStart(2, '0') + '-' +
                        String(this.checkInDate.getDate()).padStart(2, '0');

  localStorage.setItem("checkInDate", formattedDate);

  this.guestService.searchProperties(this.city, formattedDate).subscribe({
    next: (result) => {
      this.properties = result;
      console.log("Available Properties:", this.properties);

      if (this.properties.length === 0) {
        alert("No available properties found");
        return;
      }

      for (const property of this.properties) {
        if (property.photos?.length) {
          this.fetchImage(property.id, property.photos[0]);
        }
      }
    },
    error: () => alert("Unable to search properties")
  });
}

  // 🖼 FETCH IMAGE FOR EACH PROPERTY
  fetchImage(propertyId: number, filename: string): void {
    const token = localStorage.getItem('token');
    if (!token || !filename) return;

    const cleaned = filename.startsWith('/uploads/')
      ? filename.replace('/uploads/', '')
      : filename;

    const encoded = encodeURIComponent(cleaned);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.BASE_URL}${encoded}`, { headers, responseType: 'blob' })
      .subscribe({
        next: (blob) => this.fetchedImages[propertyId] = URL.createObjectURL(blob),
        error: (err) => console.error('Failed to load image:', filename, err)
      });
  }

  getImage(property: any): string {
    return this.fetchedImages[property.id] || '';
  }

  // ⭐ PASS guestId + propertyId IN URL
  viewDetails(propertyId: number): void {
    const guestId = localStorage.getItem("guestId");

    if (!guestId) {
      alert("Please login again");
      return;
    }

    this.router.navigate([`/property-details/${guestId}/${propertyId}`]);
  }


viewBookings(): void {
  const guestId = localStorage.getItem("guestId");
  if (!guestId) {
    alert("Please login again");
    return;
  }

   this.router.navigate([`/guest/bookings/${guestId}`], { queryParams: { role: 'guest' } });
}

} 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestService } from '../services/guest.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guest-property-details',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './guest-property-details.component.html',
  styleUrl: './guest-property-details.component.css'
})
export class GuestPropertyDetailsComponent implements OnInit {


  property: any;
  fetchedImages: string[] = [];
  guestId!: number;
  checkInDate!: string; // from localStorage
  private readonly BASE_URL = 'http://localhost:8085/api/host/uploads/';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly guestService: GuestService,
    private readonly http: HttpClient,
    private readonly router:Router
  ) {}

  ngOnInit(): void {

    // ✔ get guestId from URL
    this.guestId = Number(this.route.snapshot.paramMap.get('guestId'));

    // ✔ get propertyId from URL
    const propertyId = Number(this.route.snapshot.paramMap.get('propertyId'));

    // ✔ get checkin date from localStorage
    this.checkInDate = localStorage.getItem('checkInDate') || '';

    this.guestService.getPropertyById(propertyId).subscribe({
      next: (data) => {
        this.property = data;

        if (this.property.photos?.length) {
          this.loadAllImages(this.property.photos);
        }
      },
      error: () => alert('Failed to load property details')
    });
  }

  loadAllImages(photos: string[]): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    for (const photo of photos) {
      const cleanedName = photo.startsWith('/uploads/')
        ? photo.replace('/uploads/', '')
        : photo;

      const encoded = encodeURIComponent(cleanedName);

      this.http.get(`${this.BASE_URL}${encoded}`, { headers, responseType: 'blob' })
        .subscribe({
          next: (blob) => this.fetchedImages.push(URL.createObjectURL(blob)),
          error: (err) => console.error("Image load failed:", err)
        });
    }
  }

bookNow(propertyId: number) {
  const guestId = this.guestId;
  const checkInDate = this.checkInDate;

  if (!guestId || !checkInDate) {
    console.error("GuestId or checkInDate missing");
    alert("Guest info or check-in date missing!");
    return;
  }

  this.guestService.createBooking(guestId, propertyId, checkInDate)
    .subscribe({
      next: (booking: any) => {
        console.log("Booking created:", booking);
        alert(`Booking created successfully! Booking ID: ${booking.id}`);
      },
      error: err => {
        console.error("Booking create failed", err);
        if (err.status === 401) {
          alert("You are not authorized! Please login again.");
        } else {
          alert("Booking failed. Check console for details.");
        }
      }
    });
}


goBack(): void {
   const username = localStorage.getItem('username');
      this.router.navigate([`/guest-dashboard/${username}`]);
  }

}
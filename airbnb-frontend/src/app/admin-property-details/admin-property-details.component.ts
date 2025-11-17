import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-property-details',
  imports: [CommonModule],
  standalone:true,
  templateUrl: './admin-property-details.component.html',
  styleUrl: './admin-property-details.component.css'
})
export class AdminPropertyDetailsComponent implements OnInit {

  property: any;
  images: string[] = [];
  loading = true;

  private readonly UPLOAD_URL = 'http://localhost:8085/api/host/uploads/';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly adminService: AdminService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const propertyId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Fetch property details using correct GET endpoint
    this.adminService.getPropertyByIdForAdmin(propertyId).subscribe({
      next: (data) => {
        this.property = data;
        this.loading = false;

        // Load all images
        if (this.property.photos?.length) {
          for (const file of this.property.photos) {
            this.fetchImage(file);
          }
        }
      },
      error: () => {
        this.loading = false;
        console.error("Failed to load property details");
      }
    });
  }

  // Fetch image blobs
  fetchImage(filename: string) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const clean = filename.startsWith('/uploads/')
      ? filename.replace('/uploads/', '')
      : filename;

    const encoded = encodeURIComponent(clean);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${this.UPLOAD_URL}${encoded}`, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.images.push(url);
      },
      error: (err) => console.error("Image failed:", filename, err)
    });
  }

  // Approve
  approve() {
    this.adminService.approveProperty(this.property.id).subscribe({
      next: () => {
        alert('Property approved!');
        this.router.navigate(['/admin/properties/pending']);
      }
    });
  }

  // Reject
  reject() {
    this.adminService.rejectProperty(this.property.id).subscribe({
      next: () => {
        alert('Property rejected.');
        this.router.navigate(['/admin/properties/pending']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/properties/pending']);
  }
}
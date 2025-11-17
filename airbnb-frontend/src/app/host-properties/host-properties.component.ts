import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from '../services/host.service';
import { CommonModule } from '@angular/common';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-host-properties',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './host-properties.component.html',
  styleUrl: './host-properties.component.css'
})
export class HostPropertiesComponent implements OnInit {
   username: string | null = null;
  properties: any[] = [];
  loading = false;
  message = '';
  fetchedImages: { [propertyId: number]: string } = {};
  private hostId!: number; // store hostId from backend
  private readonly BASE_URL = 'http://localhost:8085/api/host/uploads/';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly hostService: HostService,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    if (!this.username) {
      this.message = 'Username not found. Please login again.';
      return;
    }
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;

    // Get hostId from backend
    this.hostService.getHostIdByUsername(this.username!).subscribe({
      next: (hostId: number) => {
        this.hostId = hostId;
        // Get properties for this host
        this.hostService.getHostProperties(hostId).subscribe({
          next: (data) => {
            this.properties = data;
            this.loading = false;
            this.message = data.length ? '' : 'No properties found for this host.';

            // Fetch first photo for each property
            for (const property of data) {
              if (property.photos?.length) {
                this.fetchImage(property.id, property.photos[0]);
              }
            }
          },
          error: () => {
            this.loading = false;
            this.message = 'Failed to load properties.';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.message = 'Unable to fetch host details.';
      }
    });
  }

  fetchImage(propertyId: number, filename: string): void {
    const token = localStorage.getItem('token');
    if (!token || !filename) return;

    const cleanedFilename = filename.startsWith('/uploads/') ? filename.replace('/uploads/', '') : filename;
    const encodedFilename = encodeURIComponent(cleanedFilename);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get(`${this.BASE_URL}${encodedFilename}`, { headers, responseType: 'blob' })
      .subscribe({
        next: (blob) => this.fetchedImages[propertyId] = URL.createObjectURL(blob),
        error: (err) => console.error('Failed to load image:', filename, err)
      });
  }

  getImage(property: any): string {
    return this.fetchedImages[property.id] || '';
  }

  viewPropertyDetails(propertyId: number): void {
    this.router.navigate([`/host/${this.hostId}/property/${propertyId}`]);
  }

  goBack(): void {
    this.router.navigate(['/host-dashboard', this.username]);
  }
}

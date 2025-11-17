import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from '../services/host.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-host-property-details',
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  standalone:true,
  templateUrl: './host-property-details.component.html',
  styleUrl: './host-property-details.component.css'
})
export class HostPropertyDetailsComponent implements OnInit {
  property: any = null;
  fetchedImages: string[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = true;
  message = '';
  private readonly BASE_URL = 'http://localhost:8085/api/host/uploads/';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hostService: HostService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const hostIdParam = this.route.snapshot.paramMap.get('hostId');
    const propertyIdParam = this.route.snapshot.paramMap.get('propertyId');

    if (!hostIdParam || !propertyIdParam) {
      this.message = 'Invalid property selection';
      this.loading = false;
      return;
    }

    const hostId = Number(hostIdParam);
    const propertyId = Number(propertyIdParam);

    this.hostService.getPropertyById(hostId, propertyId).subscribe({
      next: (data) => {
        if (!data) {
          this.message = 'Property not found';
          this.loading = false;
          return;
        }
        this.property = data;
        this.loading = false;
        this.loadAllImages(data.photos);
      },
      error: () => {
        this.message = 'Failed to load property details';
        this.loading = false;
      }
    });
  }

  loadAllImages(photos: string[]): void {
    const token = localStorage.getItem('token');
    if (!photos?.length || !token) return;

    this.fetchedImages = [];
    for (const filename of photos) {
      const cleanedFilename = filename.startsWith('/uploads/') ? filename.replace('/uploads/', '') : filename;
      const encodedFilename = encodeURIComponent(cleanedFilename);
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http.get(`${this.BASE_URL}${encodedFilename}`, { headers, responseType: 'blob' })
        .subscribe({
          next: (blob) => this.fetchedImages.push(URL.createObjectURL(blob)),
          error: (err) => console.error('Failed to load image:', filename, err)
        });
    }
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.previewUrls = [];

    for (const file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrls.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async uploadNewPhotos(): Promise<string[]> {
    if (!this.selectedFiles.length) return [];
    try {
      return await this.hostService.uploadPhotos(this.selectedFiles);
    } catch (e) {
      console.error('Photo upload failed', e);
      return [];
    }
  }

  async updateProperty(): Promise<void> {
  if (!this.property?.id) return;

  const hostIdParam = this.route.snapshot.paramMap.get('hostId');
  if (!hostIdParam) {
    this.message = 'Host ID missing';
    return;
  }
  const hostId = Number(hostIdParam);

  this.loading = true;
  this.message = '';

  // Upload new photos and merge with existing
  const newPhotoUrls = await this.uploadNewPhotos();
  this.property.photos = [...(this.property.photos || []), ...newPhotoUrls];

  console.log('Sending PATCH request:', this.property);

  this.hostService.updateProperty(hostId, this.property.id, this.property)
    .subscribe({
      next: (updated) => {
        this.property = updated;
        this.previewUrls = [];
        this.selectedFiles = [];
        this.message = '✅ Property updated successfully!';
        this.loading = false;

        // Refresh fetched images
        this.loadAllImages(this.property.photos);
      },
      error: (err) => {
        console.error('Failed to update property', err);
        this.message = '❌ Failed to update property.';
        this.loading = false;
      }
    });
    const username = localStorage.getItem('username');
    this.router.navigate([`/host/${username}/properties`]);
}

  calculateHostEarnings() {
    const weekday = Number(this.property.weekdayPrice) || 0;
    const weekend = Number(this.property.weekendPrice) || 0;
    this.property.hostEarningWeekday = +(weekday * 0.9).toFixed(2);
    this.property.hostEarningWeekend = +(weekend * 0.9).toFixed(2);
  }

  async requestDeleteProperty(): Promise<void> {
  if (!this.property?.id) return;

  const hostIdParam = this.route.snapshot.paramMap.get('hostId');
  if (!hostIdParam) {
    this.message = 'Host ID missing';
    return;
  }
  const hostId = Number(hostIdParam);

  if (!confirm('Are you sure you want to request deletion of this property?')) return;

  this.loading = true;
  this.message = '';

  this.hostService.requestDeleteProperty(hostId, this.property.id)
    .subscribe({
      next: (res) => {
        this.property.status = res.status; // Update status locally
        this.message = '✅ Delete request submitted successfully!';
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to request property deletion', err);
        this.message = '❌ Failed to submit delete request.';
        this.loading = false;
      }
    });
}


  goBack(): void {
    this.router.navigate(['/host-dashboard', this.property?.host?.username || '']);
  }
}
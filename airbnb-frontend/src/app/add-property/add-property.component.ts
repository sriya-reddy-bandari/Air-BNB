import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HostService } from '../services/host.service';

@Component({
  selector: 'app-add-property',
  imports: [ CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule],
  standalone:true,
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})
export class AddPropertyComponent implements AfterViewInit, OnInit {
    property: any = {
    title: '',
    description: '',
    propertyType: '',
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    wifi: false,
    airConditioner: false,
    parking: false,
    swimmingPool: false,
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    weekdayPrice: 0,
    weekendPrice: 0,
    hostEarningWeekday: 0,
    hostEarningWeekend: 0,
    photos: []
  };

  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  hostId: string | null = null;
  message = '';
  loading = false;

  constructor(
    private readonly hostService: HostService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hostId = this.route.snapshot.paramMap.get('hostId');
  }

  ngAfterViewInit(): void {
    const map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    let marker: any;
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.property.latitude = lat;
      this.property.longitude = lng;

      if (marker) marker.remove();
      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
        .openPopup();
    });
  }

  onFilesSelected(event: any) {
    // Keep previously selected files
    const newFiles = Array.from<File>(event.target.files);
    this.selectedFiles = [...this.selectedFiles, ...newFiles];

    // Generate preview URLs
    for (const file of newFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrls.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  async addProperty() {
    if (!this.hostId) {
      alert('Host ID not found.');
      return;
    }

    this.loading = true;

    try {
      // Upload all selected files
      const photoUrls = await this.hostService.uploadPhotos(this.selectedFiles);
      this.property.photos = photoUrls;

      // Submit property with uploaded photo URLs
      this.hostService.addProperty(this.hostId, this.property).subscribe({
        next: () => {
          this.message = '✅ Property added successfully!';
          this.loading = false;
          setTimeout(() => {
            const username = localStorage.getItem('username');
            this.router.navigate([`/host-dashboard/${username}`]);
          }, 1500);
        },
        error: (err) => {
          console.error('Error adding property:', err);
          this.message = '❌ Failed to add property.';
          this.loading = false;
        }
      });
    } catch (e) {
      console.error('Photo upload failed:', e);
      this.loading = false;
    }
  }

  calculateHostEarnings() {
    const weekday = Number(this.property.weekdayPrice) || 0;
    const weekend = Number(this.property.weekendPrice) || 0;

    this.property.hostEarningWeekday = +(weekday * 0.9).toFixed(2);
    this.property.hostEarningWeekend = +(weekend * 0.9).toFixed(2);
  }

  goBack() {
    const username = localStorage.getItem('username');
    this.router.navigate([`/host-dashboard/${username}`]);
  }
}
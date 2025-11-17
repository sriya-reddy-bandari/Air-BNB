import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-delete-request-property',
  imports: [CommonModule, MatTableModule],
  standalone:true,
  templateUrl: './admin-delete-request-property.component.html',
  styleUrl: './admin-delete-request-property.component.css'
})
export class AdminDeleteRequestPropertyComponent implements OnInit {

  properties: any[] = [];
  loading = true;

  displayedColumns: string[] = [
    'id', 'title', 'type', 'city', 'status', 'actions'
  ];

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeleteRequestedProperties();
  }

  loadDeleteRequestedProperties() {
    this.adminService.getPropertiesByStatus('DELETE_REQUESTED').subscribe({
      next: (data) => {
        this.properties = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load pending properties', err);
        this.loading = false;
      }
    });
  }

  approveDelete(propertyId: number) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.adminService.approveDeleteProperty(propertyId).subscribe({
        next: (res) => {
          console.log('Property deleted successfully', res);
          this.properties = this.properties.filter(p => p.id !== propertyId);
        },
        error: (err) => {
          console.error('Failed to delete property', err);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }

}
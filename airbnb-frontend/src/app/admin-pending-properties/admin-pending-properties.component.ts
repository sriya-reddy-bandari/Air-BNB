import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-pending-properties',
  imports: [CommonModule, MatTableModule],
  standalone:true,
  templateUrl: './admin-pending-properties.component.html',
  styleUrl: './admin-pending-properties.component.css'
})
export class AdminPendingPropertiesComponent  implements OnInit {

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
    this.adminService.getPropertiesByStatus('PENDING_APPROVAL').subscribe({
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

  viewDetails(propertyId: number) {
    this.router.navigate([`/admin/property-details/${propertyId}`]);
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
  }


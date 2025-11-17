import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-guest-list',
  imports: [CommonModule, MatTableModule, MatButtonModule],
  standalone:true,
  templateUrl: './admin-guest-list.component.html',
  styleUrl: './admin-guest-list.component.css'
})
export class AdminGuestListComponent implements OnInit{
   guests: any[] = [];
  loading = true;
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address'];

  constructor(private readonly adminService: AdminService, private readonly router: Router) {}

  ngOnInit() {
    this.adminService.getAllGuests().subscribe({
      next: (data) => {
        this.guests = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load guests', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}


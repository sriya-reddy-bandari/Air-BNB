import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-host-list',
  imports: [CommonModule, MatTableModule, MatButtonModule],
  standalone:true,
  templateUrl: './admin-host-list.component.html',
  styleUrl: './admin-host-list.component.css'
})
export class AdminHostListComponent implements OnInit {
  hosts: any[] = [];
  loading = true;
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address'];

  constructor(private readonly adminService: AdminService, private readonly router: Router) {}

  ngOnInit() {
    this.adminService.getAllHosts().subscribe({
      next: (data) => {
        this.hosts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load hosts', err);
        this.loading = false;
      }
    });
  }

    goBack(): void {
    this.router.navigate(['/admin-dashboard']);
  }
}

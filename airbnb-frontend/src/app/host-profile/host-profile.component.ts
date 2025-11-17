import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HostService } from '../services/host.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-host-profile',
  imports: [NgIf],
  standalone:true,
  templateUrl: './host-profile.component.html',
  styleUrls: ['./host-profile.component.css'] 
})
export class HostProfileComponent implements OnInit {
     hostId!: number;
  host: any;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly hostService: HostService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Fetch host ID from route param (e.g., /host/profile/3)
    const routeHostId = this.route.snapshot.paramMap.get('id');

    if (!routeHostId) {
      this.errorMessage = 'No host ID provided.';
      return;
    }

    this.hostId = Number(routeHostId);
    this.loadHostProfile(this.hostId);
  }

  // ✅ Load host profile details
  loadHostProfile(id: number): void {
    this.hostService.getHostDetails(id).subscribe({
      next: (data) => {
        this.host = data;
        console.log('Fetched host details:', data);
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.errorMessage = 'Failed to load host profile.';
      }
    });
  }

  // ✅ Navigate back to dashboard (with username)
  goBack(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.router.navigate([`/host-dashboard/${username}`]);
    } else {
      this.router.navigate(['/login'], { queryParams: { role: 'host' } });
    }
  }
}
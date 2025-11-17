import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HostService } from '../services/host.service';
import { GuestService } from '../services/guest.service';


@Component({
  selector: 'app-login',
  imports: [ MatFormFieldModule,FormsModule,NgIf,MatInputModule],
  standalone:true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
  username = '';
  password = '';
  errorMessage = '';
  role = 'guest';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly hostService: HostService,
    private readonly guestService:GuestService
  ) {}

  ngOnInit(): void {
    // Get role (host/admin/guest) from query params
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'guest';
    });
  }

  // ✅ Login method
  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.authService.login(this.role, this.username, this.password).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('token', token);
        localStorage.setItem('role', this.role);
        localStorage.setItem('username', this.username);

        if (this.role === 'host') {
          this.checkHostProfile();
        } else if (this.role === 'admin') {
          this.navigateToAdminDashboard();
        } else { // guest
          this.checkGuestProfile();
        }
      },
      error: () => (this.errorMessage = 'Invalid credentials or user not found.')
    });
  }

  // ✅ Host profile check
  private checkHostProfile(): void {
    this.hostService.checkHostExists(this.username).subscribe({
      next: (profileStatus) => this.handleHostProfileStatus(profileStatus),
      error: () => {
        this.errorMessage = 'Error checking host profile.';
      }
    });
  }

  private handleHostProfileStatus(status: 'EXISTS' | 'NEW'): void {
    if (status === 'EXISTS') {
      this.navigateToHostDashboard();
    } else if (status === 'NEW') {
      this.navigateToCreateHost();
    }
  }

  private navigateToHostDashboard(): void {
    const username = localStorage.getItem('username');
    this.router.navigate([`/host-dashboard/${username}`]);
  }

  private navigateToCreateHost(): void {
    const username = localStorage.getItem('username');
    this.router.navigate([`/host/${username}/create`]);
  }

  private navigateToAdminDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  private navigateToGuestDashboard(): void {
    const username = localStorage.getItem('username');
    this.router.navigate([`/guest-dashboard/${username}`]);
  }

  // ✅ Guest profile check
  private checkGuestProfile(): void {
  this.guestService.checkGuestExists(this.username).subscribe({
    next: (profileStatus) => {
      this.handleGuestProfileStatus(profileStatus);
    },
    error: (err) => {
      this.errorMessage = 'Error checking guest profile.';
    }
  });
}

  private handleGuestProfileStatus(status: 'EXISTS' | 'NEW'): void {
    if (status === 'EXISTS') {
      this.navigateToGuestDashboard();
    } else if (status === 'NEW') {
      this.navigateToCreateGuest();
    }
  }

  private navigateToCreateGuest(): void {
    const username = localStorage.getItem('username');
    this.router.navigate([`/guest/${username}/create`]);
  }

  // ✅ Navigate to signup page
  goToSignup(): void {
    this.router.navigate(['/signup'], { queryParams: { role: this.role } });
  }
}
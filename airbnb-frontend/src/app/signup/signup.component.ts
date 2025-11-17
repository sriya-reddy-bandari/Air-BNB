import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  username = '';
  password = '';
  role = 'guest';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'] || 'guest';
    });
  }

  signup() {
    this.authService.signUp(this.role, this.username, this.password).subscribe({
      next: () => {
        alert(`Signup successful as ${this.role}! Please login.`);
        this.router.navigate(['/login'], { queryParams: { role: this.role } });
      },
      error: () => (this.errorMessage = 'username already exists')
    });
  }

  goToLogin() {
    this.router.navigate(['/login'], { queryParams: { role: this.role } });
  }
}

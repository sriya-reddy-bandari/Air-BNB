import { Component } from '@angular/core';
import { GuestService } from '../services/guest.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-guest',
  imports: [CommonModule,      
    FormsModule,         
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule ],
    standalone:true,
  templateUrl: './create-guest.component.html',
  styleUrl: './create-guest.component.css'
})
export class CreateGuestComponent {
     guest = { name: '', email: '', phone: '', address: '' };
  message = '';
  error = '';

  constructor(
    private readonly guestService: GuestService,
    private readonly router: Router
  ) {}

  createGuest() {
    if (!this.guest.name || !this.guest.email || !this.guest.phone || !this.guest.address) {
      this.error = 'Please fill all fields.';
      return;
    }

    this.guestService.createGuest(this.guest).subscribe({
      next: (response: any) => {
        this.message = '✅ Guest profile created successfully!';
        const username = localStorage.getItem('username') || this.guest.email;
        this.router.navigate([`/guest-dashboard/${username}`]);
      },
      error: (err) => {
        console.error('Create Guest Error:', err);
        this.error = '❌ Error while creating guest. Please try again.';
      }
    });
  }
}

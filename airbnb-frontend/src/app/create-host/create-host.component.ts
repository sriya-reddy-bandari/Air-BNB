import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { HostService } from '../services/host.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-host',
  imports: [CommonModule,      
    FormsModule,         
    MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,    
    ],
  standalone:true,
  templateUrl: './create-host.component.html',
  styleUrl: './create-host.component.css'
})
export class CreateHostComponent {
     host = { name: '', email: '', phone: '', address: '' };
  message = '';
  error = '';

  constructor(
    private readonly hostService: HostService,
    private readonly router: Router
  ) {}

  createHost() {
  this.hostService.createHost(this.host).subscribe({
    next: (response: any) => {
      this.message = '✅ Host created successfully!';
      const username = localStorage.getItem('username'); // or from response if available
      this.router.navigate([`/host-dashboard/${username}`]);
    },
    error: (err) => {
      console.error('Create Host Error:', err);
      this.error = '❌ Error while creating host. Please try again.';
    }
  });
}

}

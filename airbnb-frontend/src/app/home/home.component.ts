import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

   title = 'Welcome to AirBNB'; 

  aboutText = `
    StayEase is your one-stop platform for finding, hosting, and managing stays
    with comfort and convenience. Whether you're a guest looking for a cozy home,
    a host managing multiple listings, or an admin overseeing operations — 
    our platform ensures a smooth and secure experience for everyone.
  `;

  features = [
    '🌍 Discover top-rated accommodations around the world.',
    '🏠 Become a host and list your property easily.',
  ];
}
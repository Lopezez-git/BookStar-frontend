import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-header.html',
  styleUrls: ['./auth-header.css']
})
export class AuthHeaderComponent {
  
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
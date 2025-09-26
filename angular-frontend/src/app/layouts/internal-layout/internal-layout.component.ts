import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-internal-layout',
  imports: [MatIconModule,RouterOutlet],
  templateUrl: './internal-layout.component.html',
  styleUrl: './internal-layout.component.scss'
})
export class InternalLayoutComponent {
  isDarkMode = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';
    this.updateTheme();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.updateTheme();
  }

  updateTheme(): void {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  logout(): void {
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}

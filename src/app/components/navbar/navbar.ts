import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  scrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
  }
}
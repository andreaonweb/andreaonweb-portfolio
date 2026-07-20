import { Component, ElementRef, HostListener, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  scrolled = false;
  menuOpen = false;
  activeSection = 'hero';

  private readonly sectionIds = ['about', 'skills', 'projects', 'contact'];
  private indicator: HTMLElement | null = null;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.indicator = this.el.nativeElement.querySelector('.nav-indicator');
      this.updateActiveSection();
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onResize() {
    this.moveIndicator();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  private updateActiveSection() {
    const viewportCenter = window.innerHeight / 2;
    let current = 'hero';

    for (const id of this.sectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        current = id;
        break;
      }
    }

    if (current !== this.activeSection) {
      this.activeSection = current;
    }
    this.moveIndicator();
  }

  private moveIndicator() {
    if (!this.indicator) return;
    const active = this.el.nativeElement.querySelector<HTMLElement>('a.active');

    if (!active) {
      gsap.to(this.indicator, { opacity: 0, duration: 0.2 });
      return;
    }

    gsap.to(this.indicator, {
      opacity: 1,
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}

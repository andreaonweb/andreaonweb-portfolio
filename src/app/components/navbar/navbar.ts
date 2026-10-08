import { Component, ElementRef, HostListener, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  scrolled = false;
  hidden = false;
  menuOpen = false;
  activeSection = 'hero';

  readonly links = [
    { id: 'projects', label: 'Proyectos' },
    { id: 'about', label: 'Sobre mí' },
    { id: 'skills', label: 'Stack' },
    { id: 'journey', label: 'Recorrido' },
    { id: 'contact', label: 'Contacto' },
  ];

  private indicator: HTMLElement | null = null;
  private lastY = 0;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.indicator = this.el.nativeElement.querySelector('.nav-indicator');
      this.updateActiveSection();
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    this.scrolled = y > 40;
    // Se oculta al bajar y reaparece al subir
    this.hidden = y > 400 && y > this.lastY;
    this.lastY = y;
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onResize() {
    this.moveIndicator();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.menuOpen) this.closeMenu();
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

    for (const { id } of this.links) {
      const section = document.getElementById(id);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        current = id;
        break;
      }
    }

    this.activeSection = current;
    this.moveIndicator();
  }

  private moveIndicator() {
    if (!this.indicator) return;
    const active = this.el.nativeElement.querySelector<HTMLElement>(`.links a[href="#${this.activeSection}"]`);

    if (!active || window.innerWidth <= 860) {
      gsap.to(this.indicator, { opacity: 0, duration: 0.2 });
      return;
    }

    gsap.to(this.indicator, {
      opacity: 1,
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: 0.4,
      ease: 'power3.out',
    });
  }
}

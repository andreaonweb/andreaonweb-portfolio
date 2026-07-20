import { Component, ElementRef, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      const root = this.el.nativeElement;
      const entranceTargets = root.querySelectorAll(
        '.hero-tag, .pre-title, h1, .tagline, .description, .cta'
      );

      gsap.set(entranceTargets, { opacity: 0, y: 20 });
      gsap.to(entranceTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
      });

      root.querySelectorAll<HTMLElement>('.blob').forEach((blob, i) => {
        gsap.to(blob, {
          x: i % 2 === 0 ? 40 : -30,
          y: i % 2 === 0 ? -25 : 35,
          duration: 10 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      root.querySelectorAll<HTMLElement>('.btn-primary, .btn-ghost').forEach((btn) => {
        const moveX = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
        const moveY = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          moveX((e.clientX - rect.left - rect.width / 2) * 0.3);
          moveY((e.clientY - rect.top - rect.height / 2) * 0.3);
        });

        btn.addEventListener('mouseleave', () => {
          moveX(0);
          moveY(0);
        });
      });
    });
  }
}

import { Component, ElementRef, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      gsap.registerPlugin(ScrollTrigger);

      const root = this.el.nativeElement;
      const entranceTargets = root.querySelectorAll(
        '.hero-tag, h1, .role-line, .description, .cta, .hero-float-card'
      );

      gsap.set(entranceTargets, { opacity: 0, y: 20 });
      gsap.to(entranceTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
      });

      const kanjiEl = root.querySelector('.hero-kanji');
      gsap.set(kanjiEl, { opacity: 0 });
      gsap.to(kanjiEl, { opacity: 0.95, duration: 0.7, delay: 0.5, ease: 'power2.out' });

      const blobs = Array.from(root.querySelectorAll<HTMLElement>('.blob'));

      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          xPercent: i % 2 === 0 ? 10 : -8,
          yPercent: i % 2 === 0 ? -7 : 9,
          duration: 10 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      const blobParallax = blobs.map((blob, i) => ({
        moveX: gsap.quickTo(blob, 'x', { duration: 0.6, ease: 'power2.out' }),
        moveY: gsap.quickTo(blob, 'y', { duration: 0.6, ease: 'power2.out' }),
        strength: 14 + i * 6,
      }));

      root.addEventListener('mousemove', (e) => {
        const rect = root.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        blobParallax.forEach(({ moveX, moveY, strength }) => {
          moveX(relX * strength);
          moveY(relY * strength);
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

      gsap.to(root.querySelector('.hero-inner'), {
        opacity: 0,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(blobs, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }
}

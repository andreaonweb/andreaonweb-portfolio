import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { MagneticDirective } from '../../shared/magnetic.directive';
import { finePointer, reducedMotion } from '../../shared/motion';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  readonly nameChars = 'aonweb'.split('');
  readonly words = ['IA aplicada', 'Angular', 'Spring Boot', 'Python', 'mucho cariño'];
  readonly wordIndex = signal(0);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger, Draggable);
      const root: HTMLElement = this.el.nativeElement;

      const rotation = setInterval(() => this.nextWord(root), 2400);
      destroyRef.onDestroy(() => clearInterval(rotation));

      this.initDraggables(root);
      if (reducedMotion()) return;

      this.intro(root);
      this.initParallax(root);
      this.initScrollOut(root);
    });
  }

  private nextWord(root: HTMLElement): void {
    const word = root.querySelector('.word');
    const swap = () => this.wordIndex.update((i) => (i + 1) % this.words.length);

    if (!word || reducedMotion()) {
      swap();
      return;
    }

    gsap.to(word, {
      yPercent: -110,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        swap();
        gsap.fromTo(word, { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' });
      },
    });
  }

  private intro(root: HTMLElement): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from(root.querySelectorAll('.char'), {
      yPercent: 115,
      rotate: 8,
      duration: 0.9,
      stagger: 0.06,
      clearProps: 'transform',
    })
      .from(root.querySelectorAll('.hero-tag, .hello'), { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, 0.1)
      .from(
        root.querySelectorAll('.rotator, .description, .cta, .badge, .scroll-cue'),
        { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 },
        0.5
      )
      .from(
        root.querySelectorAll('.sticker'),
        { scale: 0, rotate: -30, duration: 0.8, stagger: 0.07, ease: 'back.out(2)' },
        0.6
      )
      .from(root.querySelectorAll('.sparkle, .drag-hint'), { opacity: 0, duration: 0.8 }, 1.2);
  }

  private initParallax(root: HTMLElement): void {
    if (!finePointer()) return;

    const slots = Array.from(root.querySelectorAll<HTMLElement>('.slot')).map((slot) => ({
      x: gsap.quickTo(slot, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(slot, 'y', { duration: 0.9, ease: 'power3' }),
      depth: Number(slot.dataset['depth'] ?? 20),
    }));
    const glow = root.querySelector<HTMLElement>('.hero-glow');
    const glowX = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3' });

    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width - 0.5;
      const relY = (e.clientY - r.top) / r.height - 0.5;
      slots.forEach((s) => {
        s.x(-relX * s.depth * 2);
        s.y(-relY * s.depth * 2);
      });
      glowX(relX * 160);
      glowY(relY * 120);
    });
  }

  private initDraggables(root: HTMLElement): void {
    const stickers = root.querySelectorAll<HTMLElement>('.sticker');
    // GSAP gestiona la rotación inicial para no duplicarla con el transform
    stickers.forEach((s) => gsap.set(s, { rotate: parseFloat(s.style.getPropertyValue('--r')) || 0 }));
    Draggable.create(stickers, {
      zIndexBoost: true,
      onPress() {
        gsap.to(this['target'], { scale: 1.15, duration: 0.25, ease: 'power2.out' });
      },
      onRelease() {
        gsap.to(this['target'], { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      },
    });
  }

  private initScrollOut(root: HTMLElement): void {
    const trigger = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };

    gsap.to(root.querySelector('.hero-inner'), { yPercent: 18, opacity: 0, scale: 0.94, ease: 'none', scrollTrigger: trigger });

    root.querySelectorAll<HTMLElement>('.slot').forEach((slot, i) => {
      const r = slot.getBoundingClientRect();
      const fromCenter = r.left + r.width / 2 < window.innerWidth / 2 ? -1 : 1;
      gsap.to(slot.firstElementChild, {
        xPercent: fromCenter * (120 + i * 20),
        yPercent: -80 - i * 15,
        rotate: fromCenter * 40,
        ease: 'none',
        scrollTrigger: trigger,
      });
    });
  }
}

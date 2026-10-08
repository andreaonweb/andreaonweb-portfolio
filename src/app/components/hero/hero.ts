import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  readonly words = ['IA aplicada', 'Angular', 'Spring Boot', 'Python'];
  readonly wordIndex = signal(0);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);
      const root: HTMLElement = this.el.nativeElement;

      const rotation = setInterval(() => this.nextWord(root), 2400);
      destroyRef.onDestroy(() => clearInterval(rotation));

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
      .from(
        root.querySelectorAll('.rotator, .description, .cta, .badge, .scroll-cue'),
        { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 },
        0.5
      );
  }

  private initParallax(root: HTMLElement): void {
    if (!finePointer()) return;

    const glow = root.querySelector<HTMLElement>('.hero-glow');
    const glowX = gsap.quickTo(glow, 'x', { duration: 1.2, ease: 'power3' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 1.2, ease: 'power3' });

    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width - 0.5;
      const relY = (e.clientY - r.top) / r.height - 0.5;
      glowX(relX * 160);
      glowY(relY * 120);
    });
  }

  private initScrollOut(root: HTMLElement): void {
    const trigger = { trigger: root, start: 'top top', end: 'bottom top', scrub: true };

    gsap.to(root.querySelector('.hero-inner'), { yPercent: 18, opacity: 0, scale: 0.94, ease: 'none', scrollTrigger: trigger });
  }
}

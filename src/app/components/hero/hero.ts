import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { finePointer, reducedMotion } from '../../shared/motion';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  readonly nameChars = 'aonweb'.split('');
  readonly words = ['IA aplicada', 'Angular', 'React', 'Spring Boot', 'Python'];
  readonly wordIndex = signal(0);

  // Sprites pixel (cada fila de la matriz es una fila de píxeles; dos fotogramas por marciano)
  readonly invaderRows = [
    { w: 8, a: toPath(SQUID_A), b: toPath(SQUID_B) },
    { w: 11, a: toPath(CRAB_A), b: toPath(CRAB_B) },
  ];
  readonly invaderCols = Array.from({ length: 8 });
  readonly buttons = ['var(--color-accent-4)', 'var(--color-accent-2)', 'var(--color-accent-3)', 'var(--color-accent)'];

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
        root.querySelectorAll('.rotator, .description, .cta, .scroll-cue'),
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

const SQUID_A = ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '..X..X..', '.X.XX.X.', 'X.X..X.X'];
const SQUID_B = ['...XX...', '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '.X.XX.X.', 'X......X', '.X....X.'];
const CRAB_A = ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'];
const CRAB_B = ['..X.....X..', 'X..X...X..X', 'X.XXXXXXX.X', 'XXX.XXX.XXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..X.....X..', '.X.......X.'];

/** Convierte una matriz de 'X' en un path SVG de cuadrados 1×1. */
function toPath(rows: string[]): string {
  return rows
    .flatMap((row, y) => [...row].map((c, x) => (c === 'X' ? `M${x} ${y}h1v1h-1z` : '')))
    .join('');
}

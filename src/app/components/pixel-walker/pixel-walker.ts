import { Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from '../../shared/motion';

interface Pixel {
  x: number;
  y: number;
  fill: string;
}

// Sprite del gato: C = cuerpo, E = ojo. Dos fotogramas que solo cambian las patas.
const BODY = [
  '..........C...C.',
  '..........CC.CC.',
  'C.........CCCCC.',
  'C.........CECEC.',
  'C.........CCCCC.',
  '.C..CCCCCCCCCC..',
  '..CCCCCCCCCCCC..',
  '...CCCCCCCCCCC..',
  '...CCCCCCCCCC...',
];
const LEGS_A = ['...C.C....C.C...', '..C...C..C...C..'];
const LEGS_B = ['....CC....CC....', '....CC....CC....'];

const COLORS: Record<string, string> = { C: '#f4ead7', E: '#1b1813' };

@Component({
  selector: 'app-pixel-walker',
  standalone: true,
  templateUrl: './pixel-walker.html',
  styleUrl: './pixel-walker.scss',
})
export class PixelWalkerComponent {
  readonly width = BODY[0].length;
  readonly height = BODY.length + LEGS_A.length;
  readonly frames = [toPixels([...BODY, ...LEGS_A]), toPixels([...BODY, ...LEGS_B])];

  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const root = this.el.nativeElement;
      const track = root.querySelector<HTMLElement>('.walker')!;
      const cat = root.querySelector<HTMLElement>('.cat')!;
      const dots = root.querySelector<HTMLElement>('.dots')!;
      const frames = Array.from(root.querySelectorAll<SVGElement>('.cat svg'));

      if (reducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      const distance = () => track.clientWidth - cat.offsetWidth;

      // El gato cruza mientras la franja atraviesa la pantalla y se va comiendo los puntos
      gsap.to(cat, {
        x: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.floor(self.progress * 48) % 2;
            frames.forEach((f, i) => f.classList.toggle('on', i === step));
            cat.classList.toggle('back', self.direction === -1);
            const eaten = self.progress * distance() + cat.offsetWidth * 0.75;
            dots.style.clipPath = `inset(0 0 0 ${eaten}px)`;
          },
        },
      });
    });
  }
}

function toPixels(rows: string[]): Pixel[] {
  const pixels: Pixel[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (COLORS[c]) pixels.push({ x, y, fill: COLORS[c] });
    })
  );
  return pixels;
}

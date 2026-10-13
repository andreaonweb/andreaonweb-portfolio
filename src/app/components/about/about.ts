import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { finePointer, reducedMotion } from '../../shared/motion';

const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

interface Pixel {
  x: number;
  y: number;
  fill: string;
}

// Gandalf el Gris. H/h sombrero, S/s piel, B/b barba, R/r túnica, T bastón, L luz del bastón, K botas.
// Ojos y cejas van aparte (about.html) para poder animarlos.
const WIZARD = [
  '................HH..........',
  '...............HH...........',
  '..............HHh...........',
  '.............HHHh...........',
  '.............HHHh...........',
  '............HHHHhh..........',
  '............HHHHhh.......L..',
  '...........HHHHHhh......LLL.',
  '...........HHHHHHhh......L..',
  '..........HHHHHHHhh......T..',
  '..........HHHHHHHHhh.....T..',
  '.....HHHHHHHHHHHHHHHHhh..T..',
  '....hhhhhhhhhhhhhhhhhhhh.T..',
  '.......bBSSSSSSSSSSBb....T..',
  '.......bBSSSSSSSSSSBb....T..',
  '.......bBSSSSSSSSSSBb....T..',
  '.......bBSSSSssSSSSBb....T..',
  '.......bBBBBSssSBBBBb....T..',
  '.......bBBBBBBBBBBBBb....T..',
  '.......bBBBBBbbBBBBBb....T..',
  '....RRRbBBBBBBBBBBBBbRRR.T..',
  '...RRRRbBBBBBBBBBBBBbRRRRT..',
  '...RRRRRbBBBBBBBBBBbRRRRRT..',
  '..RRRRRRRbBBBBBBBBbRRRRRSSS.',
  '..RRRRRRRRbBBBBBBbRRRRRRSSS.',
  '..rRRRRRRRRbBBBBbRRRRRRr.T..',
  '..rRRRRRRRRRbBBbRRRRRRRr.T..',
  '..rRRRRRRRRRRbbRRRRRRRRr.T..',
  '..rRRRRRRRRRRRRRRRRRRRRr.T..',
  '..rRRRRRRRRRRRRRRRRRRRRr.T..',
  '..rRRRRRRRRrRRRRRRRRRRRr.T..',
  '..rRRRRRRRRrRRRRRRRRRRRr.T..',
  '..rrrrrrrrrrrrrrrrrrrrrr.T..',
  '.......KKKK.....KKKK.....T..',
];

const WIZARD_COLORS: Record<string, string> = {
  H: '#8e8a96',
  h: '#6c6874',
  S: '#f0c9a3',
  s: '#d9a57f',
  B: '#ece6da',
  b: '#bdb4a4',
  R: '#8e8a96',
  r: '#6c6874',
  T: '#8a5a35',
  L: '#fff4c2',
  K: '#4a3a2a',
};

function spritePixels(rows: string[], keep: (c: string) => boolean): Pixel[] {
  const pixels: Pixel[] = [];
  rows.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (WIZARD_COLORS[c] && keep(c)) pixels.push({ x, y, fill: WIZARD_COLORS[c] });
    })
  );
  return pixels;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  private sanitizer = inject(DomSanitizer);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);

  readonly wizard = {
    width: WIZARD[0].length,
    height: WIZARD.length,
    body: spritePixels(WIZARD, (c) => c !== 'L'),
    orb: spritePixels(WIZARD, (c) => c === 'L'),
    eyes: [
      { x: 10, y: 15 },
      { x: 16, y: 15 },
    ],
  };

  readonly interests = [
    {
      label: 'Metalcore / Deathcore',
      tone: 'var(--color-accent)',
      icon: svg('<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3v-7a9 9 0 0 1 18 0v7h-3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>'),
    },
    {
      label: 'Videojuegos',
      tone: 'var(--color-accent-2)',
      icon: svg(
        '<path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3a2.4 2.4 0 0 1-4.2 1.1L15 15H9l-1.2 1.6a2.4 2.4 0 0 1-4.2-1.1l-.6-3A4 4 0 0 1 7 8z"/><line x1="7.5" y1="11" x2="7.5" y2="14"/><line x1="6" y1="12.5" x2="9" y2="12.5"/>'
      ),
    },
    {
      label: 'Senderismo',
      tone: 'var(--color-accent-3)',
      icon: svg('<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>'),
    },
    {
      label: 'Fotografía de naturaleza',
      tone: 'var(--color-accent-4)',
      icon: svg('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
    },
    {
      label: 'Anime y manga',
      tone: 'var(--color-paper)',
      icon: svg(
        '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>'
      ),
    },
  ].map((it) => ({ ...it, icon: this.trust(it.icon) }));

  readonly doing = [
    {
      text: 'Aplicaciones web y móviles fullstack con arquitectura en capas',
      icon: svg('<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>'),
    },
    {
      text: 'APIs REST seguras con autenticación JWT y Firebase Authentication',
      icon: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    },
    {
      text: 'WebSockets para funcionalidades en tiempo real',
      icon: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
    },
    {
      text: 'Interfaces centradas en el usuario (UX/UI)',
      icon: svg('<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/>'),
    },
    {
      text: 'Buenas prácticas: Clean Code, Testing y TDD',
      icon: svg('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'),
    },
    {
      text: 'Proyectos en equipo coordinando frontend y backend entre distintos roles',
      icon: svg('<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5 5"/>'),
    },
    {
      text: 'Proyectos end-to-end por mi cuenta: arquitectura, backend, frontend y despliegue',
      icon: svg(
        '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15 6 12c1-4 4-8 12-9-1 8-5 11-9 12z"/><circle cx="14.5" cy="9.5" r="1.5"/>'
      ),
    },
  ].map((d) => ({ ...d, icon: this.trust(d.icon) }));

  constructor() {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);
      const root: HTMLElement = this.el.nativeElement;

      // Subrayados tipo rotulador que se pintan al llegar
      root.querySelectorAll<HTMLElement>('.hl').forEach((hl) => {
        ScrollTrigger.create({
          trigger: hl,
          start: 'top 80%',
          once: true,
          onEnter: () => hl.classList.add('on'),
        });
      });

      this.setupBuddy(root);

      if (reducedMotion()) return;

      const stage = root.querySelector('.about-stage');
      gsap.fromTo(
        root.querySelector('.buddy'),
        { rotate: -14, y: 60 },
        { rotate: -5, y: -20, ease: 'none', scrollTrigger: { trigger: stage, scrub: true } }
      );
      gsap.fromTo(
        root.querySelector('.id-card'),
        { rotate: 12, y: 90 },
        { rotate: 4, y: -30, ease: 'none', scrollTrigger: { trigger: stage, scrub: true } }
      );
    });
  }

  // Gandalf: al hacer clic golpea con el bastón, frunce el ceño y suelta chispas;
  // en escritorio sigue el ratón con la mirada (la pupila salta de píxel en píxel)
  private setupBuddy(root: HTMLElement): void {
    const buddy = root.querySelector<HTMLElement>('.buddy');
    const svgEl = root.querySelector<SVGSVGElement>('.buddy-svg');
    const pupils = Array.from(root.querySelectorAll<SVGRectElement>('.buddy .pupil'));
    if (!buddy || !svgEl || !pupils.length) return;

    let castTimer: ReturnType<typeof setTimeout> | undefined;
    const onClick = () => {
      buddy.classList.remove('cast');
      void buddy.offsetWidth; // reinicia la animación del golpe
      buddy.classList.add('cast');
      clearTimeout(castTimer);
      castTimer = setTimeout(() => buddy.classList.remove('cast'), 1800);
      if (reducedMotion()) return;
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('span');
        spark.className = 'spark';
        spark.textContent = i % 2 ? '✧' : '✦';
        spark.setAttribute('aria-hidden', 'true');
        spark.style.left = `${86 + (Math.random() - 0.5) * 10}%`;
        spark.style.top = '18%';
        spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 110}px`);
        spark.style.animationDelay = `${i * 60}ms`;
        spark.addEventListener('animationend', () => spark.remove());
        buddy.appendChild(spark);
      }
    };
    buddy.addEventListener('click', onClick);

    // Por defecto mira hacia el texto (a la derecha y abajo)
    const look = (dx: number, dy: number) => pupils.forEach((p) => p.setAttribute('transform', `translate(${dx} ${dy})`));
    look(1, 1);

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = svgEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width * 0.48);
        const dy = e.clientY - (r.top + r.height * 0.42);
        look(dx > 0 ? 1 : 0, dy > 0 ? 1 : 0);
      });
    };
    if (finePointer() && !reducedMotion()) window.addEventListener('pointermove', onMove, { passive: true });

    this.destroyRef.onDestroy(() => {
      buddy.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
      clearTimeout(castTimer);
    });
  }

  private trust(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

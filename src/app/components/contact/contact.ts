import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { reducedMotion } from '../../shared/motion';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  readonly copied = signal(false);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private resetId?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetId));

    afterNextRender(() => {
      if (reducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      const root: HTMLElement = this.el.nativeElement;
      const card = root.querySelector<HTMLElement>('.contact-card')!;
      const trail = root.querySelector<SVGPathElement>('.trail')!;
      const plane = root.querySelector<SVGElement>('.plane')!;

      const scroll = { trigger: card, start: 'top 85%', end: 'center 45%', scrub: 0.6 };
      const length = trail.getTotalLength();
      gsap.fromTo(trail, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: scroll });

      // El avión sigue el trazo
      gsap.to(plane, {
        ease: 'none',
        scrollTrigger: scroll,
        motionPath: {
          path: trail,
          align: trail,
          alignOrigin: [0.5, 0.5],
          autoRotate: 30,
        },
      });

      gsap.from(root.querySelectorAll('.contact-heading, .intro, .email-row, .socials'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 75%', once: true },
      });
    });
  }

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText('andreaonweb.dev@gmail.com');
      this.copied.set(true);
      clearTimeout(this.resetId);
      this.resetId = setTimeout(() => this.copied.set(false), 2000);
    } catch {
      window.location.href = 'mailto:andreaonweb.dev@gmail.com';
    }
  }
}

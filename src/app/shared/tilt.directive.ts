import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { finePointer, reducedMotion } from './motion';

/** Inclina el elemento en 3D siguiendo al ratón. */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective {
  @Input() appTilt: number | string = 8;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (!finePointer() || reducedMotion()) return;

      const host = this.el.nativeElement;
      const max = Number(this.appTilt) || 8;
      gsap.set(host, { transformPerspective: 900 });
      const rotX = gsap.quickTo(host, 'rotationX', { duration: 0.5, ease: 'power3' });
      const rotY = gsap.quickTo(host, 'rotationY', { duration: 0.5, ease: 'power3' });

      host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        rotY(x * max * 2);
        rotX(-y * max * 2);
        host.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
        host.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      });

      host.addEventListener('pointerleave', () => {
        rotX(0);
        rotY(0);
      });
    });
  }
}

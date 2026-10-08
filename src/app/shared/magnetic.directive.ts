import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { finePointer, reducedMotion } from './motion';

/** El elemento se desplaza levemente hacia el cursor. */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective {
  @Input() appMagnetic: number | string = 0.3;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (!finePointer() || reducedMotion()) return;

      const host = this.el.nativeElement;
      const strength = Number(this.appMagnetic) || 0.3;
      const moveX = gsap.quickTo(host, 'x', { duration: 0.4, ease: 'power3' });
      const moveY = gsap.quickTo(host, 'y', { duration: 0.4, ease: 'power3' });

      host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        moveX((e.clientX - r.left - r.width / 2) * strength);
        moveY((e.clientY - r.top - r.height / 2) * strength);
      });

      host.addEventListener('pointerleave', () => {
        moveX(0);
        moveY(0);
      });
    });
  }
}

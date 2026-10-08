import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reducedMotion } from './motion';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  @Input() appScrollRevealStagger = '';

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (reducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);

      const host = this.el.nativeElement;
      const targets: HTMLElement | HTMLElement[] = this.appScrollRevealStagger
        ? Array.from(host.querySelectorAll<HTMLElement>(this.appScrollRevealStagger))
        : host;

      gsap.set(targets, { opacity: 0, y: 32, scale: 0.97 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: this.appScrollRevealStagger ? 0.08 : 0,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: host,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }
}

import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  @Input() appScrollRevealStagger = '';

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      const host = this.el.nativeElement;
      const targets: HTMLElement | HTMLElement[] = this.appScrollRevealStagger
        ? Array.from(host.querySelectorAll<HTMLElement>(this.appScrollRevealStagger))
        : host;

      gsap.set(targets, { opacity: 0, y: 24 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: this.appScrollRevealStagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: host,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }
}

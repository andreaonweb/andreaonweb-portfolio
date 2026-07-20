import { Component, ElementRef, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      const track = this.el.nativeElement.querySelector('.tl-track');
      const line = this.el.nativeElement.querySelector<HTMLElement>('.tl-line');
      if (!track || !line) return;

      gsap.set(line, { scaleY: 0 });

      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.5,
        },
      });
    });
  }
}

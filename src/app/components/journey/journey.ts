import { Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { reducedMotion } from '../../shared/motion';

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class JourneyComponent {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly steps = [
    {
      date: '2026 — hoy',
      title: 'FP Dual en Desarrollo Fullstack',
      place: 'Fundación Esplai',
      text: 'Complementando mi formación con experiencia práctica en entorno profesional. Angular, Python, arquitectura limpia y ganas de seguir explorando la IA aplicada a proyectos reales.',
      emoji: '✦',
      highlight: true,
    },
    {
      date: '2025',
      title: 'Bootcamp Desarrollo Fullstack',
      place: 'Factoría F5',
      text: 'Bootcamp de 7 meses fullstack. JavaScript ES6+, React, Java, Spring Boot, PostgreSQL, Git, Figma. +10 proyectos colaborativos, semifinalistas en Hackathon Sanitas 2025.',
      emoji: '★',
      highlight: true,
    },
    {
      date: '2019 — 2021',
      title: 'CFGS Comunicación Audiovisual',
      place: 'Formación profesional de grado superior',
      text: 'Producción, narrativa visual, fotografía. Aprendí a contar historias — ahora lo hago en código.',
      emoji: '◐',
      highlight: false,
    },
    {
      date: '2017 — 2019',
      title: 'CFGM Laboratorio de imagen',
      place: 'Formación profesional de grado medio',
      text: 'Formación especializada en imagen, iluminación y captación visual.',
      emoji: '◎',
      highlight: false,
    },
  ];

  constructor() {
    afterNextRender(() => {
      if (reducedMotion()) return;
      gsap.registerPlugin(ScrollTrigger);
      const root: HTMLElement = this.el.nativeElement;

      gsap.fromTo(
        root.querySelector('.line-fill'),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.querySelector('.track'), start: 'top 65%', end: 'bottom 65%', scrub: 0.4 },
        }
      );

      root.querySelectorAll<HTMLElement>('.step').forEach((step) => {
        const fromRight = step.classList.contains('right');
        const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: 'top 78%', once: true } });
        tl.from(step.querySelector('.node'), { scale: 0, rotate: -180, duration: 0.6, ease: 'back.out(2)' }).from(
          step.querySelector('.step-card'),
          { opacity: 0, x: fromRight ? 60 : -60, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
          0.1
        );
      });
    });
  }
}

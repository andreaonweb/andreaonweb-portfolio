import { Component, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { SkillsComponent } from './components/skills/skills';
import { ProjectsComponent } from './components/projects/projects';
import { JourneyComponent } from './components/journey/journey';
import { ContactComponent } from './components/contact/contact';
import { finePointer, reducedMotion } from './shared/motion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    JourneyComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();
  readonly ribbonWords = ['Fullstack', 'UX/UI', 'IA aplicada', 'Angular', 'React', 'Spring Boot', 'Python'];
  readonly ribbonWords2 = ['Disponible', 'Clean code', 'Accesible', 'Hecho con cariño', 'Remoto · CET'];

  constructor() {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });

      // Fuentes e imágenes cambian la altura de la página
      window.addEventListener('load', () => ScrollTrigger.refresh());
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      this.initCursor();
    });
  }

  private initCursor(): void {
    if (!finePointer() || reducedMotion()) return;
    document.body.classList.add('has-cursor');

    const dot = document.querySelector<HTMLElement>('.cursor-dot')!;
    const ring = document.querySelector<HTMLElement>('.cursor-ring')!;
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1 });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1 });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });

    window.addEventListener('pointermove', (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    });

    document.addEventListener('pointerover', (e) => {
      const interactive = (e.target as HTMLElement).closest('a, button, [role="tab"]');
      document.body.classList.toggle('cursor-hover', !!interactive);
    });

    document.documentElement.addEventListener('pointerleave', () => document.body.classList.add('cursor-out'));
    document.documentElement.addEventListener('pointerenter', () => document.body.classList.remove('cursor-out'));
  }
}

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
    });
  }
}

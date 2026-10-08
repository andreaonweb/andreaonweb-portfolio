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
import { PixelWalkerComponent } from './components/pixel-walker/pixel-walker';

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
    PixelWalkerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly year = new Date().getFullYear();
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

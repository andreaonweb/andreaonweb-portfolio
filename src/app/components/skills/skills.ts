import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

interface Skill {
  name: string;
  svg: SafeHtml;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor, ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {

  skills: Skill[];

  private raw: { name: string; svg: string }[] = [
    {
      name: 'JavaScript',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9v6M15 9v4a2 2 0 0 1-4 0"/>
      </svg>`
    },
    {
      name: 'TypeScript',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6M12 9v6M16 13a2 2 0 0 0-4 0v2a2 2 0 0 0 4 0"/>
      </svg>`
    },
    {
      name: 'React',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="1.5"/>
        <ellipse cx="12" cy="12" rx="10" ry="4"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
      </svg>`
    },
    {
      name: 'Angular',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 2 7 4.5 17 12 22 19.5 17 22 7"/>
        <polyline points="8.5 15 12 8 15.5 15"/>
        <line x1="9.5" y1="13" x2="14.5" y2="13"/>
      </svg>`
    },
    {
      name: 'Java',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 17s-1 .5-1 1.5S8.5 20 12 20s5-1 5-1.5-1-1.5-1-1.5"/>
        <path d="M9.5 15.5s-.5.5-.5 1 .5 1 3 1 3-.5 3-1-.5-1-.5-1"/>
        <path d="M10 4c0 4 5 4 5 8s-5 4-5 4"/>
        <path d="M14 4c0 4-5 4-5 8"/>
      </svg>`
    },
    {
      name: 'Spring Boot',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4"/>
        <path d="M17 5c0 0-3 1.5-3 4.5"/>
      </svg>`
    },
    {
      name: 'Python',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C9 2 7 3.5 7 6v3h5v1H6C4 10 2 11.5 2 14s1.5 4 4 4h1v-3c0-1.5 1-2.5 2.5-2.5h5c1.5 0 2.5-1 2.5-2.5V6c0-2.5-2-4-5-4z"/>
        <path d="M12 22c3 0 5-1.5 5-4v-3h-5v-1h6c2 0 4-1.5 4-4s-1.5-4-4-4h-1v3c0 1.5-1 2.5-2.5 2.5h-5C8 11.5 7 12.5 7 14v4c0 2.5 2 4 5 4z"/>
        <circle cx="9.5" cy="5.5" r=".75"/>
        <circle cx="14.5" cy="18.5" r=".75"/>
      </svg>`
    },
    {
      name: 'PostgreSQL',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3"/>
        <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
        <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
        <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"/>
      </svg>`
    },
    {
      name: 'Git',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="6" cy="6" r="2"/>
        <path d="M6 8v8M8 6h7a3 3 0 0 1 3 3v1"/>
      </svg>`
    },
    {
      name: 'Figma',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/>
        <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/>
        <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>
        <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/>
      </svg>`
    },
    {
      name: 'REST APIs',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/>
      </svg>`
    },
    {
      name: 'JWT',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        <circle cx="12" cy="16" r="1"/>
      </svg>`
    },
    {
      name: 'Scrum',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="5" height="6" rx="1"/>
        <rect x="10" y="3" width="5" height="10" rx="1"/>
        <rect x="17" y="3" width="5" height="7" rx="1"/>
        <path d="M3 21h18"/>
      </svg>`
    },
    {
      name: 'TDD',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>`
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.skills = this.raw.map(s => ({
      name: s.name,
      svg: this.sanitizer.bypassSecurityTrustHtml(s.svg)
    }));
  }

  onHover(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    const icon = target.querySelector('.skill-icon');
    if (icon) gsap.to(icon, { y: -4, duration: 0.35, ease: 'back.out(2)' });
  }

  onLeave(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return;
    const icon = target.querySelector('.skill-icon');
    if (icon) gsap.to(icon, { y: 0, duration: 0.3, ease: 'power2.out' });
  }
}

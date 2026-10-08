import { ChangeDetectorRef, Component, ElementRef, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { reducedMotion } from '../../shared/motion';

interface SkillGroup {
  title: string;
  kanji: string;
  tone: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  readonly groups: SkillGroup[] = [
    {
      title: 'Frontend',
      kanji: '木',
      tone: 'var(--color-accent-3)',
      skills: ['JavaScript', 'TypeScript', 'React', 'Angular'],
    },
    {
      title: 'Backend',
      kanji: '水',
      tone: 'var(--color-accent)',
      skills: ['Java', 'Spring Boot', 'Python', 'PostgreSQL', 'REST APIs', 'JWT'],
    },
    {
      title: 'Herramientas',
      kanji: '火',
      tone: 'var(--color-accent-4)',
      skills: ['Git', 'Figma', 'Scrum', 'TDD'],
    },
  ];

  readonly rotations = ['-4deg', '3deg', '-2deg', '5deg', '-5deg', '2deg'];
  readonly active = signal(0);

  select(i: number): void {
    if (i === this.active()) return;
    this.active.set(i);
    this.cdr.detectChanges();

    if (reducedMotion()) return;
    const root: HTMLElement = this.el.nativeElement;
    gsap.fromTo(
      root.querySelectorAll('.pill'),
      { scale: 0, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(2.2)' }
    );
    gsap.fromTo(
      root.querySelector('.panel-kanji'),
      { scale: 0.6, opacity: 0, rotate: -20 },
      { scale: 1, opacity: 0.12, rotate: 0, duration: 0.8, ease: 'power3.out' }
    );
  }

  onKey(e: KeyboardEvent): void {
    const n = this.groups.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (this.active() + 1) % n;
    if (e.key === 'ArrowLeft') next = (this.active() - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next === null) return;

    e.preventDefault();
    this.select(next);
    this.el.nativeElement.querySelector<HTMLElement>(`#tab-${next}`)?.focus();
  }
}

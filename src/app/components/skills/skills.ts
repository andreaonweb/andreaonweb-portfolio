import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

interface SkillGroup {
  title: string;
  kanji: string;
  skills: string[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor, ScrollRevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  groups: SkillGroup[] = [
    {
      title: 'Frontend',
      kanji: '木',
      skills: ['JavaScript', 'TypeScript', 'React', 'Angular'],
    },
    {
      title: 'Backend',
      kanji: '水',
      skills: ['Java', 'Spring Boot', 'Python', 'PostgreSQL', 'REST APIs', 'JWT'],
    },
    {
      title: 'Herramientas',
      kanji: '火',
      skills: ['Git', 'Figma', 'Scrum', 'TDD'],
    },
  ];
}

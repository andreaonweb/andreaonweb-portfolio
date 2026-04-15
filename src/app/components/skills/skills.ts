import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgFor],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent {
  skills = [
    'JavaScript (ES6+)', 'TypeScript', 'React', 'Angular',
    'Java', 'Spring Boot', 'Python', 'PostgreSQL',
    'Git', 'Figma', 'REST APIs', 'JWT', 'Scrum', 'TDD'
  ];
}
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  projects = [
    {
      name: 'Reverso Social',
      description: 'Aplicación fullstack de temática sociopolítica con autenticación y gestión de usuarios.',
      tech: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'JWT'],
      icon: 'social',
      vercel: 'https://reverso-social-web.vercel.app',
      repos: [
        { label: 'Frontend', url: 'https://github.com/andreaonweb/reverso-social-fe' },
        { label: 'Backend', url: 'https://github.com/andreaonweb/reverso-social-be' }
      ]
    },
    {
      name: 'RecuerdaMed',
      description: 'App para la gestión de medicación. Semifinalistas en Hackathon Sanitas 2025.',
      tech: ['React.js', 'Tailwind CSS', 'Vite', 'Axios', 'Vitest'],
      icon: 'med',
      vercel: 'https://recuerdamed-web.vercel.app',
      repos: [
        { label: 'Frontend', url: 'https://github.com/andreaonweb/RecuerdaMed-FrontEnd' }
      ]
    },
    {
      name: 'The Shire of Paws',
      description: 'Explora perros en adopción y gestiona solicitudes.',
      tech: ['React', 'CSS Modules', 'Spring Boot', 'PostgreSQL', 'Axios'],
      icon: 'paws',
      vercel: 'https://the-shire-of-paws-fe.vercel.app',
      repos: [
        { label: 'Frontend', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Frontend' },
        { label: 'Backend', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Backend' }
      ]
    }
  ];
}
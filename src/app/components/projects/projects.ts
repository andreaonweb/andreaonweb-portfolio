import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, NgIf, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  projects = [
    {
      name: 'Nemblex IT',
      description: 'Sistema de gestión de incidencias IT (helpdesk) con un agente de IA integrado: clasificación automática de tickets, propuestas de resolución vía RAG (Gemini + pgvector) y aprobación humana antes de aplicar cualquier acción sensible.',
      tech: ['Angular', 'Java', 'Spring Boot', 'PostgreSQL', 'pgvector', 'Gemini'],
      icon: 'code',
      badge: null,
      image: 'projects/nemblex.jpg',
      vercel: null,
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/nemblex-it' }
      ]
    },
    {
      name: 'The Shire of Paws',
      description: 'Plataforma de adopción de perros con galería pública filtrable, ficha detallada de cada animal y formulario de solicitud sin necesidad de registro. Incluye panel de administración con autenticación JWT para gestionar los perfiles y aprobar o rechazar las solicitudes de acogida.',
      tech: ['React', 'CSS Modules', 'Spring Boot', 'PostgreSQL', 'Axios'],
      icon: 'paws',
      badge: null,
      image: 'projects/theshireofpaws.png',
      vercel: 'https://theshireofpaws-frontend.onrender.com',
      repos: [
        { label: 'Frontend', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Frontend' },
        { label: 'Backend', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Backend' }
      ]
    },
    {
      name: 'SavePoint',
      description: 'Plataforma social para gamers: biblioteca con horas jugadas, progreso, reseñas y estadísticas, perfiles, solicitudes de amistad y chat global y privado.',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Firebase'],
      icon: 'controller',
      badge: null,
      image: 'projects/savepoint.png',
      vercel: 'https://savepoint-frontend.onrender.com',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/SavePoint-App/SavePoint-App' }
      ]
    },
    {
      name: 'Reverso Social',
      description: 'Aplicación fullstack de temática sociopolítica con autenticación y gestión de usuarios.',
      tech: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'JWT'],
      icon: 'social',
      badge: null,
      image: 'projects/reverso.png',
      vercel: 'https://reverso-social-web.vercel.app',
      repos: [
        { label: 'Frontend', url: 'https://github.com/andreaonweb/reverso-social-fe' },
        { label: 'Backend', url: 'https://github.com/andreaonweb/reverso-social-be' }
      ]
    },
    {
      name: 'BitBuddy',
      description: 'Chat en tiempo real con WebSockets, autenticación Firebase y modo de conversación con IA.',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'Python', 'Firebase'],
      icon: 'chat',
      badge: null,
      image: 'projects/chat.png',
      vercel: 'https://chat-frontend-7dwn.onrender.com',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/chat-ws' }
      ]
    },
    {
      name: 'Shirayuki Pâtisserie',
      description: 'E-commerce de repostería japonesa artesanal con carrito reactivo, panel de administración y buses cercanos en tiempo real.',
      tech: ['Angular', 'TypeScript', 'Firebase', 'Firestore', 'SCSS'],
      icon: 'cake',
      badge: null,
      image: 'projects/shirayuki.png',
      vercel: 'https://shirayuki-patisserie.vercel.app',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/Shirayuki_Patisserie' }
      ]
    }
  ];
}
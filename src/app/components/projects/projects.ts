import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

interface Project {
  name: string;
  description: string;
  tech: string[];
  type: string;
  icon: string;
  badge: string | null;
  image: string;
  vercel: string | null;
  repos: { label: string; url: string }[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, NgIf, ScrollRevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [
    {
      name: 'Nemblex IT',
      description: 'Sistema de gestión de incidencias IT (helpdesk) con un agente de IA integrado: clasificación automática de tickets, propuestas de resolución vía RAG (Gemini + pgvector) y aprobación humana antes de aplicar cualquier acción sensible.',
      tech: ['Angular', 'Java', 'Spring Boot', 'PostgreSQL', 'pgvector', 'Gemini'],
      type: 'Personal',
      icon: 'code',
      badge: null,
      image: 'projects/nemblex.jpg',
      vercel: null,
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/nemblex-it' }
      ]
    },
    {
      name: 'RecuerdaMed',
      description: 'Aplicación para la gestión de recordatorios de medicación: pautas de tratamiento, avisos de toma y seguimiento de adherencia. Semifinalistas en el hackathon.',
      tech: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL'],
      type: 'Colaborativo',
      icon: 'medical',
      badge: 'Semifinalistas',
      image: 'projects/recuerdamed.jpg',
      vercel: null,
      repos: [
        { label: 'Frontend', url: 'https://github.com/andreaonweb/RecuerdaMed-FrontEnd' },
        { label: 'Backend', url: 'https://github.com/RecuerdaMed/recuerdamed-back' }
      ]
    },
    {
      name: 'The Shire of Paws',
      description: 'Plataforma de adopción de perros con galería pública filtrable, ficha detallada de cada animal y formulario de solicitud sin necesidad de registro. Incluye panel de administración con autenticación JWT para gestionar los perfiles y aprobar o rechazar las solicitudes de acogida.',
      tech: ['React', 'CSS Modules', 'Spring Boot', 'PostgreSQL', 'Axios'],
      type: 'Personal',
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
      type: 'Personal',
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
      description: 'Sitio institucional para una consultora sociopolítica, con blog, catálogo de servicios y recursos descargables mediante captura de leads. Panel de administración con autenticación para gestionar contenido, servicios, leads y mensajes de contacto.',
      tech: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'JWT'],
      type: 'Colaborativo',
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
      name: 'CodeCrafters',
      description: 'Plataforma para la gestión de eventos tecnológicos online y presenciales, con landing, listado, creación y detalle de eventos consumiendo una API REST propia. CRUD de eventos, usuarios, asistencias y categorías, con paginación y validaciones.',
      tech: ['React', 'SCSS', 'Java', 'Spring Boot', 'JWT'],
      type: 'Colaborativo',
      icon: 'calendar',
      badge: null,
      image: 'projects/codecrafters.png',
      vercel: null,
      repos: [
        { label: 'Frontend', url: 'https://github.com/andreaonweb/CodeCrafters-Frontend' },
        { label: 'Backend', url: 'https://github.com/andreaonweb/CodeCrafters-Backend' }
      ]
    },
    {
      name: 'KO Patisserie',
      description: 'Web de una pastelería japonesa-francesa con carta, pedidos con recogida en tienda, chat de ayuda en tiempo real y panel de administración para gestionar pedidos y contenido.',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'PostgreSQL', 'WebSocket'],
      type: 'Personal',
      icon: 'cake',
      badge: null,
      image: 'projects/ko-patisserie.jpg',
      vercel: 'https://ko-patisserie-front.onrender.com',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/KO_Patisserie' }
      ]
    },
    {
      name: 'BitBuddy',
      description: 'Chat en tiempo real con WebSockets, autenticación Firebase y modo de conversación con IA.',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'Python', 'Firebase'],
      type: 'Personal',
      icon: 'chat',
      badge: null,
      image: 'projects/chat.png',
      vercel: 'https://chat-frontend-7dwn.onrender.com',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/chat-ws' }
      ]
    },
    {
      name: 'Garden of Thoughts',
      description: 'Aplicación para crear, editar y eliminar frases motivadoras, cada una con su autor y una imagen asociada, con un diseño de interfaz modular basado en Atomic Design.',
      tech: ['React', 'JavaScript', 'SCSS', 'Vite', 'Vitest'],
      type: 'Colaborativo',
      icon: 'quote',
      badge: null,
      image: 'projects/garden-of-thoughts.jpg',
      vercel: 'https://garden-of-thoughts-app.vercel.app',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/andreaonweb/Garden-Of-Thoughts' }
      ]
    }
  ];

  private readonly pageSize = 3;
  private readonly autoplayDelay = 5000;
  private autoplayId?: ReturnType<typeof setInterval>;

  currentPage = signal(0);
  slides: (Project | null)[][] = [];

  ngOnInit(): void {
    const items: (Project | null)[] = [...this.projects, null];
    for (let i = 0; i < items.length; i += this.pageSize) {
      this.slides.push(items.slice(i, i + this.pageSize));
    }
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayId = setInterval(() => this.next(), this.autoplayDelay);
  }

  stopAutoplay(): void {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = undefined;
    }
  }

  next(): void {
    const total = this.slides.length;
    this.currentPage.update(p => (p + 1) % total);
  }

  prev(): void {
    const total = this.slides.length;
    this.currentPage.update(p => (p - 1 + total) % total);
  }

  onNext(): void {
    this.next();
    this.startAutoplay();
  }

  onPrev(): void {
    this.prev();
    this.startAutoplay();
  }

  trackByPageIndex(index: number): number {
    return index;
  }

  trackByProjectName(index: number, project: Project | null): string {
    return project ? project.name : 'cta';
  }

  goTo(index: number): void {
    this.currentPage.set(index);
    this.startAutoplay();
  }
}
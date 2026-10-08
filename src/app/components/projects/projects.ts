import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';
import { TiltDirective } from '../../shared/tilt.directive';
import { reducedMotion } from '../../shared/motion';

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

type Filter = 'all' | 'Personal' | 'Colaborativo' | 'demo';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ScrollRevealDirective, TiltDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
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
      description: 'Aplicación para la gestión de recordatorios de medicación: pautas de tratamiento, avisos de toma y seguimiento de adherencia. Semifinalistas en el Hackathon Sanitas 2025.',
      tech: ['Angular', 'TypeScript', 'Java', 'Spring Boot', 'PostgreSQL'],
      type: 'Colaborativo',
      icon: 'medical',
      badge: 'Semifinalistas',
      image: 'projects/recuerdamed.jpg',
      vercel: null,
      repos: [
        { label: 'Repo front', url: 'https://github.com/andreaonweb/RecuerdaMed-FrontEnd' },
        { label: 'Repo back', url: 'https://github.com/RecuerdaMed/recuerdamed-back' }
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
      vercel: null,
      repos: [
        { label: 'Repo front', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Frontend' },
        { label: 'Repo back', url: 'https://github.com/TheShireOfPaws/TheShireOfPaws-Backend' }
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
        { label: 'Repo front', url: 'https://github.com/andreaonweb/reverso-social-fe' },
        { label: 'Repo back', url: 'https://github.com/andreaonweb/reverso-social-be' }
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
        { label: 'Repo front', url: 'https://github.com/andreaonweb/CodeCrafters-Frontend' },
        { label: 'Repo back', url: 'https://github.com/andreaonweb/CodeCrafters-Backend' }
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

  readonly filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'Personal', label: 'Personales' },
    { id: 'Colaborativo', label: 'En equipo' },
    { id: 'demo', label: 'Con demo' },
  ];

  readonly filter = signal<Filter>('all');
  readonly selected = signal<Project | null>(null);

  @ViewChild('modal') private modal?: ElementRef<HTMLDialogElement>;

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  private opener: HTMLElement | null = null;

  matches(p: Project, f: Filter = this.filter()): boolean {
    if (f === 'all') return true;
    if (f === 'demo') return !!p.vercel;
    return p.type === f;
  }

  count(f: Filter): number {
    return this.projects.filter((p) => this.matches(p, f)).length;
  }

  setFilter(f: Filter): void {
    if (f === this.filter()) return;
    gsap.registerPlugin(Flip);

    const cards = this.host.nativeElement.querySelectorAll<HTMLElement>('.card');
    const state = Flip.getState(cards);

    this.filter.set(f);
    this.cdr.detectChanges();

    // La altura del grid cambia: recalcular las posiciones de los ScrollTrigger
    if (reducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }
    Flip.from(state, {
      onComplete: () => ScrollTrigger.refresh(),
      duration: 0.6,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.3 }),
    });
  }

  open(p: Project, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.selected.set(p);
    this.cdr.detectChanges();

    const dialog = this.modal?.nativeElement;
    if (!dialog) return;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    if (!reducedMotion()) {
      gsap.fromTo(
        dialog.querySelector('.modal-inner'),
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }

  close(): void {
    this.modal?.nativeElement.close();
  }

  onClosed(): void {
    document.body.style.overflow = '';
    this.selected.set(null);
    this.opener?.focus();
  }

  onBackdrop(event: MouseEvent): void {
    // Un clic directamente sobre el <dialog> es un clic en el fondo
    if (event.target === this.modal?.nativeElement) this.close();
  }
}

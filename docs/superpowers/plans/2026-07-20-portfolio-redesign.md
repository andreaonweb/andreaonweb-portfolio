# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing Angular portfolio with a cold purple/blue palette, GSAP-driven scroll/hero animations, project preview screenshots, and updated project data (add Chat WS + SavePoint, drop RecuerdaMed, update The Shire of Paws demo URL).

**Architecture:** No structural changes to the component tree (navbar/hero/about/skills/projects/contact stay as-is). All motion is added via a new `gsap` dependency, driven either by a new reusable `ScrollRevealDirective` (for generic scroll-triggered fade/stagger reveals) or by component-local GSAP timelines (hero entrance/blobs, timeline scrub line, navbar sliding indicator). Every piece of GSAP/DOM code is wrapped in Angular's `afterNextRender()` so it never executes during SSR.

**Tech Stack:** Angular 21 (standalone components, SSR via `@angular/ssr`), SCSS, GSAP 3 + ScrollTrigger.

## Global Constraints

- All GSAP/DOM-touching code must run inside `afterNextRender(() => { ... })` (called from a component/directive constructor) — this is Angular's built-in SSR-safe browser-only hook and satisfies the spec's "guard with isPlatformBrowser" requirement without extra boilerplate. `@HostListener('window:...')` callbacks (already used in `navbar.ts`) don't need this guard — Angular never invokes event callbacks during server rendering.
- `--gradient-primary` (`linear-gradient(135deg, var(--color-accent-2), var(--color-accent))`) is reserved for: hero name text, primary/demo buttons, the timeline line, and the navbar active-link indicator. Card/skill/stat hover borders and glows use the existing solid `--color-accent` / new `--color-accent-2` / `--color-accent-glow` tokens directly (gradients don't render cleanly as 1px borders without extra markup, so this plan uses solid accent colors there).
- Per the approved spec, this feature gets **no new unit tests** — animations are visual, not business logic. Each task's "testing" step is `npm run build` (production SSR build, which type-checks everything) plus, in the final task, a full manual browser walkthrough.
- `npm test` (`ng test`) is **already broken at baseline**, unrelated to this work: every `*.spec.ts` file imports a class name (e.g. `About`, `Hero`) that doesn't match the actual exported class (e.g. `AboutComponent`, `HeroComponent`). This plan does not touch or fix those spec files — don't be alarmed if `npm test` fails before and after this plan.
- Image assets copied into `public/projects/` are referenced in templates as `/projects/<file>.png` (Angular serves everything under `public/` from the site root, per `angular.json`'s `assets` config).

---

### Task 1: Install GSAP dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (via `npm install`)

**Interfaces:**
- Produces: the `gsap` package (with `gsap/ScrollTrigger` subpath) available to import in every later task.

- [ ] **Step 1: Install the package**

Run: `npm install gsap@^3.15.0`

- [ ] **Step 2: Verify it was added**

Run: `node -e "console.log(require('./package.json').dependencies.gsap)"`
Expected output: `^3.15.0` (or the version npm actually resolved, printed without error)

- [ ] **Step 3: Verify the project still builds**

Run: `npm run build`
Expected: build completes with `Application bundle generation complete.` and no errors (the existing `RouterOutlet is not used` warning is pre-existing and expected).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap dependency for portfolio animations"
```

---

### Task 2: Cold purple/blue color palette

**Files:**
- Modify: `src/styles.scss:3-15`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-border`, `--color-accent`, `--color-accent-2`, `--color-accent-dim`, `--color-accent-glow`, `--gradient-primary`, `--color-text`, `--color-muted` — every later task's SCSS references these exact names.

- [ ] **Step 1: Replace the `:root` variable block**

In `src/styles.scss`, replace lines 3-15 (the `:root { ... }` block) with:

```scss
:root {
  --color-bg: #08080f;
  --color-surface: #0f0f1a;
  --color-surface-2: #14141f;
  --color-border: #22222f;
  --color-accent: #a78bfa;
  --color-accent-2: #60a5fa;
  --color-accent-dim: rgba(167, 139, 250, 0.12);
  --color-accent-glow: rgba(167, 139, 250, 0.25);
  --gradient-primary: linear-gradient(135deg, var(--color-accent-2), var(--color-accent));
  --color-text: #f0f0f0;
  --color-muted: #888888;
  --font-mono: 'Share Tech Mono', monospace;
  --font-main: 'Inter', sans-serif;
}
```

- [ ] **Step 2: Verify the build still succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 3: Verify the new tokens are present in the compiled CSS**

Run: `grep -o -- "--color-accent-2: #60a5fa" dist/andreaonweb-portfolio/browser/styles-*.css`
Expected: prints the matched string (confirms the new variable made it into the production CSS bundle; exact hash in the filename will vary, use `dist/andreaonweb-portfolio/browser/styles-*.css` glob as-is).

- [ ] **Step 4: Commit**

```bash
git add src/styles.scss
git commit -m "style: switch palette to cold purple/blue accent pair"
```

---

### Task 3: Copy project screenshots into the repo

**Files:**
- Create: `public/projects/chat.png`
- Create: `public/projects/reverso.png`
- Create: `public/projects/savepoint.png`
- Create: `public/projects/theshireofpaws.png`

**Interfaces:**
- Consumes: source files at `C:\Users\Mati\Downloads\capturas_proyectos\*.png`.
- Produces: static assets served at `/projects/chat.png`, `/projects/reverso.png`, `/projects/savepoint.png`, `/projects/theshireofpaws.png` — Task 4 references these exact paths.

- [ ] **Step 1: Create the target directory and copy the files**

Run:
```bash
mkdir -p "public/projects"
cp "/c/Users/Mati/Downloads/capturas_proyectos/chat.png" "public/projects/chat.png"
cp "/c/Users/Mati/Downloads/capturas_proyectos/reverso.png" "public/projects/reverso.png"
cp "/c/Users/Mati/Downloads/capturas_proyectos/savepoint.png" "public/projects/savepoint.png"
cp "/c/Users/Mati/Downloads/capturas_proyectos/theshireofpaws.png" "public/projects/theshireofpaws.png"
```

- [ ] **Step 2: Verify the four files exist**

Run: `ls -la public/projects/`
Expected: 4 `.png` files listed (`chat.png`, `reverso.png`, `savepoint.png`, `theshireofpaws.png`).

- [ ] **Step 3: Verify the build serves them**

Run: `npm run build && ls dist/andreaonweb-portfolio/browser/projects/`
Expected: the same 4 files listed under the build output's `browser/projects/` directory.

- [ ] **Step 4: Commit**

```bash
git add public/projects/chat.png public/projects/reverso.png public/projects/savepoint.png public/projects/theshireofpaws.png
git commit -m "assets: add project preview screenshots"
```

---

### Task 4: Update project data and add new icons

**Files:**
- Modify: `src/app/components/projects/projects.ts:12-49` (the `projects` array)
- Modify: `src/app/components/projects/projects.html:6-27` (the icon `*ngIf` blocks)

**Interfaces:**
- Consumes: image paths produced by Task 3 (`projects/chat.png`, `projects/reverso.png`, `projects/savepoint.png`, `projects/theshireofpaws.png`).
- Produces: each project object now has an `image: string` field; `p.icon` can be `'social' | 'paws' | 'chat' | 'controller'` — Task 5 relies on the `image` field, `projects.html`'s existing icon `*ngIf` pattern is extended (not replaced) so it keeps working for `'social'`/`'paws'`.

- [ ] **Step 1: Replace the `projects` array in `projects.ts`**

Replace the whole `projects = [ ... ]` array (lines 12-49) with:

```ts
  projects = [
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
      name: 'The Shire of Paws',
      description: 'Explora perros en adopción y gestiona solicitudes de acogida.',
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
      name: 'Chat WS',
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
      name: 'SavePoint',
      description: 'Tracker fullstack de biblioteca de videojuegos: horas jugadas, progreso, reseñas y estadísticas.',
      tech: ['Angular', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Firebase'],
      icon: 'controller',
      badge: null,
      image: 'projects/savepoint.png',
      vercel: 'https://savepoint-frontend.onrender.com',
      repos: [
        { label: 'Repositorio', url: 'https://github.com/SavePoint-App/SavePoint-App' }
      ]
    }
  ];
```

- [ ] **Step 2: Add the two new icon blocks in `projects.html`**

Immediately after the existing `<svg *ngIf="p.icon === 'paws'" ...> ... </svg>` block (ends at line 27), insert:

```html
        <svg *ngIf="p.icon === 'chat'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16v12H8l-4 4V4z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="13" y2="13" />
        </svg>
        <svg *ngIf="p.icon === 'controller'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3a2.4 2.4 0 0 1-4.2 1.1L15 15H9l-1.2 1.6a2.4 2.4 0 0 1-4.2-1.1l-.6-3A4 4 0 0 1 7 8z" />
          <line x1="7.5" y1="11" x2="7.5" y2="14" />
          <line x1="6" y1="12.5" x2="9" y2="12.5" />
          <circle cx="16" cy="11" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13" r="0.8" fill="currentColor" stroke="none" />
        </svg>
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 4: Verify the new project names are in the prerendered HTML**

Run: `grep -o "Chat WS" dist/andreaonweb-portfolio/browser/index.html && grep -o "SavePoint" dist/andreaonweb-portfolio/browser/index.html`
Expected: both `Chat WS` and `SavePoint` printed (confirms the prerendered static page includes the new project cards — RecuerdaMed's absence can be confirmed by `grep -c "RecuerdaMed" dist/andreaonweb-portfolio/browser/index.html` printing `0`).

- [ ] **Step 5: Commit**

```bash
git add src/app/components/projects/projects.ts src/app/components/projects/projects.html
git commit -m "feat: add Chat WS and SavePoint projects, drop RecuerdaMed, update Shire demo URL"
```

---

### Task 5: Project preview card UI

**Files:**
- Modify: `src/app/components/projects/projects.html` (full rewrite)
- Modify: `src/app/components/projects/projects.scss` (full rewrite)

**Interfaces:**
- Consumes: `p.image` (Task 4), `--gradient-primary` / `--color-accent-2` / `--color-accent-glow` (Task 2).
- Produces: `.card-preview`, `.browser-bar`, `.overlay` DOM structure inside each `.card` — no later task depends on these class names directly (Task 9 adds `appScrollReveal` to the existing `.grid`/`.card` elements, unaffected by this internal restructuring).

- [ ] **Step 1: Rewrite `projects.html`**

Replace the entire file with:

```html
<section id="projects">
  <h2>Proyectos destacados</h2>
  <div class="grid">
    <div class="card" *ngFor="let p of projects">

      <div class="card-preview">
        <div class="browser-bar">
          <span></span><span></span><span></span>
        </div>
        <img [src]="p.image" [alt]="'Captura de ' + p.name" loading="lazy" />
        <div class="overlay">
          <a class="btn-demo" [href]="p.vercel" target="_blank" rel="noopener">Ver demo ↗</a>
          <div class="repo-links">
            <a *ngFor="let r of p.repos" [href]="r.url" target="_blank" rel="noopener">
              {{ r.label }} ↗
            </a>
          </div>
        </div>
      </div>

      <div class="card-header">
        <svg *ngIf="p.icon === 'social'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <svg *ngIf="p.icon === 'paws'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M18 5.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M7 10.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M21 10.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M12 13c-3 0-6 2-6 4.5C6 20 8.5 22 12 22s6-2 6-4.5C18 15 15 13 12 13z" />
        </svg>
        <svg *ngIf="p.icon === 'chat'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16v12H8l-4 4V4z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="13" y2="13" />
        </svg>
        <svg *ngIf="p.icon === 'controller'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3a2.4 2.4 0 0 1-4.2 1.1L15 15H9l-1.2 1.6a2.4 2.4 0 0 1-4.2-1.1l-.6-3A4 4 0 0 1 7 8z" />
          <line x1="7.5" y1="11" x2="7.5" y2="14" />
          <line x1="6" y1="12.5" x2="9" y2="12.5" />
          <circle cx="16" cy="11" r="0.8" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13" r="0.8" fill="currentColor" stroke="none" />
        </svg>
        <span class="name">{{ p.name }}</span>
        <span class="badge" *ngIf="p.badge">{{ p.badge }}</span>
      </div>

      <p class="desc">{{ p.description }}</p>

      <div class="tech-list">
        <span *ngFor="let t of p.tech">{{ t }}</span>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Rewrite `projects.scss`**

Replace the entire file with:

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  color: inherit;
  overflow: hidden;

  &:hover {
    border-color: var(--color-accent-2);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px var(--color-accent-glow);
  }

  .card-preview {
    position: relative;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--color-surface-2);

    .browser-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 26px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 10px;
      background: rgba(8, 8, 15, 0.75);
      z-index: 2;

      span {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        &:nth-child(1) { background: #ff5f56; }
        &:nth-child(2) { background: #ffbd2e; }
        &:nth-child(3) { background: #27c93f; }
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px;
      background: linear-gradient(to top, rgba(8, 8, 15, 0.95), transparent 60%);
      opacity: 0;
      transition: opacity 0.25s ease;

      .btn-demo {
        align-self: flex-start;
        font-size: 0.8rem;
        font-family: var(--font-mono);
        font-weight: 600;
        text-decoration: none;
        padding: 8px 16px;
        letter-spacing: 0.03em;
        background: var(--gradient-primary);
        color: #06060c;
        transition: opacity 0.2s, box-shadow 0.2s;

        &:hover {
          opacity: 0.85;
          box-shadow: 0 4px 16px var(--color-accent-glow);
          text-decoration: none;
        }
      }

      .repo-links {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        a {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: #ddd;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;

          &:hover {
            color: var(--color-accent-2);
            border-bottom-color: var(--color-accent-2);
          }
        }
      }
    }

    &:hover img,
    &:focus-within img {
      transform: scale(1.05);
    }

    &:hover .overlay,
    &:focus-within .overlay {
      opacity: 1;
    }

    @media (hover: none) {
      .overlay {
        opacity: 0.92;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 20px 28px 14px;
    flex-wrap: wrap;

    .name {
      font-weight: 600;
      font-size: 1rem;
      flex: 1;
    }

    .badge {
      font-family: var(--font-mono);
      font-size: 0.65rem;
      padding: 3px 8px;
      background: var(--color-accent-dim);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      letter-spacing: 0.05em;
      white-space: nowrap;
    }
  }

  .desc {
    font-size: 0.92rem;
    color: var(--color-muted);
    margin: 0 28px 20px;
    line-height: 1.6;
    flex: 1;
  }

  .tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 28px 28px;

    span {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--color-accent);
      background: var(--color-accent-dim);
      padding: 3px 8px;
    }
  }
}

.card-header svg {
  width: 22px;
  height: 22px;
  color: var(--color-accent);
  flex-shrink: 0;
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 4: Verify the preview markup is present**

Run: `grep -o "card-preview" dist/andreaonweb-portfolio/browser/index.html | head -1`
Expected: prints `card-preview`.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/projects/projects.html src/app/components/projects/projects.scss
git commit -m "feat: add browser-style preview screenshots to project cards"
```

---

### Task 6: Shared scroll-reveal directive

**Files:**
- Create: `src/app/shared/scroll-reveal.directive.ts`

**Interfaces:**
- Consumes: `gsap` and `gsap/ScrollTrigger` (Task 1).
- Produces: standalone directive `ScrollRevealDirective`, selector `[appScrollReveal]`, optional `@Input() appScrollRevealStagger: string` (a CSS selector for child elements to stagger; if empty, the host element itself is animated as one unit). Tasks 7, 8, 9 import this class by name `ScrollRevealDirective` from `../../shared/scroll-reveal.directive` and use it as `appScrollReveal` / `appScrollRevealStagger="..."` in templates.

- [ ] **Step 1: Create the directive file**

```ts
import { Directive, ElementRef, Input, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective {
  @Input() appScrollRevealStagger = '';

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      const host = this.el.nativeElement;
      const targets: HTMLElement | HTMLElement[] = this.appScrollRevealStagger
        ? Array.from(host.querySelectorAll<HTMLElement>(this.appScrollRevealStagger))
        : host;

      gsap.set(targets, { opacity: 0, y: 24 });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: this.appScrollRevealStagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: host,
          start: 'top 85%',
          once: true,
        },
      });
    });
  }
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors (confirms the `gsap`/`gsap/ScrollTrigger` imports resolve and the directive type-checks; it isn't used anywhere yet, so no visual change).

- [ ] **Step 3: Commit**

```bash
git add src/app/shared/scroll-reveal.directive.ts
git commit -m "feat: add reusable GSAP scroll-reveal directive"
```

---

### Task 7: About section animations

**Files:**
- Modify: `src/app/components/about/about.ts` (full rewrite)
- Modify: `src/app/components/about/about.html:4,24,42` (add directive attributes, add `.tl-line` element)
- Modify: `src/app/components/about/about.scss:81-95` (replace `.tl-track::before` with `.tl-line`)

**Interfaces:**
- Consumes: `ScrollRevealDirective` (Task 6), `--gradient-primary` (Task 2).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Rewrite `about.ts`**

```ts
import { Component, ElementRef, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      gsap.registerPlugin(ScrollTrigger);

      const track = this.el.nativeElement.querySelector('.tl-track');
      const line = this.el.nativeElement.querySelector<HTMLElement>('.tl-line');
      if (!track || !line) return;

      gsap.set(line, { scaleY: 0 });

      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.5,
        },
      });
    });
  }
}
```

- [ ] **Step 2: Add directive attributes and the `.tl-line` element in `about.html`**

Change line 4 from:
```html
  <div class="about-intro">
```
to:
```html
  <div class="about-intro" appScrollReveal appScrollRevealStagger="p">
```

Change line 24 from:
```html
  <div class="stats-row">
```
to:
```html
  <div class="stats-row" appScrollReveal appScrollRevealStagger=".stat">
```

Change line 42 from:
```html
    <div class="tl-track">
```
to:
```html
    <div class="tl-track">
      <div class="tl-line"></div>
```

- [ ] **Step 3: Replace the timeline line in `about.scss`**

Replace lines 81-95:
```scss
.tl-track {
  position: relative;
  padding-left: 32px;

  // La línea vertical continua
  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: var(--color-border);
  }
}
```
with:
```scss
.tl-track {
  position: relative;
  padding-left: 32px;
}

.tl-line {
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--gradient-primary);
  transform-origin: top;
}
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/about/about.ts src/app/components/about/about.html src/app/components/about/about.scss
git commit -m "feat: animate About section (scroll reveal + drawing timeline line)"
```

---

### Task 8: Skills section animations

**Files:**
- Modify: `src/app/components/skills/skills.ts` (full rewrite)
- Modify: `src/app/components/skills/skills.html` (full rewrite)
- Modify: `src/app/components/skills/skills.scss:23-34` (hover block)

**Interfaces:**
- Consumes: `ScrollRevealDirective` (Task 6).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Rewrite `skills.ts`**

```ts
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
```

- [ ] **Step 2: Rewrite `skills.html`**

```html
<section id="skills">
  <h2>Stack</h2>
  <div class="skills-grid" appScrollReveal appScrollRevealStagger=".skill-item">
    <div
      class="skill-item"
      *ngFor="let skill of skills"
      (mouseenter)="onHover($event.currentTarget)"
      (mouseleave)="onLeave($event.currentTarget)"
    >
      <div class="skill-icon" [innerHTML]="skill.svg"></div>
      <span class="skill-name">{{ skill.name }}</span>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Remove the CSS `transform` from the hover state in `skills.scss`**

Replace lines 23-34:
```scss
  &:hover {
    border-color: var(--color-accent);
    background: var(--color-accent-dim);
    transform: translateY(-4px);

    .skill-icon svg {
      color: var(--color-accent);
      filter: drop-shadow(0 0 8px var(--color-accent-glow));
    }

    .skill-name { color: var(--color-accent); }
  }
```
with:
```scss
  &:hover {
    border-color: var(--color-accent);
    background: var(--color-accent-dim);

    .skill-icon svg {
      color: var(--color-accent);
      filter: drop-shadow(0 0 8px var(--color-accent-glow));
    }

    .skill-name { color: var(--color-accent); }
  }
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/skills/skills.ts src/app/components/skills/skills.html src/app/components/skills/skills.scss
git commit -m "feat: animate Skills section (scroll reveal + hover bounce)"
```

---

### Task 9: Apply scroll-reveal to Projects and Contact

**Files:**
- Modify: `src/app/components/projects/projects.ts:1-11` (imports)
- Modify: `src/app/components/projects/projects.html:3` (add directive attribute)
- Modify: `src/app/components/contact/contact.ts` (full rewrite)
- Modify: `src/app/components/contact/contact.html:4` (add directive attribute)

**Interfaces:**
- Consumes: `ScrollRevealDirective` (Task 6).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update `projects.ts` imports**

Replace lines 1-11 of `src/app/components/projects/projects.ts`:
```ts
import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
```
with:
```ts
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
```

- [ ] **Step 2: Add the directive attribute in `projects.html`**

Change line 3 from:
```html
  <div class="grid">
```
to:
```html
  <div class="grid" appScrollReveal appScrollRevealStagger=".card">
```

- [ ] **Step 3: Rewrite `contact.ts`**

```ts
import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/scroll-reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent { }
```

- [ ] **Step 4: Add the directive attribute in `contact.html`**

Change line 4 from:
```html
  <div class="links">
```
to:
```html
  <div class="links" appScrollReveal appScrollRevealStagger="a">
```

- [ ] **Step 5: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/projects/projects.ts src/app/components/projects/projects.html src/app/components/contact/contact.ts src/app/components/contact/contact.html
git commit -m "feat: apply scroll-reveal animation to Projects cards and Contact links"
```

---

### Task 10: Hero motion (blobs, entrance stagger, magnetic buttons)

**Files:**
- Modify: `src/app/components/hero/hero.ts` (full rewrite)
- Modify: `src/app/components/hero/hero.html` (full rewrite)
- Modify: `src/app/components/hero/hero.scss` (add blob/gradient-text rules, add `overflow: hidden` and z-index stacking)

**Interfaces:**
- Consumes: `--color-accent`, `--color-accent-2`, `--gradient-primary` (Task 2), `gsap` (Task 1).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Rewrite `hero.html`**

```html
<section id="hero">
  <div class="hero-blobs" aria-hidden="true">
    <span class="blob blob-purple"></span>
    <span class="blob blob-blue"></span>
  </div>

  <div class="hero-tag">
    <span class="dot"></span>
    <span>Available for work</span>
  </div>
  <p class="pre-title">Hola, soy</p>
  <h1><span class="name-gradient">Andrea</span><span class="cursor">_</span></h1>
  <p class="tagline">Fullstack Developer · IA · UX</p>
  <p class="description">
    Construyo aplicaciones funcionales, escalables y bien diseñadas.<br>
    Explorando la intersección entre código e inteligencia artificial.
  </p>
  <div class="cta">
    <a href="#projects" class="btn-primary">Ver proyectos</a>
    <a href="#contact" class="btn-ghost">Contactar</a>
  </div>
  <div class="hero-scroll">
    <span>scroll</span>
    <div class="line"></div>
  </div>
</section>
```

- [ ] **Step 2: Rewrite `hero.ts`**

```ts
import { Component, ElementRef, afterNextRender } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent {
  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      const root = this.el.nativeElement;
      const entranceTargets = root.querySelectorAll(
        '.hero-tag, .pre-title, h1, .tagline, .description, .cta'
      );

      gsap.set(entranceTargets, { opacity: 0, y: 20 });
      gsap.to(entranceTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.1,
      });

      root.querySelectorAll<HTMLElement>('.blob').forEach((blob, i) => {
        gsap.to(blob, {
          x: i % 2 === 0 ? 40 : -30,
          y: i % 2 === 0 ? -25 : 35,
          duration: 10 + i * 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });

      root.querySelectorAll<HTMLElement>('.btn-primary, .btn-ghost').forEach((btn) => {
        const moveX = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
        const moveY = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          moveX((e.clientX - rect.left - rect.width / 2) * 0.3);
          moveY((e.clientY - rect.top - rect.height / 2) * 0.3);
        });

        btn.addEventListener('mouseleave', () => {
          moveX(0);
          moveY(0);
        });
      });
    });
  }
}
```

- [ ] **Step 3: Add blob/gradient/stacking styles to `hero.scss`**

At the top of the `section { ... }` block in `hero.scss` (right after the opening `{` on line 1), add:

```scss
  overflow: hidden;

  .hero-blobs {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.35;
  }

  .blob-purple {
    width: 380px;
    height: 380px;
    top: -80px;
    right: 0;
    background: var(--color-accent);
  }

  .blob-blue {
    width: 320px;
    height: 320px;
    bottom: -60px;
    left: -40px;
    background: var(--color-accent-2);
  }

  .hero-tag, .pre-title, h1, .tagline, .description, .cta, .hero-scroll {
    position: relative;
    z-index: 1;
  }

  .name-gradient {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
```

Then change the `.btn-primary` rule's `background: var(--color-accent);` to `background: var(--gradient-primary);`.

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Verify the blob markup is present**

Run: `grep -o "blob-purple" dist/andreaonweb-portfolio/browser/index.html`
Expected: prints `blob-purple`.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/hero/hero.ts src/app/components/hero/hero.html src/app/components/hero/hero.scss
git commit -m "feat: animate hero (gradient blobs, staggered entrance, magnetic CTAs)"
```

---

### Task 11: Navbar scroll-spy and sliding indicator

**Files:**
- Modify: `src/app/components/navbar/navbar.ts` (full rewrite)
- Modify: `src/app/components/navbar/navbar.html` (full rewrite)
- Modify: `src/app/components/navbar/navbar.scss:62-78,80-109` (`ul` block and mobile media query)

**Interfaces:**
- Consumes: `gsap` (Task 1), `--gradient-primary`, `--color-accent-2` (Task 2), section ids `about`/`skills`/`projects`/`contact` (already present as `<section id="...">` from `app.html`/existing component templates).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Rewrite `navbar.html`**

```html
<nav [class.scrolled]="scrolled">
  <a class="logo" href="#hero">aonweb</a>

  <button
    class="nav-toggle"
    [class.open]="menuOpen"
    (click)="toggleMenu()"
    [attr.aria-expanded]="menuOpen"
    aria-label="Abrir menú"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <ul [class.open]="menuOpen">
    <li><a href="#about" [class.active]="activeSection === 'about'" (click)="closeMenu()">Sobre mí</a></li>
    <li><a href="#skills" [class.active]="activeSection === 'skills'" (click)="closeMenu()">Skills</a></li>
    <li><a href="#projects" [class.active]="activeSection === 'projects'" (click)="closeMenu()">Proyectos</a></li>
    <li><a href="#contact" [class.active]="activeSection === 'contact'" (click)="closeMenu()">Contacto</a></li>
    <span class="nav-indicator"></span>
  </ul>
</nav>
```

- [ ] **Step 2: Rewrite `navbar.ts`**

```ts
import { Component, ElementRef, HostListener, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  scrolled = false;
  menuOpen = false;
  activeSection = 'hero';

  private readonly sectionIds = ['about', 'skills', 'projects', 'contact'];
  private indicator: HTMLElement | null = null;

  constructor(private el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.indicator = this.el.nativeElement.querySelector('.nav-indicator');
      this.updateActiveSection();
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onResize() {
    this.moveIndicator();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu() {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  private updateActiveSection() {
    const viewportCenter = window.innerHeight / 2;
    let current = 'hero';

    for (const id of this.sectionIds) {
      const section = document.getElementById(id);
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        current = id;
        break;
      }
    }

    if (current !== this.activeSection) {
      this.activeSection = current;
    }
    this.moveIndicator();
  }

  private moveIndicator() {
    if (!this.indicator) return;
    const active = this.el.nativeElement.querySelector<HTMLElement>('a.active');

    if (!active) {
      gsap.to(this.indicator, { opacity: 0, duration: 0.2 });
      return;
    }

    gsap.to(this.indicator, {
      opacity: 1,
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: 0.3,
      ease: 'power2.out',
    });
  }
}
```

- [ ] **Step 3: Update the `ul` block and mobile media query in `navbar.scss`**

Replace lines 62-78:
```scss
  ul {
    list-style: none;
    display: flex;
    gap: 32px;

    a {
      font-size: 0.9rem;
      color: var(--color-muted);
      font-family: var(--font-mono);
      transition: color 0.2s;

      &:hover {
        color: var(--color-accent);
        text-decoration: none;
      }
    }
  }
```
with:
```scss
  ul {
    list-style: none;
    display: flex;
    gap: 32px;
    position: relative;

    a {
      font-size: 0.9rem;
      color: var(--color-muted);
      font-family: var(--font-mono);
      transition: color 0.2s;

      &:hover {
        color: var(--color-accent);
        text-decoration: none;
      }

      &.active {
        color: var(--color-accent-2);
      }
    }

    .nav-indicator {
      position: absolute;
      bottom: -6px;
      left: 0;
      height: 2px;
      background: var(--gradient-primary);
      opacity: 0;
      pointer-events: none;
    }
  }
```

Then, inside the `@media (max-width: 768px) { ... ul { ... } }` block (lines 87-108), add after the `a { font-size: 1.4rem; letter-spacing: 3px; }` line:
```scss
      .nav-indicator { display: none; }

      a.active { text-decoration: underline; }
```

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/navbar/navbar.ts src/app/components/navbar/navbar.html src/app/components/navbar/navbar.scss
git commit -m "feat: add navbar scroll-spy with sliding gradient indicator"
```

---

### Task 12: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: `Application bundle generation complete.` with no errors, and `Prerendered 1 static route.` still present.

- [ ] **Step 2: Start the dev server**

Run: `npm start` (leave running)
Expected: server starts on `http://localhost:4200`.

- [ ] **Step 3: Manual browser walkthrough**

Open `http://localhost:4200` and verify, in order:
1. Hero: two blurred blobs (purple top-right, blue bottom-left) are visible and drifting slowly; the tag/pretitle/name/tagline/description/CTAs fade/slide in with a stagger on load; "Andrea" renders with a purple→blue gradient fill; moving the mouse over "Ver proyectos"/"Contactar" nudges the button slightly toward the cursor.
2. Scroll down: About's intro paragraphs and the stats row fade up as they enter the viewport; the vertical timeline line draws itself progressively as you scroll through the timeline.
3. Skills grid items fade up on scroll; hovering an icon makes it hop up slightly with a bounce.
4. Project cards fade up on scroll; hovering a card zooms its screenshot slightly and reveals a dark overlay with a working "Ver demo ↗" button and repo link(s); confirm Chat WS and SavePoint cards are present with the correct demo URLs (`chat-frontend-7dwn.onrender.com`, `savepoint-frontend.onrender.com`) and that RecuerdaMed is gone.
5. Contact links fade up on scroll.
6. Navbar: while scrolling, the underline indicator slides smoothly to sit under whichever section link is currently active.
7. Resize the browser to a mobile width (~375px) via DevTools responsive mode: hamburger menu opens/closes the fullscreen nav, and the active link is underlined (indicator hidden, per the mobile fallback).

- [ ] **Step 4: Stop the dev server**

Return to the terminal running `npm start` and stop it (Ctrl+C).

- [ ] **Step 5: Confirm final git state**

Run: `git status`
Expected: working tree clean (everything committed in Tasks 1-11).

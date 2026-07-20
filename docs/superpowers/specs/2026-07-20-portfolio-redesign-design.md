# Rediseño del portfolio — spec

## Contexto

Portfolio personal de Andrea (Angular 21, standalone components, SSR con `@angular/ssr`). Actualmente tiene una estética "terminal/hacker" oscura con un único acento morado (`#b48fff`), fuente monoespaciada para títulos, y animaciones CSS puntuales (parpadeo del cursor, pulso del dot "available", scanline en el hero). No usa ninguna librería de animación.

Se quiere elevar el diseño tomando ideas (no una copia) de [utkxrsh13/portfolio](https://github.com/utkxrsh13/portfolio), un portfolio en React que usa **Framer Motion** + **react-scroll** para animaciones de scroll, hero animado y scroll-spy en la navbar. Como este proyecto es Angular, el equivalente elegido es **GSAP + ScrollTrigger**.

También se quiere:
- Pasar de un acento único (morado) a una paleta fría de dos acentos (morado + azul) combinados en gradientes.
- Añadir capturas de pantalla ("preview") a las tarjetas de proyecto.
- Añadir dos proyectos nuevos (Chat WS, SavePoint), actualizar el demo de "The Shire of Paws" y eliminar "RecuerdaMed" (sin captura disponible).

## Alcance

Rediseño visual y de interacción del portfolio existente. **No** se tocan: estructura de secciones (navbar/hero/about/skills/projects/contact), contenido textual de about/skills/contact, arquitectura de componentes standalone, ni el SSR/build config salvo lo estrictamente necesario para soportar GSAP en servidor.

Fuera de alcance (YAGNI): cursor personalizado, modal/lightbox de imágenes, i18n, dark/light toggle (el sitio ya es oscuro por diseño).

## 1. Paleta de colores

Sustituir en `src/styles.scss`:

```scss
--color-bg: #08080f;
--color-surface: #0f0f1a;
--color-surface-2: #14141f;
--color-border: #22222f;
--color-accent: #a78bfa;        // morado
--color-accent-2: #60a5fa;      // azul (nuevo)
--color-accent-dim: rgba(167, 139, 250, 0.12);
--color-accent-glow: rgba(167, 139, 250, 0.25);
--gradient-primary: linear-gradient(135deg, var(--color-accent-2), var(--color-accent));
--color-text: #f0f0f0;
--color-muted: #888888;
```

Usos del `--gradient-primary`:
- Nombre "Andrea" en el hero (`background-clip: text`).
- Botón primario del hero y botón "Ver demo" de las tarjetas (fondo en vez de `--color-accent` plano).
- Borde/glow al hover de tarjetas de proyecto, skills y stats.
- Blobs de fondo animados del hero.
- Indicador activo de la navbar.

El resto de variables (`--color-accent`, `--color-muted`, etc.) se siguen usando tal cual donde no tenga sentido un gradiente (texto, bordes finos, iconos).

## 2. Animaciones (GSAP + ScrollTrigger)

Nueva dependencia: `gsap` (incluye `ScrollTrigger`, no requiere licencia para este uso).

**Regla transversal de SSR:** todo el código que toque GSAP/`window`/`document` se ejecuta solo en `ngAfterViewInit`, dentro de un guard `isPlatformBrowser(this.platformId)`. En servidor no se registra nada. Los estados iniciales de las animaciones (opacity/transform antes de animar) se definen por CSS con una clase base, para que el HTML renderizado en SSR no quede invisible si JS tarda en hidratar.

### Hero (`hero.ts` / `hero.html` / `hero.scss`)
- 2–3 blobs (`div`) radiales con `filter: blur(...)`, uno morado y otro azul, posicionados en fondo del hero con `position: absolute`, animados con GSAP en bucle infinito (`yoyo: true`, movimiento lento de `x`/`y`, 8-14s por ciclo).
- Entrada del contenido: al cargar el componente, timeline GSAP que anima `.hero-tag`, `.pre-title`, `h1`, `.tagline`, `.description`, `.cta` con fade + `translateY` escalonado (`stagger: 0.08`).
- Botones `.btn-primary` / `.btn-ghost`: efecto "magnético" — en `mousemove` sobre el botón, GSAP desplaza el botón unos pocos px hacia el cursor (`quickTo` para suavidad); en `mouseleave` vuelve a `x:0, y:0`.

### Scroll reveal global (about, skills, projects, contact)
- Directiva Angular reutilizable `appScrollReveal` (standalone, `src/app/shared/scroll-reveal.directive.ts`) que, en `ngAfterViewInit` (solo browser), registra un `ScrollTrigger` sobre el elemento host: anima de `opacity:0, y:24` a `opacity:1, y:0` cuando entra en viewport (`start: 'top 85%'`, sin scrub, se dispara una vez).
- Para grupos con varios hijos (stats, skill-items, tarjetas de proyecto, links de contacto), la directiva acepta un input `appScrollRevealStagger` con selector de hijos y aplica `stagger: 0.08` sobre ese `ScrollTrigger` único, en vez de uno por hijo.
- Se aplica en: `.about-intro p`, `.stats-row .stat`, `.tl-item`, `.skills-grid .skill-item`, `.projects .card`, `.contact .links a`.

### Timeline (`about.html` / `about.scss`)
- La línea vertical (`.tl-track::before`) se sustituye por un `div.tl-line` real con `transform-origin: top` y `scaleY(0)` inicial.
- `ScrollTrigger` con `scrub: 0.5` sobre `.tl-track` anima `scaleY` de 0 a 1 conforme se hace scroll por la sección, dando efecto de línea "dibujándose".

### Navbar (`navbar.ts` / `navbar.html` / `navbar.scss`)
- Scroll-spy: en el mismo `HostListener('window:scroll')` ya existente, se calcula qué `<section>` está más cerca del centro del viewport y se marca su link como activo (`class="active"`).
- Un elemento indicador (`span.nav-indicator`, con `background: var(--gradient-primary)`) se posiciona con GSAP (`gsap.to`, `duration: 0.3`) debajo del link activo, calculando su `offsetLeft`/`offsetWidth`. Fallback sin JS: el link activo simplemente tiene subrayado por CSS (`.active`), por si GSAP no ha hidratado aún.

### Skills (`skills.html` / `skills.scss`)
- Aparte del scroll-reveal con stagger ya cubierto arriba, en hover cada `.skill-icon` gana un pequeño `translateY` + rebote (`gsap.to` con `ease: 'back.out'`) en vez del `transform` CSS actual.

## 3. Tarjetas de proyecto

### Estructura visual nueva (`projects.html` / `projects.scss`)
Cada `.card` pasa a tener:
1. `.card-preview`: contenedor con la captura (`<img>`, `object-fit: cover`, ratio fijo ~16:10) y una barra superior tipo "ventana de navegador" (3 puntos de color decorativos, `::before` con `box-shadow` de 3 círculos, sin texto de URL para no sobrecargar).
2. Overlay (`.card-preview .overlay`): capa `position: absolute` con `background: linear-gradient(to top, rgba(8,8,15,.95), transparent 60%)`, `opacity: 0` por defecto, `opacity: 1` en `:hover`/`:focus-within` de `.card`, transición 0.25s. Dentro del overlay van los botones `.btn-demo` y los links de repo, centrados verticalmente en la mitad inferior.
3. Debajo de la preview se mantiene el bloque actual: header con icono+nombre+badge, descripción, chips de tecnologías. Se elimina el bloque `.actions`/`.repo-links` original de abajo (ahora viven dentro del overlay de la imagen) — igual para proyectos sin overlay hover en pantallas táctiles: en `@media (hover: none)` el overlay queda siempre visible con `opacity: .92` en vez de depender de `:hover`.
4. Ligero `scale(1.03)` de la imagen en hover (transición CSS, no GSAP, para mantenerlo simple y fluido).

### Datos (`projects.ts`)
Se reemplaza el array `projects` completo por:

1. **Reverso Social** — sin cambios de datos, + `image: 'projects/reverso.png'`.
2. **The Shire of Paws** — + `image: 'projects/theshireofpaws.png'`, `vercel` (campo demo) actualizado a `https://theshireofpaws-frontend.onrender.com`.
3. **Chat WS** (nuevo):
   - descripción: "Chat en tiempo real con WebSockets, autenticación Firebase y modo de conversación con IA."
   - tech: `['Angular', 'TypeScript', 'FastAPI', 'Python', 'Firebase']`
   - repos: `[{ label: 'Repositorio', url: 'https://github.com/andreaonweb/chat-ws' }]`
   - demo: `https://chat-frontend-7dwn.onrender.com`
   - image: `projects/chat.png`
   - icono nuevo: burbuja de chat (SVG stroke, mismo estilo que el resto).
4. **SavePoint** (nuevo):
   - descripción: "Tracker fullstack de biblioteca de videojuegos: horas jugadas, progreso, reseñas y estadísticas."
   - tech: `['Angular', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Firebase']`
   - repos: `[{ label: 'Repositorio', url: 'https://github.com/SavePoint-App/SavePoint-App' }]`
   - demo: `https://savepoint-frontend.onrender.com`
   - image: `projects/savepoint.png`
   - icono nuevo: mando/controller (SVG stroke, mismo estilo).
5. **RecuerdaMed** — eliminado del array.

El campo `vercel` del modelo se mantiene con ese nombre (aunque ahora algunos apunten a Render) para no tocar más superficie de la necesaria; solo cambia el valor.

### Assets
Copiar `chat.png`, `reverso.png`, `savepoint.png`, `theshireofpaws.png` desde `C:\Users\Mati\Downloads\capturas_proyectos` a `public/projects/` del repo (servidas en runtime como `/projects/<archivo>.png`, ya que `public/` está declarado como asset root en `angular.json`).

## 4. Fuera de alcance / notas

- No se añade lightbox ni modal de imagen ampliada.
- No se añade cursor personalizado.
- RecuerdaMed queda eliminado del listado de proyectos (no del repo del proyecto en sí, solo de esta web).
- Todas las animaciones GSAP deben degradar con gracia si JS no ha cargado aún (contenido visible por defecto vía CSS, no oculto hasta que GSAP actúe), para no penalizar SSR/SEO ni dejar la página en blanco si algo falla.

## Testing

- Verificación manual en navegador (`ng serve`): scroll por todas las secciones, comprobar reveals, timeline, hover de tarjetas y navbar scroll-spy en desktop y viewport mobile (menú hamburguesa).
- `ng build` (SSR) debe completar sin errores relacionados con `window`/`document` no definidos en servidor.
- No se requieren tests unitarios nuevos más allá de que los `*.spec.ts` existentes sigan pasando (`ng test`); no se añade cobertura específica para animaciones (son efectos visuales, no lógica de negocio).

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AboutComponent } from './components/about/about';
import { SkillsComponent } from './components/skills/skills';
import { ProjectsComponent } from './components/projects/projects';
import { ContactComponent } from './components/contact/contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './app.html',
})
export class App { }
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

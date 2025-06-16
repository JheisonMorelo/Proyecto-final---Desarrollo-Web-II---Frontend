import { Component } from '@angular/core';
import { ServicesHeroSectionComponent } from './services-hero-section/services-hero-section.component';
import { ServicesListSectionComponent } from './services-list-section/services-list-section.component';

@Component({
  selector: 'app-servicios',
  imports: [ServicesHeroSectionComponent, ServicesListSectionComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {

}

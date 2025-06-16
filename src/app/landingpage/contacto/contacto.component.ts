import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { InfoSectionComponent } from './info-section/info-section.component';
import { MapSectionComponent } from './map-section/map-section.component';

@Component({
  selector: 'app-contacto',
  imports: [HeroSectionComponent,
    InfoSectionComponent,
    MapSectionComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

}

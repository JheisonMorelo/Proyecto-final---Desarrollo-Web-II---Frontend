import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { InfoSectionComponent } from './info-section/info-section.component';
import { FormSectionComponent } from './form-section/form-section.component';
import { MapSectionComponent } from './map-section/map-section.component';

@Component({
  selector: 'app-contacto',
  imports: [HeroSectionComponent,
    InfoSectionComponent,
    FormSectionComponent,
    MapSectionComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

}

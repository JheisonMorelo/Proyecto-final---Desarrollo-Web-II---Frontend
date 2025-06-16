import { Component } from '@angular/core';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { FilosofiaSectionComponent } from './filosofia-section/filosofia-section.component';
import { TeamSectionComponent } from './team-section/team-section.component';
import { PorQueElegirnosSectionComponent } from './por-que-elegirnos-section/por-que-elegirnos-section.component';

@Component({
  selector: 'app-sobre-nosotros',
  imports: [HeroSectionComponent,
    FilosofiaSectionComponent,
    TeamSectionComponent,
    PorQueElegirnosSectionComponent],
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {

}

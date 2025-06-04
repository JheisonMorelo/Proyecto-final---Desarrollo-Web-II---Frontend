import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLandingpageComponent } from './header-landingpage/header-landingpage.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderLandingpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}

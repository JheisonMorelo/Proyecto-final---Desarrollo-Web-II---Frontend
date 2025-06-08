import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root', 
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}

// src/app/pages/dashboard/dashboard-page/dashboard-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Para <router-outlet>

// Importa los componentes hijos que usará directamente este componente
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true, // ¡Es un componente standalone!
  imports: [
    CommonModule,
    RouterModule, // router-outlet se encuentra en RouterModule
    DashboardHeaderComponent,
    DashboardSidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent { }
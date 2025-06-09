// src/app/pages/dashboard/dashboard-page/dashboard-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Para <router-outlet>

// Importa los componentes hijos que usará directamente este componente
import { DashboardClientHeaderComponent } from './dashboard-client-header/dashboard-client-header.component';
import { DashboardClientSidebarComponent } from './dashboard-client-sidebar/dashboard-client-sidebar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true, // ¡Es un componente standalone!
  imports: [
    CommonModule,
    RouterModule, // router-outlet se encuentra en RouterModule
    DashboardClientHeaderComponent,
    DashboardClientSidebarComponent
  ],
  templateUrl: './dashboard-client-page.component.html',
  styleUrls: ['./dashboard-client-page.component.css']
})
export class DashboardClientPageComponent { }
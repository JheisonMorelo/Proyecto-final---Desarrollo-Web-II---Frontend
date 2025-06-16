import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth/auth.service';
import { Subscription, combineLatest, Observable } from 'rxjs'; 
import { map } from 'rxjs/operators'; 

interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
  permission?: string; 
  roles?: string[]; 
  category?: string; 
}

@Component({
  selector: 'app-dashboard-sidebar', 
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.css'
})
export class DashboardSidebarComponent implements OnInit, OnDestroy {
  allMenuItems: MenuItem[] = [
    { label: 'Inicio', icon: 'bi bi-house-door', routerLink: './home', roles: ['cliente', 'asistente_ventas', 'recepcionista', 'especialista'], category: 'General' },
    
    // Categoría: Cliente
    { label: 'Mis Citas', icon: 'bi bi-calendar-check', routerLink: 'mis-citas', permission: 'ver_citas_propias', roles: ['cliente'], category: 'Mi Cuenta' },
    { label: 'Mis Pedidos', icon: 'bi bi-box-seam', routerLink: 'mis-pedidos', permission: 'ver_pedidos_propios', roles: ['cliente'], category: 'Mi Cuenta' },
    { label: 'Mi Perfil', icon: 'bi bi-person-circle', routerLink: 'mi-perfil-client', roles: ['cliente', 'asistente_ventas', 'recepcionista', 'especialista'], category: 'Mi Cuenta' },

    // Categoría: Recepcionista
    { label: 'Gestionar Citas', icon: 'bi bi-calendar-event', routerLink: './gestionar-citas', permission: 'ver_todas_citas', roles: ['recepcionista'], category: 'Gestión' },
    { label: 'Gestionar Servicios', icon: 'bi bi-star', routerLink: './gestionar-servicios', permission: 'ver_todos_servicios', roles: ['recepcionista'], category: 'Gestión' }, 
    
    // Categoría: Asistente de Ventas
    { label: 'Gestionar Pedidos', icon: 'bi bi-box-arrow-right', routerLink: './gestionar-pedidos', permission: 'ver_todos_pedidos', roles: ['asistente_ventas'], category: 'Ventas' },
    { label: 'Gestionar Productos', icon: 'bi bi-boxes', routerLink: './gestionar-productos', permission: 'ver_todos_productos', roles: ['asistente_ventas'], category: 'Ventas' },

    // Categoría: Especialista
    { label: 'Mis Informes', icon: 'bi bi-file-earmark-text', routerLink: './mis-informes', permission: 'buscar_informe_propio', roles: ['especialista'], category: 'Informes' },

    // // --- NUEVOS ITEMS DE MENÚ PARA REGISTRO DE PERSONAL (Acceso por Gatekeeper) ---
    // // Estos items SOLO serán visibles si el usuario logueado tiene el permiso 'administrar_usuarios'
    // // que le otorgamos al rol 'administrador' en el seeder.
    // { label: 'Registrar Recepcionista', icon: 'bi bi-person-plus', routerLink: './registrar-recepcionista', permission: 'registrar_recepcionista', roles: ['administrador'], category: 'Administración de Personal' },
    // { label: 'Registrar Especialista', icon: 'bi bi-person-plus', routerLink: './registrar-especialista', permission: 'registrar_especialista', roles: ['administrador'], category: 'Administración de Personal' },
    // { label: 'Registrar Asistente', icon: 'bi bi-person-plus', routerLink: './registrar-asistente-ventas', permission: 'registrar_asistente', roles: ['administrador'], category: 'Administración de Personal' },
    // // Asegúrate de que los roles asignados a estos permisos en tu seeder son correctos.
    // // Si 'administrador' tiene estos permisos, debes cambiar 'roles: ['recepcionista']' a 'roles: ['administrador']'
    // // Y debes loguearte con un usuario que tenga el rol 'administrador' (creado en el seeder o manualmente).
    // // Si decidiste que el rol 'recepcionista' tiene estos permisos, entonces está bien.
  ];

  visibleMenuItems$: Observable<MenuItem[]> | undefined;
  visibleCategories$: Observable<string[]> | undefined;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.visibleMenuItems$ = combineLatest([
      this.authService.userPermissions$,
      this.authService.userRole$
    ]).pipe(
      map(([permissions, role]) => {
        return this.allMenuItems.filter(item => {
          const hasRequiredRole = !item.roles || (role && item.roles.includes(role));
          const hasRequiredPermission = !item.permission || (permissions && permissions.includes(item.permission));
          
          return hasRequiredRole && hasRequiredPermission;
        });
      })
    );

    this.visibleCategories$ = this.visibleMenuItems$.pipe(
      map(items => {
        const categories = new Set<string>();
        items.forEach(item => {
          if (item.category) {
            categories.add(item.category);
          }
        });
        return Array.from(categories).sort();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getMenuItemsByCategory(category: string, allItems: MenuItem[]): MenuItem[] {
    return allItems.filter(item => item.category === category);
  }
}

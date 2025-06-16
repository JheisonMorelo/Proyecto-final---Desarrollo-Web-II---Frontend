    import { Injectable } from '@angular/core';
    import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
    import { Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class AdminRegistrationGuard implements CanActivate {

      constructor(private router: Router) {}

      canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        // Verificar si la bandera de acceso temporal está en sessionStorage
        const hasAccess = sessionStorage.getItem('adminRegistrationAccess') === 'true';

        if (hasAccess) {
          return true; // Acceso concedido
        } else {
          // Si no tiene acceso, redirigir a la página del gatekeeper
          // y pasar la URL a la que intentaba acceder como query parameter para redirección futura
          return this.router.createUrlTree(['/admin-panel-access'], { 
            queryParams: { redirectTo: state.url } 
          });
        }
      }
    }
    
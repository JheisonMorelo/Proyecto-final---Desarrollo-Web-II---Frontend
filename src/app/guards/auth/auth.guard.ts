import { CanActivateFn } from '@angular/router';

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
          return true; // Usuario logueado, permitir acceso
        } else {
          // Usuario no logueado, redirigir a la página de login
          return this.router.createUrlTree(['/landingpage/login']); // <--- Asegúrate de que esta sea la ruta de tu login
        }
      })
    );
  }
}
export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
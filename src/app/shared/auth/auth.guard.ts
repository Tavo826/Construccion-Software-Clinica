import { Injectable } from "@angular/core"
import { AuthService } from "./auth.service"
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.authService.isLoggedIn()) {
      return true
    }

    this.router.navigate(['/Login'], {
      queryParams: { returnUrl: state.url }
    })
    return false
  }
}

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    if (!this.authService.isLoggedIn()) {
      return true
    }

    this.router.navigate(['/Human_Resources'])
    return false
  }
}

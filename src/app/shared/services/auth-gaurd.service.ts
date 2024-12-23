import { Injectable } from '@angular/core';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

//Admin before login check
@Injectable({
  providedIn: "root"
})
export class AdminAuthGuardLogin implements CanActivate {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = sessionStorage.getItem("role")
    if (role == "admin") {
      this.router.navigate(["/admin-dashboard"]);
      return false;
    } else {
      return true;
    }
  }
  isLoggedIn(): boolean {
    const role = sessionStorage.getItem('role');
    return role !== null && role !== undefined;
  }
  
  getRole(): string | null {
    return sessionStorage.getItem('role');
  }
}

//Admin after login check
@Injectable({
  providedIn: 'root'
})
export class AdminAuthGaurdService {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = sessionStorage.getItem("role")
    if (role == 'admin') {
      return true;
    } else {
      this.router.navigate(["/admin-login"]);
      return false;
    }
  }
}

//Customer(Buyer & Seller) before login
@Injectable({
  providedIn: "root"
})
export class SellerBuyerAuthGuardLogin implements CanActivate {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = sessionStorage.getItem("role")
    if (role == "seller") {
      this.router.navigate(["/seller-dashboard"]);
      return false;
    } else if (role == "buyer") {
      this.router.navigate(["/buyer-dashboard"]);
      return false;
    } else {
      return true;
    }
  }
}

//Seller(Customer) after login
@Injectable({
  providedIn: 'root'
})
export class SellerAuthGaurdService {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = sessionStorage.getItem("role");
    if (role == 'seller') {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}

//Buyer(Customer) after login
@Injectable({
  providedIn: 'root'
})
export class BuyerAuthGaurdService {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let role = sessionStorage.getItem("role")
    if (role == 'buyer') {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}

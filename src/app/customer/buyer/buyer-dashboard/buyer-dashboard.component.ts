import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AdminAuthGuardLogin } from '../../../shared/services/auth-gaurd.service';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {

  all_products = [];
  categories = [];
  filtered_products = [];
  show_checkout: Boolean = false;
  searchQuery: string = '';
  private searchSubscription: Subscription;

  // Variables para el filtrado
  selectedGen: string = '';
  selectedType: string = '';
  selectedTypeCard: string = '';


  constructor(
    private router: Router, 
    private customerService: CustomerService, 
    public authService: AdminAuthGuardLogin,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.getAllProduct();
    this.getCategories();
    this.searchSubscription = this.searchService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
      this.filterProducts();
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  filterProducts() {
    this.filtered_products = this.all_products.filter(product => {
      const genMatch = this.selectedGen ? product.gen === this.selectedGen : true;
      const typeMatch = this.selectedType ? product.type === this.selectedType : true;
      const typeCardMatch = this.selectedTypeCard ? product.idCategory === this.selectedTypeCard : true;
      const searchMatch = this.searchQuery
        ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;

      return product.status === 'publish' && genMatch && typeMatch && searchMatch && typeCardMatch;
    });
  }

  getAllProduct() {
    this.customerService.allProduct().subscribe(data => {
      this.all_products = data; 
      // Filtrar los productos con `status: "publish"`
      this.filtered_products = this.all_products.filter(product => product.status === 'publish');
    }, error => {
      console.log("Error al obtener los productos", error);
    });
  }

  getCategories() {
    this.customerService.allCategories().subscribe(data => {
      console.log('Categorías desde la API:', data);
      if (Array.isArray(data)) {
        this.categories = data;
      } else {
        console.log('El formato no es un arreglo válido:', data);
        this.categories = [];
      }
    }, error => {
      console.log('Error al cargar categorías', error);
    });
  }


  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoría desconocida';
  }

  buyProduct(id) {
    this.show_checkout = true;
    this.customerService.quickBuyProduct(id) 
    this.router.navigateByUrl("/checkout");
  }



}

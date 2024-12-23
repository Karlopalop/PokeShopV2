import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../core/models/object-model';
declare var jQuery: any;

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.component.html',
  styleUrls: ['./product-crud.component.scss']
})
export class ProductCrudComponent implements OnInit {
  all_product_data;
  addEditProductForm: FormGroup;
  addEditProduct: boolean = false;//for form validation
  popup_header: string;
  add_product: boolean;
  edit_product: boolean;

  product_data;
  product_dto: Product;

  single_product_data;
  edit_product_id;

  constructor(private formBuilder: FormBuilder, private router: Router, private product_service: ProductService) { }

  ngOnInit() {
    this.addEditProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      productDesc: ['', Validators.required],
      mrp: ['', Validators.required],
      dp: ['', Validators.required],
      idCategory: ['', Validators.required],
      gen: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required]
    })
    this.getAllProduct()
  }

  get rf() { return this.addEditProductForm.controls; }

  getAllProduct() {
    this.product_service.allProduct().subscribe(data => {
      this.all_product_data = data;
    }, error => {
      console.log("My error", error);
    })
  }
  addProductPopup() {
    this.add_product = true;
    this.edit_product = false;
    this.popup_header = "Add New Product";
    this.addEditProductForm.reset();
  }

  addNewProduct() {
    console.log('Iniciando proceso de agregar producto...');
    this.addEditProduct = true;

    if (this.addEditProductForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    console.log('Formulario válido, procediendo con la lógica...');
    this.product_data = this.addEditProductForm.value;
    
    this.product_service.allProduct().subscribe({
      next: (products) => {
        console.log('Productos obtenidos:', products);

        const lastId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
        const newId = (lastId + 1).toString();
        console.log('ID generado:', newId);

        this.product_dto = {
          id: newId,
          name: this.product_data.name,
          uploadPhoto: this.product_data.uploadPhoto,
          productDesc: this.product_data.productDesc,
          mrp: this.product_data.mrp,
          dp: this.product_data.dp,
          idCategory: this.product_data.idCategory,
          gen: this.product_data.gen,
          type: this.product_data.type,
          status: this.product_data.status,
        };

        console.log('DTO preparado para enviar:', this.product_dto);

        this.product_service.addNewProduct(this.product_dto).subscribe({
          next: (data) => {
            console.log('Producto agregado con éxito:', data);
            jQuery('#addEditProductModal').modal('toggle');
            this.getAllProduct();
          },
          error: (err) => {
            console.error('Error al enviar el producto:', err);
            alert('Some Error Occurred');
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener la lista de productos:', err);
        alert('Error fetching products');
      }
    });
  }

  editProductPopup(id) {
    this.add_product = false;
    this.edit_product = true;
    this.popup_header = "Edit Product";
    this.addEditProductForm.reset();
    this.product_service.singleProduct(id).subscribe(data => {
      this.single_product_data = data;
      this.edit_product_id = data.id;
      // console.log("single_product_data", this.single_product_data)
      this.addEditProductForm.setValue({
        name: this.single_product_data.name,
        // uploadPhoto: '',
        uploadPhoto: this.single_product_data.uploadPhoto,
        productDesc: this.single_product_data.productDesc,
        mrp: this.single_product_data.mrp,
        dp: this.single_product_data.dp,
        idCategory: this.single_product_data.idCategory,
        gen: this.single_product_data.gen,
        type: this.single_product_data.type,
        status: this.single_product_data.status
      })
    })
  }

  updateProduct() {
    this.addEditProduct = true;
    if (this.addEditProductForm.invalid) {
      // alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value))
      return;
    }
    this.product_data = this.addEditProductForm.value;
    this.product_dto = {
      id: 0,
      name: this.product_data.name,
      uploadPhoto: this.product_data.uploadPhoto,
      productDesc: this.product_data.productDesc,
      mrp: this.product_data.mrp,
      dp: this.product_data.dp,
      idCategory: this.product_data.idCategory,
      gen: this.product_data.gen,
      type: this.product_data.type,
      status: this.product_data.status
    }
    this.product_service.updateProduct(this.edit_product_id, this.product_dto).subscribe(data => {
      // console.log(data);
      jQuery('#addEditProductModal').modal('toggle');
      this.getAllProduct();
    }, err => {
      alert("Some Error Occured");
    })
  }

  deleteProduct(id) {
    let r = confirm("Quieres eliminar el producto con id: " + id + "?");
    if (r == true) {
      this.product_service.deleteProduct(id).subscribe(data => {
        console.log("Borrado correctamente", data);
        this.getAllProduct();
      }, err => {
        alert("Algun error ocurrio");
      })
    } else {
      alert("Has cancelado el borrado!");
    }

  }
}

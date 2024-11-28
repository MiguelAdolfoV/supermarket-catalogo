import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  cart: any[] = [];
  categoryId: number;

  constructor(private route: ActivatedRoute, private catalogService: CatalogService) {
    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));
  }

  async ngOnInit() {
    this.products = await this.catalogService.getProducts(this.categoryId);
    this.products.forEach(product => {
      product.quantity = 1; // Cantidad inicial
      product.imagePath = this.getImagePath(product.nombre); // Ruta de imagen
    });
  }

  getImagePath(productName: string): string {
    // Reemplazar espacios por guiones bajos y agregar la extensión `.jpg`
    const formattedName = productName.replace(/ /g, '_');
    return `/images/${formattedName}.jpg`;
  }

  setDefaultImage(event: any) {
    event.target.src = '/images/default.jpg'; // Cambiar a imagen por defecto
  }

  addToCart(product: any) {
    if (product.quantity > 0 && product.quantity <= product.stock) {
      const cartItem = {
        id: product.idarticulo,
        name: product.nombre,
        price: product.precio_venta,
        quantity: product.quantity,
      };

      // Agregar al carrito
      this.cart.push(cartItem);

      // Mostrar el carrito en la consola
      console.log('Carrito:', JSON.stringify(this.cart, null, 2));
    } else {
      console.warn('Cantidad inválida para', product.nombre);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  loading: boolean = true; // Indicador de carga
  segment: string = 'select'; // Segmento actual
  productos: any[] = [];
  categorias: any[] = []; // Lista de categorías
  newProducto: any = {
    nombre: '',
    idcategoria: null,
    codigo: '',
    precio_venta: null,
    stock: 0,
    descripcion: '',
  };

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    try {
      console.log('Cargando datos para el modal de productos...');
      // Cargar productos
      const productosResponse = await axios.get('http://localhost:3000/articulos');
      this.productos = productosResponse.data;
      console.log('Productos cargados:', this.productos);

      // Cargar categorías desde el endpoint GET /categories
      const categoriasResponse = await axios.get('http://localhost:3000/categories');
      this.categorias = categoriasResponse.data;
      console.log('Categorías cargadas:', this.categorias);

    } catch (error) {
      console.error('Error al cargar los datos:', error);
      alert('Ocurrió un error al cargar los datos.');
    } finally {
      this.loading = false; // Finaliza la carga
    }
  }

  // Seleccionar un producto y cerrar el modal
  selectProducto(producto: any) {
    console.log('Producto seleccionado:', producto);
    this.modalCtrl.dismiss(producto);
  }

  // Agregar un nuevo producto
  async addProducto() {
    if (!this.newProducto.nombre || !this.newProducto.idcategoria) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    try {
      console.log('Agregando producto:', this.newProducto);
      const response = await axios.post('http://localhost:3000/addarticulos', this.newProducto);
      alert('Producto agregado exitosamente');
      console.log('Respuesta del servidor:', response.data);
      this.modalCtrl.dismiss(response.data);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      alert('Ocurrió un error al agregar el producto.');
    }
  }

  // Cerrar el modal sin seleccionar
  dismiss() {
    console.log('Modal cerrado sin seleccionar producto.');
    this.modalCtrl.dismiss();
  }
}
  
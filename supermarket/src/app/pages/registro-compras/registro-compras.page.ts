import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProveedoresComponent } from '../../components/modals/proveedores/proveedores.component';
import { ProductosComponent } from '../../components/modals/productos/productos.component';
import axios from 'axios';

@Component({
  selector: 'app-registro-compras',
  templateUrl: './registro-compras.page.html',
  styleUrls: ['./registro-compras.page.scss'],
})
export class RegistroComprasPage {
  ingreso: any = {
    idproveedor: null,
    idusuario: 1, // Asignamos un ID de usuario fijo (puede obtenerse de sesión o contexto)
    tipo_comprobante: '',
    serie_comprobante: '',
    num_comprobante: '',
    fecha: '',
    impuesto: 0,
    total: 0,
  };
  detalles: any[] = [];
  proveedorSeleccionado: any = null;

  constructor(private modalCtrl: ModalController) {}

  async seleccionarProveedor() {
    const modal = await this.modalCtrl.create({
      component: ProveedoresComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.proveedorSeleccionado = result.data;
        this.ingreso.idproveedor = this.proveedorSeleccionado.idpersona;
      }
    });
    await modal.present();
  }

  async agregarDetalle() {
    const modal = await this.modalCtrl.create({
      component: ProductosComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.detalles.push({
          idarticulo: result.data.idarticulo,
          nombre: result.data.nombre,
          cantidad: 0, // Valor inicial de cantidad
          precio: result.data.precio_venta,
        });
      }
    });
    await modal.present();
  }

  calcularTotal() {
    let subtotal = 0;
  
    // Sumar el total de cada producto (cantidad * precio)
    this.detalles.forEach((detalle) => {
      subtotal += detalle.cantidad * detalle.precio;
    });
  
    // Aplicar impuesto si existe
    const impuesto = (this.ingreso.impuesto || 0) / 100;
    this.ingreso.total = subtotal + subtotal * impuesto;
  }

  async registrarIngreso() {
    try {
      const detallesFormatted = this.detalles.map((detalle) => ({
        idarticulo: detalle.idarticulo,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio, // Precio por unidad del producto
      }));
  
      const ingresoData = {
        idproveedor: this.ingreso.idproveedor,
        idusuario: 1, // Puedes ajustar este ID según sea necesario
        tipo_comprobante: this.ingreso.tipo_comprobante,
        serie_comprobante: this.ingreso.serie_comprobante,
        num_comprobante: this.ingreso.num_comprobante,
        fecha: this.ingreso.fecha,
        impuesto: this.ingreso.impuesto,
        total: this.ingreso.total,
        detalles: detallesFormatted, // Enviar la lista de detalles
      };
  
      const response = await axios.post('http://localhost:3000/ingresos', ingresoData);
      console.log(response.data);
      alert('Ingreso registrado correctamente');
    } catch (error) {
      console.error("Error al registrar ingreso:", error);
      alert('Error al registrar el ingreso');
    }
  }
  }

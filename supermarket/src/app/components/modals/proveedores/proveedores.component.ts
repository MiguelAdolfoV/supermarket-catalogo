import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent implements OnInit {
  segment: string = 'select';
  proveedores: any[] = [];
  newProveedor: any = {
    nombre: '',
    tipo_documento: '',
    num_documento: '',
    direccion: '',
    telefono: '',
    email: '',
  };

  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    const response = await axios.get('http://localhost:3000/proveedores');
    this.proveedores = response.data;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  selectProveedor(proveedor: any) {
    this.modalCtrl.dismiss(proveedor);
  }

  async addProveedor() {
    const response = await axios.post('http://localhost:3000/proveedores', this.newProveedor);
    this.modalCtrl.dismiss(response.data);
  }
}

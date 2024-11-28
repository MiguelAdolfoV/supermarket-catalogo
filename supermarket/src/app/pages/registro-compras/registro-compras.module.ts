import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroComprasPageRoutingModule } from './registro-compras-routing.module';

import { RegistroComprasPage } from './registro-compras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroComprasPageRoutingModule
  ],
  declarations: [RegistroComprasPage]
})
export class RegistroComprasPageModule {}

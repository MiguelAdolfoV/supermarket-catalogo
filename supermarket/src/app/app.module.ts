import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Importar los componentes de los modales
import { ProveedoresComponent } from './components/modals/proveedores/proveedores.component';
import { ProductosComponent } from './components/modals/productos/productos.component';

// Importar FormsModule para el uso de [(ngModel)]
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ProveedoresComponent, // Declarar el componente de proveedores
    ProductosComponent, // Declarar el componente de productos
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule, // Importar FormsModule para ngModel
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

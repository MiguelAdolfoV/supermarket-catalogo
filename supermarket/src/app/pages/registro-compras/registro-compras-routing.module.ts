import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroComprasPage } from './registro-compras.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroComprasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroComprasPageRoutingModule {}

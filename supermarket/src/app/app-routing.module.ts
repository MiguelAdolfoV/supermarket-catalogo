import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule) },
  { path: 'products/:categoryId', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule) },
  {
    path: 'registro-compras',
    loadChildren: () => import('./pages/registro-compras/registro-compras.module').then(m => m.RegistroComprasPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
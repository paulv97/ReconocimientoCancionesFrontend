import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => { return import('./pages/home/home.module').then(m => m.HomeModule) } },
  { path: 'analisis-sentimientos', loadChildren: () => { return import('./pages/analisis-sentimientos/analisis-sentimientos.module').then(m => m.AnalisisSentimientosModule) } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

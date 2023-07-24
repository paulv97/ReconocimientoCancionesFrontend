import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalisisSentimientosComponent } from './analisis-sentimientos.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AnalisisSentimientosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: AnalisisSentimientosComponent}])
  ]
})
export class AnalisisSentimientosModule { }

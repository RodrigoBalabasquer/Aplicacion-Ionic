import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestorEncuestasPage } from './gestor-encuestas';

@NgModule({
  declarations: [
    GestorEncuestasPage,
  ],
  imports: [
    IonicPageModule.forChild(GestorEncuestasPage),
  ],
})
export class GestorEncuestasPageModule {}

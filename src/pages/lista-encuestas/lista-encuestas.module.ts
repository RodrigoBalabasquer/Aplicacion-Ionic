import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaEncuestasPage } from './lista-encuestas';

@NgModule({
  declarations: [
    ListaEncuestasPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaEncuestasPage),
  ],
})
export class ListaEncuestasPageModule {}

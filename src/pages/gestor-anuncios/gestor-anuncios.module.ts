import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestorAnunciosPage } from './gestor-anuncios';

@NgModule({
  declarations: [
    GestorAnunciosPage,
  ],
  imports: [
    IonicPageModule.forChild(GestorAnunciosPage),
  ],
})
export class GestorAnunciosPageModule {}

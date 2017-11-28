import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstadisticaEncuestaPage } from './estadistica-encuesta';

@NgModule({
  declarations: [
    EstadisticaEncuestaPage,
  ],
  imports: [
    IonicPageModule.forChild(EstadisticaEncuestaPage),
  ],
})
export class EstadisticaEncuestaPageModule {}

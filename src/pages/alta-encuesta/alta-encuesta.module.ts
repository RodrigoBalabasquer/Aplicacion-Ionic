import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AltaEncuestaPage } from './alta-encuesta';

@NgModule({
  declarations: [
    AltaEncuestaPage,
  ],
  imports: [
    IonicPageModule.forChild(AltaEncuestaPage),
  ],
})
export class AltaEncuestaPageModule {}

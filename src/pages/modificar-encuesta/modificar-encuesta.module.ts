import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModificarEncuestaPage } from './modificar-encuesta';

@NgModule({
  declarations: [
    ModificarEncuestaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModificarEncuestaPage),
  ],
})
export class ModificarEncuestaPageModule {}

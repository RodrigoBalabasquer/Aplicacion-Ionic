import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroAlumnoPage } from './registro-alumno';

@NgModule({
  declarations: [
    RegistroAlumnoPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroAlumnoPage),
  ],
})
export class RegistroAlumnoPageModule {}

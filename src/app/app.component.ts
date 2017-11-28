import { GestorEncuestasPage } from '../pages/gestor-encuestas/gestor-encuestas';
import { RegistroProAdmPage } from '../pages/registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../pages/registro-alumno/registro-alumno';
import { MenuPage } from '../pages/menu/menu';
import { ListaAsistenciaPage } from '../pages/lista-asistencia/lista-asistencia';
import { LoginPage } from '../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {      // Okay, so the platform is ready and our plugins are available.      // Here you can do any higher level native things you might need.      
      statusBar.styleDefault();
      console.log(splashScreen);
      if (splashScreen) {
        setTimeout(() => { splashScreen.hide(); }, 100);
      }
    });
  }
}


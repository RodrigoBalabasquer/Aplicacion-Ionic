import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { MenuPage } from '../menu/menu';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaAsistenciaPage } from '../lista-asistencia/lista-asistencia';
import { InformacionPage } from '../informacion/informacion';
import { EstadisticaEncuestaPage} from '../estadistica-encuesta/estadistica-encuesta';
import { LoginPage } from '../login/login';
import { GestorAnunciosPage} from '../gestor-anuncios/gestor-anuncios';

import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-aulas',
  templateUrl: 'aulas.html',
})
export class AulasPage {

  usuarioActual : any;
  perfilActual : any;
  
  public Aulas: AngularFireList<any>;
  public aulas: Observable<any>;
  public ListaAulas: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl : ActionSheetController,afDB: AngularFireDatabase) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;

    this.Aulas = afDB.list('Aulas');
    this.aulas = this.Aulas.valueChanges();
    this.aulas.subscribe(
        aula => {for(let i=0;i<aula.length;i++)
          {
            this.ListaAulas.push(aula[i]);
          }}
      );
}

  IrAula(codigo)
  {
    this.navCtrl.push(InformacionPage,{"codigo":codigo});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AulasPage');
  }

  presentActionSheet() {
    switch (this.perfilActual) 
    {
      case "Administrador":
        let actionSheetAdm = this.actionSheetCtrl.create({
        title: 'Menú',
        buttons: [
          {
            text: 'Menu principal',
            icon: 'home',
            handler: () => {
              
              this.navCtrl.setRoot(MenuPage);
            },
          },
          {
            text: 'Administrar alumnos',
            icon: 'contacts',
            handler: () => {
              this.navCtrl.setRoot(RegistroAlumnoPage);
            }
          },
          {
            text: 'Administrar personal',
            icon: 'contact',
            handler: () => {
              this.navCtrl.setRoot(RegistroProAdmPage);
            }
          },
          {
            text: 'Cerrar menú',
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
   
      actionSheetAdm.present();
      break;
      case "Alumno":
        let actionSheetAlumno = this.actionSheetCtrl.create({
        title: 'Menú',
        buttons: [
          {
            text: 'Menu principal',
            icon: 'home',
            handler: () => {
              
              this.navCtrl.setRoot(MenuPage);
            },
          },
          {
            text: 'Realizar encuestas',
            icon: 'paper',
            handler: () => {
              this.navCtrl.setRoot(ListaEncuestasPage,{booleano:false});
            }
          },
          {
            text: 'Ver Aulas',
            icon: 'md-list',
            handler: () => {
              this.navCtrl.setRoot(AulasPage);
            }
          },
          {
            text: 'Cerrar menú',
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
 
      actionSheetAlumno.present();
      break;
    case "Profesor":
      let actionSheetProfesor = this.actionSheetCtrl.create({
      title: 'Menú',
      buttons: [
        {
          text: 'Menu principal',
          icon: 'home',
          handler: () => {
            
            this.navCtrl.setRoot(MenuPage);
          },
        },
        {
          text: 'Tomar asistencia',
          icon: 'create',
          handler: () => {
            this.navCtrl.setRoot(ListaAsistenciaPage);
          }
        },
        {
          text: 'Gestor de encuestas',
          icon: 'paper',
          handler: () => {
            this.navCtrl.setRoot(GestorEncuestasPage);
          }
        },
        {
          text: 'Ver resultados de encuestas',
          icon: 'pie',
          handler: () => {
            this.navCtrl.setRoot(RespuestasEncuestaPage);
          }
        },
        {
          text: 'Ver Aulas',
          icon: 'md-list',
          handler: () => {
            this.navCtrl.setRoot(AulasPage);
          }
        },
        {
          text: 'Gestor de anuncios',
          icon: 'ios-notifications',
          handler: () => {
            this.navCtrl.setRoot(GestorAnunciosPage);
          }
        },
        {
          text: 'Cerrar menú',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheetProfesor.present();
    break;
  case "Administrativo":
    let actionSheetAdministrativo = this.actionSheetCtrl.create({
      title: 'Menú',
      buttons: [
        {
          text: 'Menu principal',
          icon: 'home',
          handler: () => {
            
            this.navCtrl.setRoot(MenuPage);
          },
        },
        {
          text: 'Tomar asistencia',
          icon: 'create',
          handler: () => {
            this.navCtrl.setRoot(ListaAsistenciaPage);
          }
        },
        {
          text: 'Administrar alumnos',
          icon: 'contacts',
          handler: () => {
            this.navCtrl.setRoot(RegistroAlumnoPage);
          }
        },
        {
          text: 'Gestor de anuncios',
          icon: 'ios-notifications',
          handler: () => {
            this.navCtrl.setRoot(GestorAnunciosPage);
          }
        },
        {
          text: 'Cerrar menú',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheetAdministrativo.present();
    break;
        default:
          break;
      }
  }
}

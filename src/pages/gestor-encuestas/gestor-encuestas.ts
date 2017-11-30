import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { Component } from '@angular/core';
import { AlertController,ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';

import { RegistroProAdmPage } from "../registro-pro-adm/registro-pro-adm";
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { AltaEncuestaPage} from "../alta-encuesta/alta-encuesta";
import { ModificarEncuestaPage} from "../modificar-encuesta/modificar-encuesta";
import { ListaAsistenciaPage } from "../lista-asistencia/lista-asistencia";
import { MenuPage } from "../menu/menu";
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { AulasPage } from "../aulas/aulas";
import { GestorAnunciosPage} from '../gestor-anuncios/gestor-anuncios';

/**
 * Generated class for the GestorEncuestasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gestor-encuestas',
  templateUrl: 'gestor-encuestas.html',
})
export class GestorEncuestasPage {

  usuarioActual : any;
  perfilActual : any;
  nombreComActual: any;

  public Encuestas: AngularFireList<any>;
  public encuestas: Observable<any>;
  public Cuestionarios: Array<any> = [];
  
  /*Items: AngularFireList<any>;
  public Profesores: AngularFireList<any>;
  public profesores: Observable<any>;
  public Materias: Array<string>= [];
  public Encuestas: AngularFireList<any>;
  public encuestas: Observable<any>;
  public ListaEncuesta: Array<any> = [];*/

  constructor(public navCtrl: NavController,public actionSheetCtrl : ActionSheetController, afDB: AngularFireDatabase,public alertControler: AlertController) {
    var item :any = {};
    var fechaFin = [];
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;
    this.nombreComActual = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    
    this.Encuestas = afDB.list('Encuestas');
    this.encuestas = this.Encuestas.valueChanges();

    this.encuestas.subscribe(
        quest => {for(let i=0;i<quest.length;i++)
          { 
             if(quest[i].Profesor == (this.usuarioActual.nombre + " " + this.usuarioActual.apellido))
             { 
               item = quest[i];
               fechaFin = quest[i].FechaFin.split("-",5);
               item.FechaFin = fechaFin[0]+"/"+fechaFin[1]+"/"+fechaFin[2]+" "+fechaFin[3]+":"+fechaFin[4];
               this.Cuestionarios.push(quest[i]);
             }
          }}
      );
  }

  crearEncuesta()
  {
    this.navCtrl.push(AltaEncuestaPage);
  }
  eliminarEncuesta(item)
  { 
    let alert1 = this.alertControler.create({
    title: 'Confirmación',
    message: '¿Esta seguro que quiere eliminar la encuesta',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Si',
        handler: () => {
          this.Encuestas.remove(item.id.toString());
          this.navCtrl.setRoot(GestorEncuestasPage);
        }
      }
    ]
  });
  alert1.present();
  }
  modificarEncuesta(item)
  {
    this.navCtrl.setRoot(ModificarEncuestaPage,{codigo:item.Codigo})
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

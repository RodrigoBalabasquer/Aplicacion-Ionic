import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

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
import { ListaEncuestasPage} from "../lista-encuestas/lista-encuestas";
import { GestorEncuestasPage} from "../gestor-encuestas/gestor-encuestas";



@IonicPage()
@Component({
  selector: 'page-gestor-anuncios',
  templateUrl: 'gestor-anuncios.html',
})
export class GestorAnunciosPage {

  usuarioActual : any;
  perfilActual : any;
  nombreComActual: any;
  crear = false;
  id = 0;

  titulo = "";
  contenido = "";
  opcionSeleccionada = "";

  public Anuncios: AngularFireList<any>;
  public anuncios: Observable<any>;
  public ListaDeAnuncios: Array<any> = [];
  public ListaDeAnunciosAux: Array<any> = [];

  constructor(public toastCtrl : ToastController,public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl : ActionSheetController,afDB: AngularFireDatabase) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    
    this.perfilActual = this.usuarioActual.perfil;
    this.nombreComActual = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;

    this.Anuncios = afDB.list('Anuncios');
    this.anuncios = this.Anuncios.valueChanges();

    this.anuncios.subscribe(
        anun => {for(let i=0;i<anun.length;i++)
          {   
             this.ListaDeAnunciosAux.push(anun[i]);
             if(anun[i].Creador == (this.usuarioActual.nombre + " " + this.usuarioActual.apellido))
             { 
               this.ListaDeAnuncios.push(anun[i]);
             }
          }});
  }
  crearAnuncio()
  {
    this.crear = true;
    this.id = 0;
  }
  cancelar()
  {
    this.crear = false;
  }
  eliminarAnuncio(item)
  {
    this.Anuncios.remove(item.id.toString());
    this.navCtrl.push(GestorAnunciosPage);
  }
  modificarAnuncio(item)
  { 
    this.crear = true;
    this.contenido = item.Contenido;
    this.titulo = item.Titulo;
    this.opcionSeleccionada = item.Aula;
    this.id = item.id;
  }
  subirAnuncio()
  { 
    let toast = this.toastCtrl.create({
          message: 'Anuncio Subido exitosamente',
          duration: 2500,
          position: 'center'
        });
    var item: any = {};
    item.Creador = (this.usuarioActual.nombre + " " + this.usuarioActual.apellido);
    item.Titulo = this.titulo;
    item.Contenido = this.contenido;
    item.Aula = this.opcionSeleccionada;
    if(this.id == 0){
    var id = (this.ListaDeAnunciosAux.length+1).toString();
    item.id = id;
    this.Anuncios.set(id,item);
    }
    else{ 
      item.id = this.id;
      this.Anuncios.update(item.id.toString(),item);
    }
    toast.present();
    this.navCtrl.setRoot(GestorAnunciosPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GestorAnunciosPage');
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


import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';

import { RegistroProAdmPage } from "../registro-pro-adm/registro-pro-adm";
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { ListaAsistenciaPage } from "../lista-asistencia/lista-asistencia";
import { GestorEncuestasPage} from "../gestor-encuestas/gestor-encuestas";
import { MenuPage } from "../menu/menu";
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { AulasPage } from "../aulas/aulas";
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';

/**
 * Generated class for the AltaEncuestaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alta-encuesta',
  templateUrl: 'alta-encuesta.html',
})
export class AltaEncuestaPage {

  usuarioActual : any;
  perfilActual : any;

  public flag : number = 0;
  public formato : string = 'P';
  public cantidad : number = 2;
  public horas : number;

  public question : string = "";
  public nombre: string = "";
  public DateStart: Date;
  public DateEnd: Date;
  public id: any;

  public option : Array<string> = ["","","","","",""];
  public respuesta : string = "";
  public materia: string = "";
  public encuesta : Array<any> = [];
  public cant : Array<number> = [1,2,3,4,5];


  //items: Observable<any[]>;
  Items: AngularFireList<any>;
  public Profesores: AngularFireList<any>;
  public profesores: Observable<any>;
  public Materias: Array<string>= [];
  public Encuestas: AngularFireList<any>;
  public encuestas: Observable<any>;
  public ListaEncuesta: Array<any> = [];

  constructor(public navCtrl: NavController,public actionSheetCtrl : ActionSheetController, afDB: AngularFireDatabase) {
    //this.items = afDB.list('Encuestas').valueChanges();
    this.Items = afDB.list('Encuestas');
    this.Encuestas = afDB.list('Encuestas');
    this.encuestas = this.Encuestas.valueChanges();
    this.encuestas.subscribe(
        encuesta => this.ListaEncuesta = encuesta,
      );

    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;
    this.Profesores = afDB.list('usuarios');
    this.profesores = this.Profesores.valueChanges();
    //console.log(this.profesores);
    this.profesores.subscribe(
        profesor => {for(let i=0;i<profesor.length;i++)
          {
            if(profesor[i].nombre == this.usuarioActual.nombre && profesor[i].apellido == this.usuarioActual.apellido)
            {
              for(let y=0; y < profesor[i].materias.length;y++)
              {
                this.Materias.push(profesor[i].materias[y]);
              }
              break;
            }
          }}
      );
  }

  AgregarQuestion()
  { 
    this.flag = 0;
    var item : any = {};
    item.question = this.question;
    item.indice = this.encuesta.length;
    switch(this.formato)
    {
      case 'P':
        item.tipo = 'P';
        this.encuesta.push(item);
        break;
      case 'U':
        item.tipo = 'U';
        item.opciones= [];
        for(let i=1;i<=this.cantidad;i++)
        {
          item.opciones.push(this.option[i]);
          console.log(this.option);
        }
        this.encuesta.push(item);
        break;
      case 'M':
        item.tipo = 'M';
        this.encuesta.push(item);
        break;
    }
    this.question = ""; 
    this.respuesta = "";
    this.cantidad = 2;
    this.formato = 'P';
    this.option = []
  }
  
  SubirQuestion()
  { 
    var item : any = {};
    var id = (this.ListaEncuesta.length+1).toString();
    item.id = id;
    item.habilitada = true;
    var tiempoActual = Date.now();
    var tiempoFin = tiempoActual + (this.horas* 3600000);
    item.Nombre = this.nombre;
    item.Horas = this.horas;
    item.Materia = this.materia;
    item.Profesor = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    item.Codigo = this.nombre+"-"+this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    item.FechaComienzo = new Date(tiempoActual).getDate()+"-"+(new Date(tiempoActual).getMonth()+1)+"-"+
    new Date(tiempoActual).getUTCFullYear()+"-"+new Date(tiempoActual).getHours()+"-"+new Date(tiempoActual).getMinutes();
    item.FechaFin = new Date(tiempoFin).getDate()+"-"+(new Date(tiempoFin).getMonth()+1)+"-"+
    new Date(tiempoFin).getUTCFullYear()+"-"+new Date(tiempoFin).getHours()+"-"+new Date(tiempoFin).getMinutes();
    item.TiempoFin = tiempoFin;
    item.Preguntas = this.encuesta;
    console.log(this.ListaEncuesta);
    this.Items.set(id,item);
    this.navCtrl.setRoot(GestorEncuestasPage);
  }

  public mychange(event)
  {
    console.log(this.cantidad); // mymodel has the value before the change
  }

  presentActionSheet() {
    console.log(this.Materias);
    switch (this.perfilActual) {
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
              this.navCtrl.setRoot(ListaEncuestasPage);
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

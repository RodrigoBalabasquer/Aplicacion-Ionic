import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams } from 'ionic-angular';

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

@IonicPage()
@Component({
  selector: 'page-modificar-encuesta',
  templateUrl: 'modificar-encuesta.html',
})
export class ModificarEncuestaPage {

  usuarioActual : any;
  perfilActual : any;
  codigo = this.navParams.get("codigo");
  Agregar = true;

  public materia: string = "";
  public nombre: string = "";
  public DateStart: Date;
  public DateEnd: Date;
  public horas : number;
  public cambio: boolean = false;
  public preguntas: Array<any> = [];

  public formato : string = 'P';
  public question : string = "";
  public respuesta : string = "";
  public cantidad : number = 2;
  public option : Array<string> = ["","","","","",""];
  public cant : Array<number> = [1,2,3,4,5];
  public ListaPreguntas : Array<any> = [];

  public Items: AngularFireList<any>;
  public Encuestas: AngularFireList<any>;
  public encuestas: Observable<any>;
  public encuesta: any = {};
  public Profesores: AngularFireList<any>;
  public profesores: Observable<any>;
  public Materias: Array<string>= [];
  constructor(public navCtrl: NavController,public actionSheetCtrl : ActionSheetController, public navParams: NavParams, afDB: AngularFireDatabase) {

    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;

    this.Items = afDB.list('Encuestas');
    this.Encuestas = afDB.list('Encuestas');
    this.encuestas = this.Encuestas.valueChanges();
    this.encuestas.subscribe(
        encuesta => {for(let i=0;i<encuesta.length;i++)
          {
              if(encuesta[i].Codigo == this.codigo )
              {
                this.encuesta = encuesta[i];
                this.nombre = this.encuesta.Nombre;
                this.materia = this.encuesta.Materia;
                this.horas = this.encuesta.Horas;
                this.preguntas = this.encuesta.Preguntas;
                break;
              }
          }}
      );
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
  ModificarQuestion()
  {
    var item : any = {};
    item.id = this.encuesta.id;
    item.Codigo = this.encuesta.Codigo;
    item.FechaComienzo = this.encuesta.FechaComienzo;
    item.habilitada = this.encuesta.habilitada;
    item.Profesor = this.encuesta.Profesor;
    item.Preguntas = this.encuesta.Preguntas;

    if(this.cambio){
    var tiempoActual = Date.now();
    var tiempoFin = tiempoActual + (this.horas* 3600000);
    item.FechaFin = new Date(tiempoFin).getDate()+"-"+(new Date(tiempoFin).getMonth()+1)+"-"+
    new Date(tiempoFin).getUTCFullYear()+"-"+new Date(tiempoFin).getHours()+"-"+new Date(tiempoFin).getMinutes();
    item.TiempoFin = tiempoFin;
    item.Horas = this.horas;
    }
    else{
      item.Horas = this.encuesta.Horas;
      item.TiempoFin = this.encuesta.TiempoFin;
      item.FechaFin = this.encuesta.FechaFin;
    }
    item.Nombre = this.nombre;
    item.Materia = this.materia;
    item.Preguntas = this.preguntas;
    
    this.Items.update(item.id.toString(),item);
    this.navCtrl.setRoot(GestorEncuestasPage);
  }
  completarPregunta()
  {
    var item : any = {};
    item.question = this.question;
    item.indice = this.preguntas.length;
    switch(this.formato)
    {
      case 'P':
        item.tipo = 'P';
        this.preguntas.push(item);
        break;
      case 'U':
        item.tipo = 'U';
        item.opciones= [];
        for(let i=1;i<=this.cantidad;i++)
        {
          item.opciones.push(this.option[i]);
          console.log(this.option);
        }
        this.preguntas.push(item);
        break;
      case 'M':
        item.tipo = 'M';
        this.preguntas.push(item);
        break;
    }
    this.question = ""; 
    this.respuesta = "";
    this.cantidad = 2;
    this.formato = 'P';
    this.option = []
  }
  HabilitarAgregarQuestion()
  {
    this.Agregar = false;
  }
  cancelar()
  {
    this.Agregar = true;
  }
  eliminarPregunta(Indice)
  {
    var preguntas: Array<any> = [];
    for(let i = 0; i< this.preguntas.length;i++)
    {
      if(this.preguntas[i].indice != Indice )
      {
        preguntas.push(this.preguntas[i]);
      }
    }
    console.log(preguntas);
    this.preguntas = [];
    this.preguntas = preguntas;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModificarEncuestaPage');
  }
  presentActionSheet() {
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

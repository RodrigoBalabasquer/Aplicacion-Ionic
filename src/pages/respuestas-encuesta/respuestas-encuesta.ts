import { Component } from '@angular/core';
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { MenuPage} from '../menu/menu';
import { ListaAsistenciaPage } from '../lista-asistencia/lista-asistencia';
import { InformacionPage } from '../informacion/informacion';
import { EstadisticaEncuestaPage} from '../estadistica-encuesta/estadistica-encuesta';
import { ActionSheetController,IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';
import { AulasPage } from "../aulas/aulas";

@IonicPage()
@Component({
  selector: 'page-respuestas-encuesta',
  templateUrl: 'respuestas-encuesta.html',
})
export class RespuestasEncuestaPage {

  usuarioActual : any;
  nombreComActual : any;
  perfilActual : any;
  emailActual : any;
  sexoActual : any;
  nombre : any;

  public materia: string = "";
  public Encuestas: AngularFireList<any>;
  public encuestas: Observable<any>;
  public Profesores: AngularFireList<any>;
  public profesores: Observable<any>;
  public Materias: Array<string>= [];
  public Cuestionarios: Array<any> = [];
  public cuestionarios: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl : ActionSheetController,afDB: AngularFireDatabase) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.nombre = this.usuarioActual.nombre;
    this.nombreComActual = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    this.perfilActual = this.usuarioActual.perfil;
    this.emailActual = this.usuarioActual.email;
    this.sexoActual = this.usuarioActual.sexo;

    this.Encuestas = afDB.list('Encuestas');
    this.encuestas = this.Encuestas.valueChanges();
    this.Profesores = afDB.list('usuarios');
    this.profesores = this.Profesores.valueChanges();

    this.encuestas.subscribe(
        quest => {for(let i=0;i<quest.length;i++)
          { 
             this.Cuestionarios.push(quest[i]);
          }}
      );
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
          }this.materia = this.Materias[0];}
      );
  }
  traerEncuestas()
  { 
    this.cuestionarios = [];
    for(let i = 0;i<this.Cuestionarios.length;i++)
    { 
      if(this.Cuestionarios[i].Materia == this.materia && this.Cuestionarios[i].Profesor == this.nombreComActual)
      {
        //var finEncuesta = this.Cuestionarios[i].TiempoFin;
        //if(finEncuesta > Date.now())
          this.cuestionarios.push(this.Cuestionarios[i]);
      }
    }
  }
  VerRespuesta(dato)
  {
    var Cuestionario:any = {};
    for(let i = 0;i<this.Cuestionarios.length;i++)
    { 
      if(this.Cuestionarios[i].Codigo == dato)
      {
        Cuestionario = this.Cuestionarios[i];
        break;
      }
    }
    if(Cuestionario.Preguntas.length == 1)
    {
      this.navCtrl.push(EstadisticaEncuestaPage,{"codigo":Cuestionario.Codigo,"tabla":false});
    }
    else
    {
      this.navCtrl.push(EstadisticaEncuestaPage,{"codigo":Cuestionario.Codigo,"tabla":true});
    }
    console.log(Cuestionario);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RespuestasEncuestaPage');
  }
  presentActionSheet() {
    switch (this.perfilActual) 
    {
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
          text: 'Crear encuestas',
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
        default:
          break;
      }
  }
}

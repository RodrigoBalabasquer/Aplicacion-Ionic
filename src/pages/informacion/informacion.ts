import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams } from 'ionic-angular';

import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaAsistenciaPage } from '../lista-asistencia/lista-asistencia';
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { AulasPage } from "../aulas/aulas";
import { MenuPage} from '../menu/menu';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-informacion',
  templateUrl: 'informacion.html',
})
export class InformacionPage {

  usuarioActual : any;
  perfilActual : any;
  Aulas: AngularFireList<any>;
  aulas: Observable<any>;
  Aula: any={};
  alumnosMetod : any[] = [];
  alumnosLabIV : any[] = [];
  alumnosLegis : any[] = [];

  codigo = this.navParams.get("codigo");
  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl : ActionSheetController, afDB: AngularFireDatabase) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;

    
    afDB.list('asistencias/metodologia/alumnos').valueChanges().subscribe(alumnos => { this.alumnosMetod = alumnos });
    afDB.list('asistencias/legislacion/alumnos').valueChanges().subscribe(alumnos => { this.alumnosLegis = alumnos });
    afDB.list('asistencias/laboratorioiv/alumnos').valueChanges().subscribe(alumnos => { this.alumnosLabIV = alumnos });
    this.Aulas = afDB.list('asistencias');
    this.aulas = this.Aulas.valueChanges();
    this.aulas.subscribe(
        aula =>{
          switch (this.codigo) {
            case "Aula 303":
              
              
              for(let i=0;i<aula.length;i++)
              { 
                if(aula[i].aula == 303)
                { 
                  this.Aula.Numero = aula[i].aula;
                  this.Aula.Materia = "Metodología";
                  this.Aula.Profesor = aula[i].profesor;
                  this.Aula.Alumnos = this.alumnosMetod;
                  console.log(this.alumnosMetod);
                  //this.Aula.Alumnos = aula[i].Alumnos;
                  this.EstadisticaAlumnos();
                }
              }
              
              break;
            case "Aula 304":
              for(let i=0;i<aula.length;i++)
              { 
                if(aula[i].aula == 304)
                { 
                  this.Aula.Numero = aula[i].aula;
                  this.Aula.Materia = "Legislación";
                  this.Aula.Profesor = aula[i].profesor;
                  this.Aula.Alumnos = this.alumnosLegis;
                  console.log(this.alumnosMetod);
                  //this.Aula.Alumnos = aula[i].Alumnos;
                  this.EstadisticaAlumnos();
                }
              }
              break;
            case "Aula 305":
              for(let i=0;i<aula.length;i++)
              { 
                if(aula[i].aula == 305)
                { 
                  this.Aula.Numero = aula[i].aula;
                  this.Aula.Materia = "Laboratorio IV";
                  this.Aula.Profesor = aula[i].profesor;
                  this.Aula.Alumnos = this.alumnosLabIV;
                  console.log(this.alumnosLabIV);
                  //this.Aula.Alumnos = aula[i].Alumnos;
                  this.EstadisticaAlumnos();
                }
              }
              break;
            default:
              break;
          }
          
        }
      );

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InformacionPage');
  }

  EstadisticaAlumnos()
  { 

    console.log("Llegó");
    var alumnosActuales;

    switch (this.codigo) {
      case "Aula 303":
        alumnosActuales = this.alumnosMetod;
        break;
      case "Aula 304":
        alumnosActuales = this.alumnosLegis;
        break;
      case "Aula 305":
        alumnosActuales = this.alumnosLabIV;
        break;
      default:
        break;
    }


    var Alumnos : Array<string> = [];
    var faltas : Array<number>= [];

    for(var i=0 ; i < alumnosActuales.length;i++)
    {
      Alumnos.push(alumnosActuales[i].nombre+" "+alumnosActuales[i].apellido);
      faltas.push(alumnosActuales[i].cantFaltas);
    }
    
    console.log(Alumnos);
    console.log(faltas);
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Alumnos,
            datasets: [{
                label: "Cantidad de faltas",
                data: faltas,
                backgroundColor: [
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(230, 0, 0, 0.4)',
                    'rgba(0, 255, 0, 0.4)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)',
                    'rgba(230, 44, 44, 1)',
                    'rgba(0, 107, 0, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                //borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
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
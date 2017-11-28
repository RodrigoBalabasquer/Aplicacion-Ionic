import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams } from 'ionic-angular';

import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaAsistenciaPage } from '../lista-asistencia/lista-asistencia';
import { RespuestasEncuestaPage} from '../respuestas-encuesta/respuestas-encuesta';
import { MenuPage} from '../menu/menu';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-estadistica-encuesta',
  templateUrl: 'estadistica-encuesta.html',
})
export class EstadisticaEncuestaPage {

  usuarioActual : any;
  perfilActual : any;
  Respuestas: AngularFireList<any>;
  respuesta: Observable<any>;
  public Items: AngularFireList<any>;
  public items: Observable<any>;

  ListaRespuestas: Array<any>=[];
  codigo = this.navParams.get("codigo");
  estado = false;
  check = false;
  Encuesta:string = "";
  pregunta:string = "";
  tabla = this.navParams.get("tabla");

  tipo = "";
  pieChartLabels:Array<string> = [];
  pieChartData:Array<number> = [];
  pieChartType:string = 'pie';
  pieChartColor:Array<any> = [];

  preguntas: Array<string> = [];
  respuestas: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,public actionSheetCtrl : ActionSheetController, afDB: AngularFireDatabase) {
    var encuesta = this.codigo.split("-");
    this.Encuesta = encuesta[0];
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;
    this.Respuestas = afDB.list('Respuestas');
    this.respuesta = this.Respuestas.valueChanges();
                  
    this.Items = afDB.list('Encuestas');
    this.items = this.Items.valueChanges();
    if(!this.tabla){
      this.items.subscribe(
          quest => {for(let i=0;i<quest.length;i++)
            {
              if(quest[i].Codigo == this.codigo)
              { 
                this.tipo = quest[i].Preguntas[0].tipo;
                this.pregunta = quest[i].Preguntas[0].question;
                if(quest[i].Preguntas[0].tipo == 'P')
                {
                  this.respuesta.subscribe(
                    rest => {
                      for(let x=0;x<rest.length;x++)
                      {
                        if(rest[x].cuestionario == this.codigo)
                        {
                          this.ListaRespuestas.push(rest[x].respuestas[0].respuesta);
                        }
                      }
                    }
                  );
                }
                else
                {
                  this.pregunta = quest[i].Preguntas[0].question;
                  if(quest[i].Preguntas[0].tipo == 'U'){
                    for(let y=0; y < quest[i].Preguntas[0].opciones.length;y++)
                    {
                      this.ListaRespuestas.push({"respuesta":quest[i].Preguntas[0].opciones[y],"cantidad":0});
                      this.pieChartLabels.push(quest[i].Preguntas[0].opciones[y]);
                    }
                  }
                  if(quest[i].Preguntas[0].tipo == 'M')
                  {
                    this.ListaRespuestas.push({"respuesta":"SÍ","cantidad":0});
                    this.ListaRespuestas.push({"respuesta":"NO","cantidad":0});
                    this.pieChartLabels.push("SÍ");
                    this.pieChartLabels.push("NO");
                    this.check = true;
                  }
                  this.Respuestas = afDB.list('Respuestas');
                  this.respuesta = this.Respuestas.valueChanges();
                  this.ObtenerCantidades();
                }
                break;
              }
            }}
        );
      }
      else
      {
         this.items.subscribe(
           quest => {for(let i=0;i<quest.length;i++)
          {
            if(quest[i].Codigo == this.codigo)
            {
              for(let y=0;y<quest[i].Preguntas.length;y++)
              {
                this.preguntas.push(quest[i].Preguntas[y].question);
              }
              break;
            }
          }
         });
         this.respuesta.subscribe(
          rest => {for(let z=0;z<rest.length;z++)
          {
            if(rest[z].cuestionario == this.codigo)
            { 
                let respuesta: Array<string> = [];
                for(let x = 0;x< rest[z].respuestas.length;x++)
                { 
                  console.log(rest[z].respuestas[x].respuesta);
                  if(rest[z].respuestas[x].respuesta == true)
                  {
                    respuesta.push("Sí");
                  }
                  else
                  {
                   if(rest[z].respuestas[x].respuesta == "")
                   {
                    respuesta.push("No");
                   }
                   else
                   {
                     respuesta.push(rest[z].respuestas[x].respuesta);
                   }
                  }
                  
                }
                this.respuestas.push(respuesta);
            }
          }
          });
      }

    
  }
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
    console.log(e);
  }
  ObtenerCantidades()
  { 
    this.respuesta.subscribe(
        rest => {for(let i=0;i<rest.length;i++)
          { 
            if(rest[i].cuestionario == this.codigo)
            { 
              if(!this.check){
                for(let y=0;y<this.ListaRespuestas.length;y++)
                {
                  if(this.ListaRespuestas[y].respuesta == rest[i].respuestas[0].respuesta)
                    { 
                      this.ListaRespuestas[y].cantidad++; 
                    }
                }
              }
              else
              {
                if(rest[i].respuestas[0].respuesta == true)
                {
                  this.ListaRespuestas[0].cantidad++;
                }
                else
                {
                  this.ListaRespuestas[1].cantidad++;
                }
              }
            }
          }
          for(let z=0;z<this.ListaRespuestas.length;z++)
          {
            this.pieChartData.push(this.ListaRespuestas[z].cantidad);
          }
          this.mostrar();
        }
      );
  }
  mostrar()
  {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: this.pieChartType,
        //type: "pie",
        data: {
            labels: this.pieChartLabels,
            //labels: ["A","B","C","D","E"],
            datasets: [{
                label: this.pieChartLabels,
                //data:[4,5,6,7,8],
                data: this.pieChartData,
                backgroundColor: [
                    'rgba(0, 0, 0, 0.3)',
                    'rgba(230, 0, 0, 0.4)',
                    'rgba(0, 255, 0, 0.4)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 0, 1)',
                    'rgba(230, 44, 44, 1)',
                    'rgba(0, 107, 0, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
        /*options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }*/
    });
    this.estado = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EstadisticaEncuestaPage');
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
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaAsistenciaPage } from '../lista-asistencia/lista-asistencia';
import { InformacionPage } from '../informacion/informacion';
import { EstadisticaEncuestaPage} from '../estadistica-encuesta/estadistica-encuesta';
import { LoginPage } from '../login/login';
import { Component } from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    IonicPage,
    LoadingController,
    NavController,
    NavParams,
    Platform
} from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import firebase from "firebase";
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList} from 'angularfire2/database';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import { NativeAudio } from '@ionic-native/native-audio';
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { AulasPage } from "../aulas/aulas";

import { ParsedResponseHeaders } from 'ng2-file-upload/file-upload/file-uploader.class';
import { FileItem } from 'ng2-file-upload/file-upload/file-item.class';
import { FileUploader } from 'ng2-file-upload';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  usuarioActual : any;
  nombreComActual : any;
  perfilActual : any;
  emailActual : any;
  sexoActual : any;
  nombre : any;

  public QR: AngularFireList<any>;
  public qr: Observable<any>;
  public ListaQr: Array<any> = [];

  public Items: AngularFireList<any>;
  public items: Observable<any>;
  /*Aulas: AngularFireList<any>;
  aulas: Observable<any>;
  Aula: any={};
  public arrayAlumnos:Array<number> = [4,5,6];*/
  uploader:FileUploader = new FileUploader({url: "http://julianmartire.pe.hu/ApiArchivo/archivo/"});
  materiaArchivo : string="";
  nombreDelArchivo : any;

  constructor(private platform : Platform, private nativeAudio: NativeAudio, public alertCtrl : AlertController, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl : ActionSheetController,private barcodeScanner: BarcodeScanner,afDB: AngularFireDatabase) {
    this.nativeAudio.preloadSimple('sonidoCierre', 'assets/sounds/sonidoCierre.mp3');
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.nombre = this.usuarioActual.nombre;
    this.nombreComActual = this.usuarioActual.nombre + " " + this.usuarioActual.apellido;
    this.perfilActual = this.usuarioActual.perfil;
    this.emailActual = this.usuarioActual.email;
    this.sexoActual = this.usuarioActual.sexo;

    this.Items = afDB.list('Encuestas');
    this.items = this.Items.valueChanges();

    this.QR = afDB.list('QR');
    this.qr = this.QR.valueChanges();
    this.qr.subscribe(
        codigo => {for(let i=0;i<codigo.length;i++)
          {
            this.ListaQr.push(codigo[i]);
          }
          }
      );


      
    /*this.Aulas = afDB.list('Aulas');
    this.aulas = this.Aulas.valueChanges();
    this.aulas.subscribe(
        aula => {for(let i=0;i<aula.length;i++)
          { 
            if(aula[i].Numero == 'Aula 303')
            { 
              this.Aula.Numero = aula[i].Numero;
              this.Aula.Materia = aula[i].Materia;
              this.Aula.Profesor = aula[i].Profesor;
              this.Aula.Alumnos = [];
              for(let y=0;y<aula[i].Alumnos.length;y++)
              {
                this.Aula.Alumnos.push(aula[i].Alumnos[y]);
              }
              //this.arrayAlumnos = this.Aula.Alumnos;
              console.log(this.arrayAlumnos);
              break;
            }
          }}
      );*/
  }

  mandarAlServidor()
  {
    this.uploader.queue[0].upload();
    this.nombreDelArchivo=this.uploader.queue[0]._file.name;
    console.log(this.nombreDelArchivo);

    /*for (let i = 0; i < this.nombreDelArchivo.length; i++) {
      if(this.nombreDelArchivo[i]==" " || this.nombreDelArchivo[i]=="-")
      {
        return;
      }
      else
      {
        this.materiaArchivo+=this.nombreDelArchivo[i];
      }
    }*/
  }

  logOut()
  {
    
    firebase.auth().signOut().then(()=> {this.nativeAudio.play('sonidoCierre'); this.navCtrl.push(LoginPage); localStorage.removeItem("usuario"); });
  }
  EscanearCodigo()
  { 
    var encontrado = false;
    this.barcodeScanner.scan().then(barcodeData =>
    {
      for(let i=0;i<this.ListaQr.length;i++)
      {
        if(this.ListaQr[i].codigo == barcodeData.text)
        {
          if(this.ListaQr[i].tipo == "Informacion")
          {
            this.navCtrl.setRoot(InformacionPage,{"codigo":this.ListaQr[i].codigo});
          }
          if(this.ListaQr[i].tipo == "Encuesta-R-U" || this.ListaQr[i].tipo == "Encuesta-C-U")
          {
            var Profesor = this.ListaQr[i].codigo.split('-');
            if(Profesor[1] == this.nombreComActual)
              this.navCtrl.setRoot(EstadisticaEncuestaPage,{"codigo":this.ListaQr[i].codigo});
            else
            {
              this.items.subscribe(
              quest => {for(let y=0;y<quest.length;y++)
                { 
                  //this.Cuestionarios.push(quest[i]);
                  if(quest[y].Codigo == barcodeData.text)
                  {
                    if(quest[y].TiempoFin <= Date.now())
                    {
                      this.navCtrl.setRoot(EstadisticaEncuestaPage,{"codigo":this.ListaQr[i].codigo});
                    }
                    else
                    {
                      let alert1 = this.alertCtrl.create({
                        title: 'ERROR',
                        subTitle: 'Resultados no disponibles hasta finalización de la encuesta',
                        buttons: ['OK'],
                        cssClass: 'alertQR',
                        });
                        alert1.present();
                    }
                    break;
                  }
                }}
               );
            }
          }
          encontrado = true;
          break;
        }
      }
      if(!encontrado)
      {
        let alert1 = this.alertCtrl.create({
        title: 'ERROR',
        subTitle: 'Código desconocido',
        buttons: ['OK'],
        cssClass: 'alertQR',
        });
        alert1.present();
      }
    })
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

  tomarAsistencia()
  {
    this.navCtrl.push(ListaAsistenciaPage);
  }

  ionViewDidLoad() {
    
  }

}
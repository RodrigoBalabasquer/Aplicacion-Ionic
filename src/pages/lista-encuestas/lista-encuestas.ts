import { Component } from '@angular/core';
import { ActionSheetController,IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { EncuestaPage} from '../encuesta/encuesta';
import { ListaAsistenciaPage} from '../lista-asistencia/lista-asistencia';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { RegistroProAdmPage } from "../registro-pro-adm/registro-pro-adm";
import { MenuPage } from "../menu/menu";
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { AulasPage } from "../aulas/aulas";
/**
 * Generated class for the ListaEncuestasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-encuestas',
  templateUrl: 'lista-encuestas.html',
})
export class ListaEncuestasPage {

  usuarioActual : any;
  perfilActual : any;
  error = false;
  //public encuesta : Array<any> = this.navParams.get("encuesta");
  public Items: AngularFireList<any>;
  public items: Observable<any>;
  public Results: AngularFireList<any>;
  public results: Observable<any>;
  public ListaResultados: Array<any> = [];

  public Usuarios: AngularFireList<any>;
  public usuarios: Observable<any>;
  public Profesores: Array<string> = [];
  public Materias: Array<string> = [];
  public materia: string="";
  public profesor: string="";


  public Cuestionarios: Array<any> = [];
  public cuestionarios: Array<any> = [];

  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public navParams: NavParams, afDB: AngularFireDatabase, public actionSheetCtrl : ActionSheetController
  ,public alertCtrl: AlertController) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;
    this.Items = afDB.list('Encuestas');
    this.items = this.Items.valueChanges();

    this.Results = afDB.list('Respuestas');
    this.results = this.Results.valueChanges();
    this.results.subscribe(
      rest => {for(let i=0;i<rest.length;i++)
      {this.ListaResultados.push(rest[i])}});

    this.items.subscribe(
        quest => {for(let i=0;i<quest.length;i++)
          { 
             this.Cuestionarios.push(quest[i]);
          }}
      );

    this.Usuarios = afDB.list('usuarios');
    this.usuarios = this.Usuarios.valueChanges();
    this.usuarios.subscribe(
        profesor => {for(let i=0;i<profesor.length;i++)
          {
            if(profesor[i].perfil == "Profesor")
            {
              this.Profesores.push(profesor[i].nombre+" "+profesor[i].apellido);
            }
          }}
      );
    this.usuarios.subscribe(
        usuario => {for(let i=0;i<usuario.length;i++)
          {
            if(usuario[i].email == this.usuarioActual.email)
            {
              for(let y=0;y<usuario[i].materias.length;y++)
              {
                this.Materias.push(usuario[i].materias[y]);
              }
              break;
            }
          }}
      );
      
  }
  traerEncuestas()
  { 
    this.cuestionarios = [];
    for(let i = 0;i<this.Cuestionarios.length;i++)
    { 
      if(this.Cuestionarios[i].Materia == this.materia && this.Cuestionarios[i].Profesor == this.profesor)
      {
        var finEncuesta = this.Cuestionarios[i].TiempoFin;
        if(finEncuesta > Date.now())
          this.cuestionarios.push(this.Cuestionarios[i]);
      }
    }

    if(this.cuestionarios.length == 0)
    {
      let toast = this.toastCtrl.create({
        message: 'No se encontraron encuestas',
        duration: 1500,
        position: 'bottom'
      });

      toast.present();
    }
  }
  RealizarCuestionario(dato)
  {
    console.log(dato);
    for(let i=0;i<this.ListaResultados.length;i++)
    {
      if(this.ListaResultados[i].Alumno == this.usuarioActual.nombre+" "+ this.usuarioActual.apellido && this.ListaResultados[i].cuestionario == dato && this.error == false)
      {
          let alert1 = this.alertCtrl.create({
          title: 'Fallo de ingreso',
          subTitle: 'Ya realizó este cuestionario',
          buttons: ['OK'],
          cssClass: 'alertHizoCuestionario',
          });
          alert1.present();
          console.log(dato);
          console.log(this.ListaResultados[i].cuestionario);
          this.error = true;
          break;
      }
    }
    if(!this.error)
    {
    this.error = true;
    this.navCtrl.setRoot(EncuestaPage,{"encuesta":dato});}
    else
    {
      this.error = false;
    }  
    /*this.results.subscribe(
      rest =>{for(let i=0;i<rest.length;i++){
        //console.log(rest[i].cuestionario);
        //console.log(this.codigo);
        if(rest[i].Alumno == this.usuarioActual.nombre+" "+ this.usuarioActual.apellido && rest[i].cuestionario == dato && this.error == false)
        {
          //alert("Ya realizo este cuetionario");
          let alert1 = this.alertCtrl.create({
          title: 'Fallo de ingreso',
          subTitle: 'Ya realizó este cuestionario',
          buttons: ['OK'],
          cssClass: 'alertHizoCuestionario',
          });
          alert1.present();
          console.log(dato);
          console.log(rest[i].cuestionario);
          this.error = true;
          //this.navCtrl.setRoot(ListaEncuestasPage);
          break;
        }
      } 
      if(!this.error)
      {
      this.error = true;
      this.navCtrl.setRoot(EncuestaPage,{"encuesta":dato});}
      else
      {
        this.error = false;
      }  
    });*/
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaEncuestasPage');
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

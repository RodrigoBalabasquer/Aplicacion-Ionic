import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { ListaAsistenciaPage } from "../lista-asistencia/lista-asistencia";
import { MenuPage } from "../menu/menu";
import { Observable } from 'rxjs/Rx';
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import firebase from "firebase";
/**
 * Generated class for the RegistroProAdmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-pro-adm',
  templateUrl: 'registro-pro-adm.html',
})
export class RegistroProAdmPage {

  usuarioActual : any;
  perfilActual : any;

  id : any;
  email : any;
  password : any;
  confPassword : any;
  perfil : any;
  nombre : any;
  apellido : any;
  sexo : any;
  usuarios : AngularFireList<any>;
  noRegistro : boolean = false;
  siRegistro : boolean = true;

  personalList : AngularFireList<any>;
  personalObs : Observable<any[]>
  personal : any[];

  constructor(public actionSheetCtrl : ActionSheetController, public toastCtrl : ToastController, public navCtrl: NavController, public afDB : AngularFireDatabase, public params : NavParams, public alertCtrl : AlertController) {
    this.usuarios = afDB.list('usuarios');

    this.personalList = this.afDB.list('usuarios');
    this.personalObs = this.personalList.valueChanges();
    this.personalObs.subscribe(
        user => this.personal = user,
      );
    
      this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
      this.perfilActual = this.usuarioActual.perfil;
  }
   
  eliminarPersonal(item)
  {
    item.habilitado = false;
    this.usuarios.update(item.id.toString(),item);
  }

  habilitarPersonal(item)
  {
    item.habilitado = true;
    this.usuarios.update(item.id.toString(),item);
  }

  registrarPersonal()
  {
    this.noRegistro = true;
    this.siRegistro = false;
  }

  cancelar()
  {
    this.noRegistro = false;
    this.siRegistro = true;
  }

  completarRegistro()
  {
    if (this.perfil == null || this.nombre == null || this.apellido == null || this.sexo == null || this.email == null || this.password == null || this.confPassword == null)
    {
      let alertCmp = this.alertCtrl.create({
        title: 'ERROR!',
        subTitle: 'Complete todos los campos',
        buttons: ['OK']
        });
        alertCmp.present();        
    } 
    else 
    {
      if (this.password == this.confPassword) 
      {
        firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(suc=>{
          var usuario : any = {};
          usuario.email = this.email;
          usuario.nombre = this.nombre;
          usuario.apellido = this.apellido;
          usuario.sexo = this.sexo;
          usuario.perfil = this.perfil;
          usuario.token = suc.uid;
          usuario.habilitado = true;
          this.id = (this.personal.length+1).toString();
          usuario.id = this.id;
          this.usuarios.set(this.id,usuario);
          
          let toast = this.toastCtrl.create({
              message: 'Personal creado satisfactoriamente.',
              duration: 2500,
              position: 'bottom'
            });
          
          toast.onDidDismiss(() => {
              console.log('Dismissed toast');
          });
          
          toast.present();
          
          this.cancelar();
        }).catch(error=>{
          console.log(error);
          switch(error.message)
          {
            case "The email address is badly formatted.":
            let alert = this.alertCtrl.create({
              title: 'ERROR!',
              subTitle: 'El correo ingresado es incorrecto',
              buttons: ['OK']
              });
              alert.present();        
              break;
            case "Password should be at least 6 characters":
            let alertPwd = this.alertCtrl.create({
              title: 'ERROR!',
              subTitle: 'La contraseña debe tener al menos 6 caracteres.',
              buttons: ['OK']
              });
              alertPwd.present();        
              break;
            case "The email address is already in use by another account.":
            let alertEma = this.alertCtrl.create({
              title: 'ERROR!',
              subTitle: 'El correo ingresado ya está en uso.',
              buttons: ['OK']
              });
              alertEma.present();        
              break;
          }
        });  
      } 
      else 
      {
        alert("Las contraseñas no coinciden");
      }
    }
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
          text: 'Crear encuestas',
          icon: 'paper',
          handler: () => {
            this.navCtrl.setRoot(GestorEncuestasPage);
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

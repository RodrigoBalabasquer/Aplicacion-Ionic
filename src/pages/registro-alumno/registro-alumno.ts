import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroProAdmPage } from '../registro-pro-adm/registro-pro-adm';
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
 * Generated class for the RegistroAlumnoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import { ParsedResponseHeaders } from 'ng2-file-upload/file-upload/file-uploader.class';
import { FileItem } from 'ng2-file-upload/file-upload/file-item.class';
import { FileUploader } from 'ng2-file-upload';

@IonicPage()
@Component({
  selector: 'page-registro-alumno',
  templateUrl: 'registro-alumno.html',
})
export class RegistroAlumnoPage {

  id : any;
  usuarioActual : any;
  perfilActual : any;
  email : any;
  password : any;
  confPassword : any;
  perfil : any = "Alumno";
  nombre : any;
  apellido : any;
  legajo : any;
  sexo : any;
  usuarios : AngularFireList<any>;
  noRegistro : boolean = false;
  siRegistro : boolean = true;
  materias : any[];
  nombreDelArchivo : any;
  alumnosList : AngularFireList<any>;
  alumnosObs : Observable<any[]>
  alumnos : any[];
  sicsv : boolean = true;
  metodologia : AngularFireList<any>;
  legis : AngularFireList<any>;
  labiv : AngularFireList<any>;
  uploader:FileUploader = new FileUploader({url: "http://julianmartire.pe.hu/ApiArchivo/archivo/"});
  materiaArchivo : string="";
  otroarrayusuarios : Array<any>= new Array<any>();

  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public afDB : AngularFireDatabase, public params : NavParams, public alertCtrl : AlertController, public actionSheetCtrl : ActionSheetController) {
    this.metodologia = afDB.list('asistencias/metodologia/alumnos')
    this.legis = afDB.list('asistencias/legislacion/alumnos')
    this.labiv = afDB.list('asistencias/laboratorioiv/alumnos')

    this.usuarios = afDB.list('usuarios');

    this.alumnosList = this.afDB.list('usuarios');
    this.alumnosObs = this.alumnosList.valueChanges();
    this.alumnosObs.subscribe(
        user => this.alumnos = user,
      );

    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;

    this.uploader.onSuccessItem =  (item : FileItem, response : string, status : number,header : ParsedResponseHeaders)=>
    {
      let array=JSON.parse(response);
      let lista=this.afDB.list("usuarios");
      
      
      //lista.push(array);
      for (let i = 0; i < 2; i++) {
        let nomape;
        var usuario : any = {};
        nomape = this.separarComas(array[i][1]);
        usuario.legajo = array[i][0];
        
        usuario.apellido = nomape.apellido;
        usuario.nombre = nomape.nombre;
        usuario.email = array[i][0] + "@utn.com";
        usuario.habilitado = true;
        usuario.id = (this.alumnos.length+i+1).toString();
        usuario.materias = [{ 0 : "Laboratorio IV"}];
        usuario.perfil = "Alumno";
        usuario.sexo = "Otro";

        firebase.auth().createUserWithEmailAndPassword(usuario.email,"utn"+array[i][0])
        .then( res=> {
          {
            usuario.token=res.uid;
            //lista.set(i.toString()+"/",usuario);
           
          }
        })
        .catch( err => {
          console.error(err);
        });


        this.otroarrayusuarios.push(usuario);
      }
      console.log(this.otroarrayusuarios);
      for (let z = 0; z < this.otroarrayusuarios.length; z++) 
      {
        if(this.verificarSiExisteArchivo(this.otroarrayusuarios[z]))
        {
          lista.set(this.otroarrayusuarios[z].id.toString()+"/",this.otroarrayusuarios[z]);
          this.agregarMaterias(this.otroarrayusuarios[z]);
        }
      }
      //console.log(usuario);
      this.sicsv = true;
      this.noRegistro = false;
  
      let toast = this.toastCtrl.create({
        message: 'Listado correctamente cargado',
        duration: 2500,
        position: 'bottom'
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();

    }    
  }

  verificarSiExisteArchivo(alumno : any)
  {
    for (var x = 0; x < this.alumnos.length; x++) 
    {
      if(this.alumnos[x].legajo == alumno.legajo)
      {
        return false;
      }
    }

    return true;
  }

  agregarMaterias(usuario: any)
  {
      var alumnoLaboratorioIV : any = {};
      alumnoLaboratorioIV.legajo = usuario.legajo;
      alumnoLaboratorioIV.nombre = usuario.nombre;
      alumnoLaboratorioIV.apellido = usuario.apellido;
      alumnoLaboratorioIV.cantFaltas = 0;
      this.labiv.set(alumnoLaboratorioIV.legajo,alumnoLaboratorioIV);
  }

  separarComas(obj: any){
    let apellido: string="",nombre: string="",band=false,band2=false;
    for (let i = 0; i < obj.length; i++) {
      if(band2==true)
      {
        nombre+=obj[i];
      }

      if(band==true && obj[i]!=" " && band2==false)
      {
        nombre+=obj[i];
        band2=true;
      }

      if(obj[i]!="," && band==false)
      { 
         apellido+=obj[i];
      }
      else
      {
        band=true;        
      }
    }

    let nomape : any ={};
    nomape.apellido=apellido;
    nomape.nombre=nombre;

    return nomape;
  }

  mandarAlServidor()
  {
    this.uploader.queue[0].upload();
    this.nombreDelArchivo=this.uploader.queue[0]._file.name;
    console.log(this.nombreDelArchivo);

    for (let i = 0; i < this.nombreDelArchivo.length; i++) {
      if(this.nombreDelArchivo[i]==" " || this.nombreDelArchivo[i]=="-")
      {
        return;
      }
      else
      {
        this.materiaArchivo+=this.nombreDelArchivo[i];
      }
    }
  }
   
  eliminarAlumno(item)
  {
    item.habilitado = false;
    this.usuarios.update(item.id.toString(),item);
  }

  habilitarAlumno(item)
  {
    item.habilitado = true;
    this.usuarios.update(item.id.toString(),item);
  }

  registrarAlumno()
  {
    this.noRegistro = true;
    this.siRegistro = false;
  }

  regCsv()
  {
    this.noRegistro=true;
    this.sicsv=false;
  }

  cancelar()
  {
    this.noRegistro = false;
    this.siRegistro = true;
    this.sicsv = true;
  }

  completarRegistro()
  {

    
    if (this.materias == null || this.nombre == null || this.apellido == null || this.sexo == null || this.email == null || this.password == null || this.confPassword == null)
    {
      let alertCmp = this.alertCtrl.create({
        title: 'ERROR!',
        subTitle: 'Por favor, complete todos los campos',
        buttons: ['OK']
        });
        alertCmp.present();        
    } 
    else 
    {
      if (this.password == this.confPassword) 
      {

        var noExiste : boolean = true;

        for (var i = 0; i < this.alumnos.length; i++) 
        {
          if(this.alumnos[i].legajo == this.legajo)
          {
            noExiste = false;
          }          
        }

        if(noExiste)
        {
          firebase.auth().createUserWithEmailAndPassword(this.email,this.password).then(suc=>{
            
             var usuario : any = {};
             usuario.legajo = this.legajo;
             usuario.email = this.email;
             usuario.nombre = this.nombre;
             usuario.apellido = this.apellido;
             usuario.sexo = this.sexo;
             usuario.perfil = this.perfil;
             usuario.materias = this.materias;
             usuario.token = suc.uid;
             usuario.habilitado = true;
             this.id = (this.alumnos.length+1).toString();
             usuario.id = this.id;
             this.usuarios.set(this.id,usuario);
   
             for (var i = 0; i < this.materias.length; i++)
             {
               if(this.materias[i] == "Metodología de sistemas I")
               {
                 var alumnoMetodologia : any = {};
                 alumnoMetodologia.legajo = this.legajo;
                 alumnoMetodologia.nombre = this.nombre;
                 alumnoMetodologia.apellido = this.apellido;
                 alumnoMetodologia.cantFaltas = 0;
                 this.metodologia.set(alumnoMetodologia.legajo,alumnoMetodologia);
               }
               
               if(this.materias[i] == "Laboratorio IV")
               {
                 var alumnoLaboratorioIV : any = {};
                 alumnoLaboratorioIV.legajo = this.legajo;
                 alumnoLaboratorioIV.nombre = this.nombre;
                 alumnoLaboratorioIV.apellido = this.apellido;
                 alumnoLaboratorioIV.cantFaltas = 0;
                 this.labiv.set(alumnoLaboratorioIV.legajo,alumnoLaboratorioIV);
               }
   
               if(this.materias[i] == "Legislación")
               {
                 var alumnoLegislacion : any = {};
                 alumnoLegislacion.legajo = this.legajo;
                 alumnoLegislacion.nombre = this.nombre;
                 alumnoLegislacion.apellido = this.apellido;
                 alumnoLegislacion.cantFaltas = 0;
                 this.legis.set(alumnoLegislacion.legajo,alumnoLegislacion);
               }
             }
   
             let toast = this.toastCtrl.create({
               message: 'Alumno correctamente agregado',
               duration: 2500,
               position: 'bottom'
             });
           
             toast.onDidDismiss(() => {
               console.log('Dismissed toast');
             });
           
             toast.present();
             this.cancelar();
           }).catch(error=>{
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
                 subTitle: 'La contraseña debe tener al menos 6 caracteres',
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
          let toastLegajo = this.toastCtrl.create({
            message: 'El legajo ingresado ya se encuentra en uso',
            duration: 2500,
            position: 'bottom'
          });

          toastLegajo.present();
        }
      } 
      else 
      {

          let toast = this.toastCtrl.create({
            message: 'Las contraseñas no coinciden',
            duration: 2500,
            position: 'top'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present();
        
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

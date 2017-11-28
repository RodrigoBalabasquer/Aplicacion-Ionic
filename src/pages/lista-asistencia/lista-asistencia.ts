import { GestorEncuestasPage } from '../gestor-encuestas/gestor-encuestas';
import { ListaEncuestasPage } from '../lista-encuestas/lista-encuestas';
import { RegistroAlumnoPage } from '../registro-alumno/registro-alumno';
import { RegistroProAdmPage } from "../registro-pro-adm/registro-pro-adm";
import { MenuPage } from "../menu/menu";
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from "firebase";
import { Observable } from 'rxjs/Rx';
import { RespuestasEncuestaPage } from "../respuestas-encuesta/respuestas-encuesta";
import { AulasPage } from "../aulas/aulas";
/**
 * Generated class for the ListaAsistenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-asistencia',
  templateUrl: 'lista-asistencia.html',
})
export class ListaAsistenciaPage {

  usuarioActual : any;
  perfilActual : any;

  asistio : any[];
  fechaActual : any = new Date().toLocaleDateString();;
  materia : any;
  materiaFirebase : any;

  aula : any;
  profesor : any;
  opFiltrado : string;
  filtradoHecho : boolean = false;
  opcionSeleccionada : any;
  tablaBusqueda : boolean = true;
  tablaTomarAsistencia : boolean = true;
  arrayDeAlumnos : any[] = [];
  arrayDeAlumnosAux : any[] = [];

  alumnosMetodologia : any[] = [];
  alumnosLegislacion : any[] = [];
  alumnosLabIV : any[] = [];

  listaDelDiaMetod : any[] = [];
  listaDelDiaLegis : any[] = [];
  listaDelDiaLabIV : any[] = [];

  constructor(public toastCtrl : ToastController, public alertCtrl : AlertController, public afDB : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl : ActionSheetController) {
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.perfilActual = this.usuarioActual.perfil;

    this.afDB.list('asistencias/metodologia/alumnos').valueChanges().subscribe(alumno => this.alumnosMetodologia = alumno);
  
    this.afDB.list('asistencias/metodologia/listas/'+this.fechaActual[0]+this.fechaActual[1]+"-"+this.fechaActual[3]+this.fechaActual[4]+"-"+this.fechaActual[6]+this.fechaActual[7]+this.fechaActual[8]+this.fechaActual[9]).valueChanges().subscribe(asist => this.listaDelDiaMetod = asist);
  
    this.afDB.list('asistencias/legislacion/alumnos').valueChanges().subscribe(alumno => this.alumnosLegislacion = alumno);
    
    this.afDB.list('asistencias/legislacion/listas/'+this.fechaActual[0]+this.fechaActual[1]+"-"+this.fechaActual[3]+this.fechaActual[4]+"-"+this.fechaActual[6]+this.fechaActual[7]+this.fechaActual[8]+this.fechaActual[9]).valueChanges().subscribe(asist => this.listaDelDiaLegis = asist);

    this.afDB.list('asistencias/laboratorioiv/alumnos').valueChanges().subscribe(alumno => this.alumnosLabIV = alumno);
    
    this.afDB.list('asistencias/laboratorioiv/listas/'+this.fechaActual[0]+this.fechaActual[1]+"-"+this.fechaActual[3]+this.fechaActual[4]+"-"+this.fechaActual[6]+this.fechaActual[7]+this.fechaActual[8]+this.fechaActual[9]).valueChanges().subscribe(asist => this.listaDelDiaLabIV = asist);
  }


  menu() {
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

    
  filtrado(opcion : string)
  {
    this.opFiltrado = opcion;
  }

  buscarGeneral()
  {
    this.filtradoHecho = true;
    this.tablaBusqueda = false;

    switch (this.opcionSeleccionada) 
    {
      case "evelina":
      case "303":
      case "metodologia":
        this.materia = "Metodología de sistemas";
        this.aula = 303;
        this.materiaFirebase = "metodologia";
        this.profesor = "Benavidez, Evelina";

       
        this.arrayDeAlumnos = this.alumnosMetodologia;

        for (var i = 0; i < this.arrayDeAlumnos.length; i++) 
        {
            if(this.listaDelDiaMetod.length == 0)
            {
                var alumno : any = {};
                alumno.legajo = this.arrayDeAlumnos[i].legajo;
                alumno.nombre = this.arrayDeAlumnos[i].nombre
                alumno.apellido = this.arrayDeAlumnos[i].apellido;
                alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
                alumno.asistio = false;
                this.arrayDeAlumnosAux.push(alumno);
            }
            else
            {
              for (var i = 0; i < this.listaDelDiaMetod.length; i++) 
              {
                var alumno : any = {};
                alumno.legajo = this.listaDelDiaMetod[i].legajo;
                alumno.nombre = this.listaDelDiaMetod[i].nombre;
                alumno.apellido = this.listaDelDiaMetod[i].apellido;
                alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
                alumno.asistio = this.listaDelDiaMetod[i].asistio;
                this.arrayDeAlumnosAux.push(alumno);                
              }

              //this.arrayDeAlumnosAux = this.listaDelDiaMetod;
            }
        }
        break;
      case "analia":
      case "304":
      case "legislacion":
          this.materia = "Legislación";
          this.aula = 304;
          this.profesor = "Buratovich, Analia";
          this.materiaFirebase = "legislacion";  
         
          this.arrayDeAlumnos = this.alumnosLegislacion;
        
          for (var i = 0; i < this.arrayDeAlumnos.length; i++) 
          {
            if(this.listaDelDiaLegis.length == 0)
            {
                var alumno : any = {};
                alumno.legajo = this.arrayDeAlumnos[i].legajo;
                alumno.nombre = this.arrayDeAlumnos[i].nombre
                alumno.apellido = this.arrayDeAlumnos[i].apellido;
                alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
                alumno.asistio = false;
                this.arrayDeAlumnosAux.push(alumno);
            
            }
            else
            {
              for (var i = 0; i < this.listaDelDiaLegis.length; i++) 
              {
                  var alumno : any = {};
                  alumno.legajo = this.listaDelDiaLegis[i].legajo;
                  alumno.nombre = this.listaDelDiaLegis[i].nombre
                  alumno.apellido = this.listaDelDiaLegis[i].apellido;
                  alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
                  alumno.asistio = this.listaDelDiaLegis[i].asistio;
                  this.arrayDeAlumnosAux.push(alumno);
              }
            }
          } 

          break;
      case "octavio":
      case "305":
      case "labiv":
          this.materia = "Laboratorio IV";
          this.aula = 305;
          this.profesor = "Villegas, Octavio";
          this.materiaFirebase = "laboratorioiv";

          this.arrayDeAlumnos = this.alumnosLabIV;
          
          
          for (var i = 0; i < this.arrayDeAlumnos.length; i++) 
          {
            if(this.listaDelDiaLabIV.length == 0)
            {
              var alumno : any = {};
              alumno.legajo = this.arrayDeAlumnos[i].legajo;
              alumno.nombre = this.arrayDeAlumnos[i].nombre
              alumno.apellido = this.arrayDeAlumnos[i].apellido;
              alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
              alumno.asistio = false;
              this.arrayDeAlumnosAux.push(alumno);
          
            }
            else
            {
              for (var i = 0; i < this.listaDelDiaLabIV.length; i++) 
              {
                  var alumno : any = {};
                  alumno.legajo = this.listaDelDiaLabIV[i].legajo;
                  alumno.nombre = this.listaDelDiaLabIV[i].nombre
                  alumno.apellido = this.listaDelDiaLabIV[i].apellido;
                  alumno.cantFaltas = this.arrayDeAlumnos[i].cantFaltas;
                  alumno.asistio = this.listaDelDiaLabIV[i].asistio;
                  this.arrayDeAlumnosAux.push(alumno);
              }
            }
        }
          break;
      
      default:
        this.filtradoHecho = false;
        this.tablaBusqueda = true;

        let toast = this.toastCtrl.create({
          message: 'Ingrese una opción',
          duration: 2500,
          position: 'center'
        });

        toast.present();
        break;
    }
  }

  tomarAsistencia()
  {
    this.tablaTomarAsistencia = false;
    this.tablaBusqueda = true;   
   
  }

  guardarAsistencia()
  {
    var fecha = this.fechaActual[0]+this.fechaActual[1]+"-"+this.fechaActual[3]+this.fechaActual[4]+"-"+this.fechaActual[6]+this.fechaActual[7]+this.fechaActual[8]+this.fechaActual[9];
    
    var listasList = this.afDB.list('asistencias/'+this.materiaFirebase+'/listas/'+fecha);
    var listasObs = listasList.valueChanges();
        
    var arrayAGuardar : any[] = [];

    for (var i = 0; i < this.arrayDeAlumnosAux.length; i++) 
    {
      var alumnoAGuardar : any = {};
      alumnoAGuardar.legajo = this.arrayDeAlumnosAux[i].legajo;
      alumnoAGuardar.nombre = this.arrayDeAlumnosAux[i].nombre;
      alumnoAGuardar.apellido = this.arrayDeAlumnosAux[i].apellido;
      alumnoAGuardar.asistio = this.arrayDeAlumnosAux[i].asistio;
      arrayAGuardar.push(alumnoAGuardar);
    }

    arrayAGuardar.forEach(item => {
      listasList.set(item.legajo.toString(),item);
    });

    var alumnosActualizar = this.afDB.list('asistencias/'+this.materiaFirebase+'/alumnos');

    var alumnosActualizados : any[] = [];
    var contLista = 0;

    for (var i = 0; i < arrayAGuardar.length; i++) 
    {  
      var alumnoActualizado : any = {};
      alumnoActualizado.nombre = arrayAGuardar[i].nombre;
      alumnoActualizado.apellido = arrayAGuardar[i].apellido;
      alumnoActualizado.legajo = arrayAGuardar[i].legajo;
      alumnoActualizado.cantFaltas = this.arrayDeAlumnosAux[i].cantFaltas;

      if (this.materia == "Metodología de sistemas") 
      {
        if (arrayAGuardar[i].asistio == false && this.listaDelDiaMetod[contLista].asistio == true) 
        {
          alumnoActualizado.cantFaltas++;
        }
        else
        {
          if(this.listaDelDiaMetod[contLista].asistio == false && arrayAGuardar[i].asistio == true)
          {
            alumnoActualizado.cantFaltas--;
          }
        }
      }

      if (this.materia == "Laboratorio IV") 
      {
        if (arrayAGuardar[i].asistio == false && this.listaDelDiaLabIV[contLista].asistio == true) 
        {
          alumnoActualizado.cantFaltas++;
        }
        else
        {
          if(this.listaDelDiaLabIV[contLista].asistio == false && arrayAGuardar[i].asistio == true)
          {
            alumnoActualizado.cantFaltas--;
          }
        }
      }

      if (this.materia == "Legislación") 
      {
        if (arrayAGuardar[i].asistio == false && this.listaDelDiaLegis[contLista].asistio == true) 
        {
          alumnoActualizado.cantFaltas++;
        }
        else
        {
          if(this.listaDelDiaLegis[contLista].asistio == false && arrayAGuardar[i].asistio == true)
          {
            alumnoActualizado.cantFaltas--;
          }
        }
      }

      contLista++;
      alumnosActualizados.push(alumnoActualizado);
    }

    alumnosActualizados.forEach(item => {
      alumnosActualizar.set(item.legajo.toString(),item);
    });

    let toast = this.toastCtrl.create({
      message: 'Asitencia correctamente actualizada',
      duration: 2500,
      position: 'center'
    });

    toast.present();
    this.navCtrl.setRoot(ListaAsistenciaPage);
  }


  ionViewDidLoad() {
    
  }

}

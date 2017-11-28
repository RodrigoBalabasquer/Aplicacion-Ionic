import { MenuPage } from '../menu/menu';
import { HomePage } from '../home/home';
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
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import firebase from "firebase";
import { Observable } from 'rxjs/Rx';
import { NativeAudio } from '@ionic-native/native-audio';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email : string;
  password : string;

  public usuariosList : AngularFireList<any>;
  public usuariosObs : Observable<any>;
  public usuarios : Array<any>;

  constructor(private nativeAudio: NativeAudio, public Platform : Platform, public actionSheetCtrl : ActionSheetController, public afDB: AngularFireDatabase, public navCtrl: NavController,public navParams: NavParams, public googleplus : GooglePlus, public alertCtrl : AlertController, public loadingCtrl : LoadingController) {
    this.nativeAudio.preloadSimple('sonidoInicio', 'assets/sounds/sonidoInicio.mp3');
  }

  inicioSesionRapido()
  {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Usuarios',
      buttons: [
        {
          text: 'Administrador',
          role: 'administrador',
          handler: () => {
            this.email = "admin@admin.com";
            this.password = "administrador";
          }
        },{
          text: 'Administrativo',
          role: 'administrativo',
          handler: () => {
            this.email = "administrativo@administrativo.com";
            this.password = "administrativo";
          }
        },{
          text: 'Profesor',
          role: 'profesor',
          handler: () => {
            this.email = "esther.a@outlook.com";
            this.password = "esther";
          }
        },{
          text: 'Alumno',
          role: 'alumno',
          handler: () => {
            this.email = "rodrigobalabasquer@gmail.com";
            this.password = "rodrigo";
          }
        }
      ]
    });
    actionSheet.present();
  }

  loginComun()
  { 
      let loader = this.loadingCtrl.create({
            content: "Iniciando sesión...",
            duration: 2600
            });


      if(this.email == null || this.password == null)
      {
          let alert = this.alertCtrl.create({
          title: 'ADVERTENCIA!',
          subTitle: 'Debe completar todos los campos!',
          buttons: ['OK']
          });
          alert.present();
      }
      else
      {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(ok => {
          
          if (this.verificarSiTieneToken(ok.uid)) 
          {
            for (var i = 0; i < this.usuarios.length; i++) 
            {
              if (this.usuarios[i].token == ok.uid) 
              {
                var usuario = {token : this.usuarios[i].token, email : this.usuarios[i].email, sexo : this.usuarios[i].sexo, perfil : this.usuarios[i].perfil, nombre : this.usuarios[i].nombre, apellido : this.usuarios[i].apellido};
                var flag = 1;

                if(this.usuarios[i].habilitado == false)
                {
                  flag = 0;
                }

                break;
              }
              
            }
            
            if(flag == 1)
            {
              localStorage.setItem("usuario",JSON.stringify(usuario));
              this.navCtrl.setRoot(MenuPage);
              this.nativeAudio.play('sonidoInicio', () => console.log('uniqueId1 is done playing'));              
            }
            else
            {
              let alert = this.alertCtrl.create({
                title: 'ERROR!',
                subTitle: 'Usted no está habilitado para entrar al sistema',
                buttons: ['OK']
                });
                alert.present(); 
            }
          } 
          else 
          {
            let alert = this.alertCtrl.create({
              title: 'ERROR!',
              subTitle: 'Usted no está habilitado para entrar al sistema',
              buttons: ['OK']
              });
              alert.present();        
          }
         
          },
          error => {
          let alert = this.alertCtrl.create({
          title: 'ERROR!',
          subTitle: 'Usuario y/o contraseña incorrectas!',
          buttons: ['OK']
          });
          alert.present();        
          }
          );
      }
  }
    
  loginGoogle()
  {
    let loader = this.loadingCtrl.create({
      content: "Espere...",
      duration: 2600
      });

    this.googleplus.login({
      'webClientId':'297247795946-v0josakj1113a53jspfo34gdtmvsln6s.apps.googleusercontent.com',
      'offline':true
    }).then(res=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
      .then(suc=>{
        
        if (this.verificarSiTieneToken(suc.uid)) 
        {
          for (var i = 0; i < this.usuarios.length; i++) 
          {
            if (this.usuarios[i].token == suc.uid) 
            {
              var usuario = {token : this.usuarios[i].token, email : this.usuarios[i].email, sexo : this.usuarios[i].sexo, perfil : this.usuarios[i].perfil, nombre : this.usuarios[i].nombre, apellido : this.usuarios[i].apellido};
              break;
            }
            
          }
          
          localStorage.setItem("usuario",JSON.stringify(usuario));
          this.navCtrl.setRoot(MenuPage);
          this.nativeAudio.play('sonidoInicio', () => console.log('uniqueId1 is done playing'));
        } 
        else 
        {
          let alert = this.alertCtrl.create({
            title: 'ERROR!',
            subTitle: 'Usted no estrá habilitado para entrar al sistema',
            buttons: ['OK']
            });
            alert.present();        
        }

      })
      .catch(notSuc=>{
        let alertDos = this.alertCtrl.create({
          title: 'ERROR!',
          subTitle: 'Hubo un error al inciar sesión, por favor intente nuevamente',
          buttons: ['Aceptar']
        });
        alertDos.present();
      })
    })
  }

  ionViewDidLoad() {   
    this.usuariosList = this.afDB.list('/usuarios');
    this.usuariosObs = this.usuariosList.valueChanges();
    this.usuariosObs.subscribe(
        user => this.usuarios = user,
      );

    if(localStorage.getItem("usuario") != null)
    {
      this.navCtrl.setRoot(MenuPage);
    }
  }

  verificarSiTieneToken(token)
  {
    for (var i = 0; i < this.usuarios.length; i++) {
      if (this.usuarios[i].token == token)
      {
        return true;
      }
      
    }

    return false;
  }


}

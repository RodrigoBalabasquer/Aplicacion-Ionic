import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase,AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ListaEncuestasPage} from '../lista-encuestas/lista-encuestas';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the EncuestaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-encuesta',
  templateUrl: 'encuesta.html',
})
export class EncuestaPage {

  usuarioActual : any;
  

  public Items: AngularFireList<any>;
  public items: Observable<any>;
  public Results: AngularFireList<any>;
  public results: Observable<any>;
  public Cuestionario: any;
  public Cuestionarios: Array<any>;
  public codigo = this.navParams.get("encuesta");
  public display = false;
  public respuestas: Array<string>= [];
  public preguntas: Array<string>= [];
  constructor(public toastCtrl : ToastController, public navCtrl: NavController, public navParams: NavParams,afDB: AngularFireDatabase,public alertCtrl: AlertController) {
    
    this.usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    this.Items = afDB.list('Encuestas');
    this.Results = afDB.list('Respuestas');
    this.results = this.Results.valueChanges();
    
    this.items = this.Items.valueChanges();
    this.items.subscribe(
        quest => {for(let i=0;i<quest.length;i++)
          {
            //console.log(quest[i]);
            if(quest[i].Codigo == this.codigo)
            {
              this.Cuestionario = quest[i];
              console.log(this.Cuestionario);
              this.display = true;
              for(let y=0; y < quest[i].Preguntas.length;y++)
              {
                this.respuestas.push("");
                this.preguntas.push(quest[i].Preguntas[y].question);
              }
              console.log(this.respuestas);
              break;
            }
          }}
      );
  }
  enviar()
  { 
    //console.log(this.respuestas);
    //console.log(this.preguntas);

    var item: any = {};
    //var objeto: any = {};
    item.Alumno = this.usuarioActual.nombre+" "+ this.usuarioActual.apellido;
    item.cuestionario = this.codigo;
    var respuestas: Array<any> = [];
    for(let i=0;i<this.preguntas.length;i++)
    {
      //objeto.respuesta = this.respuestas[i];
      //objeto.pregunta = this.preguntas[i];
      //console.log(objeto);
      respuestas.push({respuesta:this.respuestas[i],pregunta:this.preguntas[i]});
    }
    item.respuestas = respuestas;
    console.log(respuestas);
    this.Results.push(item);
    this.navCtrl.setRoot(ListaEncuestasPage,{booleano:true});
    let toast = this.toastCtrl.create({
      message: 'Respuesta enviada',
      duration: 2500,
      position: 'center'
    });

    toast.present();
  }
  cancelar()
  {
    this.navCtrl.setRoot(ListaEncuestasPage,{booleano:true});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EncuestaPage');
  }

}
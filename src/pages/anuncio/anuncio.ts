import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-anuncio',
  templateUrl: 'anuncio.html',
})
export class AnuncioPage {

  anuncio : any = this.navParams.get("anuncio");
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.anuncio);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnuncioPage');
  }

}

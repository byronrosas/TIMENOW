import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalInstruccionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-instrucciones',
  templateUrl: 'modal-instrucciones.html',
})
export class ModalInstruccionesPage {

  constructor(private navParams: NavParams, private view:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalInstruccionesPage');
  }

  closeModal()
  {
    this.view.dismiss();
  }

}

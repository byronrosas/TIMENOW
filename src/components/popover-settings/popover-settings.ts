import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the PopoverSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-settings',
  templateUrl: 'popover-settings.html'
})
export class PopoverSettingsComponent {

  items:any;
  text: string;
  tipoActual:string;

  constructor(public viewCtrl:ViewController,private translateService: TranslateService) {
    this.tipoActual='general';
    console.log('Hello PopoverSettingsComponent Component');
    this.text = 'Hello World';
    this.items=[
      {
        id:1,
        item:'Mi Cuenta',
        tipo:'account',
        translate:'MI_CUENTA'       
      },
      {
        id:2,
        item:'Cambiar a Pro',
        tipo:'general',
        translate:'CAMBIAR_A_PRO'              
      },
      {
        id:3,
        item:'Idioma',
        tipo:'general',
        translate:'IDIOMA'       
      },
      {
        id:4,
        item:'Cerrar Sesión',
        tipo:'account',
        translate:'CERRAR_SESION'       
      }
    ];
  }

  itemClick(item)
  {       
    console.log(JSON.stringify(item)); 
    this.viewCtrl.dismiss(item);
  }





}

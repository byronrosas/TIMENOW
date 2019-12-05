import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
//MODELOS
import { Usuario } from './../../models/usuario';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  // account: { name: string, email: string, password: string } = {
  //   name: 'Test Human',
  //   email: 'test@example.com',
  //   password: 'test'
  // };

  public account:Usuario;
  public usuariosReg:any[] = [];
  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private menuCtrl:MenuController) {
    this.menuCtrl.enable(false,"SideMenu");
    this.account=new Usuario();
    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    });

    this.user.listUser()
    .then((t)=>{  
      this.usuariosReg=t;          
      console.log(JSON.stringify(t));
    })
    .catch((e)=>console.log("Hola registro error"));
            
  }

  doSignup() {
    // Attempt to login in through our User service
    this.account.estado="activo";
    this.user.signup(this.account)
    .then((resp) => {
      this.navCtrl.push(MainPage);
      
      this.user.listUser()
    .then((t)=>{    
      this.usuariosReg=t;        
      console.log(JSON.stringify(t));
    })
    .catch((e)=>console.log("Hola registro error"));
    }, (err:Error) => {
      if(err) throw err.message;
      this.navCtrl.push(MainPage);
      
      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }


  
}

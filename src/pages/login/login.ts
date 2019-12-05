
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, MenuController, AlertController,LoadingController} from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { correo: string, password: string } = {
    correo: 'juan@hot.com',
    password: '123'
  };

  // TEMPORAL
  public colorList:any=
  [
    {estado:"noinicia",value:"No inicia",noinicia:"#0000FF"},    
    {estado:"enprogreso",value:"En progreso",enprogreso:"#FFFF00"},
    {estado:"pendiente",value:"Pendiente",pendiente:"#DF0101"},
    {estado:"completada",value:"Completada",completada:"#088A08"},
    {estado:"cancelada",value:"Cancelada",cancelada:"#424242"}
  ];
  public indicadorEstado:any;
  // TEMPORAL
  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public menuCtrl: MenuController,
    public alertCtrl:AlertController,
    public loadingCtrl: LoadingController) {
    
      this.menuCtrl.enable(false, 'SideMenu');
      this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.account).then((resp) => {
      if (resp != null) {
        console.log("Login:");
        this.navCtrl.push(MainPage)
        .then(() => {
          const startIndex = this.navCtrl.getActive().index;
          this.navCtrl.remove(startIndex-1);
          this.navCtrl.remove(startIndex-2);
        });        
        
      }else{
        // this.navCtrl.push(MainPage);
        let toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }  
    })
    .catch((err) => {
      // this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'to p'
      });
      toast.present();
    });
  }

// TEMPORAL
selectEstado(item)
  {    
    this.indicadorEstado=[item.estado];
  }
// TEMPORAL

  errorAlert()
  {
    
  }

  confirAlert()
  {
    let contentTitle="proyect"
    let alttitleG="Guardar"
    let cadenaGuardado =`Tu `+contentTitle+` se ha guardado con exito.`;
    let cadenaError =`Lo sentimos ha ocurrido un error, intentalo más tarde.`;
    let alttitleA="Actualizar"
    let cadenaActualizado =`Tu `+contentTitle+` se ha actualizado con exito`;
    let alttitleE="Eliminar"
    let cadenaEliminado =`Tu `+contentTitle+` se ha eliminado con éxito`;
    this.showAlert(alttitleE,cadenaEliminado,true);

  }

  infoAlert()
  {
    this.presentLoadingCustom("Hola....");
  }

  //ALERTS
  showConfirm(title,msg,btn1,btn2,fc,fc2,enableBackdropDismiss) {
    const confirm = this.alertCtrl.create({
      title: title,
      message:msg,      
      enableBackdropDismiss:enableBackdropDismiss,
      buttons: [
        {
          text: btn1,
          handler: fc
        },
        {
          text: btn2,
          handler: fc2
        }
      ]
    });
    confirm.present();
  }

  showAlert(title,msn,enableBackdropDismiss) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle:msn,      
      enableBackdropDismiss:enableBackdropDismiss,
      buttons: ['OK']
    });
    alert.present();
  } 
  
  presentLoadingCustom(msn) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="text">`+msn+`</div>
          <div class="custom-spinner-box"></div>
        </div>`      
    });
    loading.present();
    
    return loading;
  }

  dismissLoading(loading)
  {   
    loading.dismiss(); 
  }

  loadingOnDismiss(loading)
  {
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  }
}

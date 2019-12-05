import { Storage } from '@ionic/storage';
import { User } from './../providers/user/user';
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages';
import { Settings } from '../providers';

import { SQLite } from '@ionic-native/sqlite';
import { SqlitetaskServiceProvider } from './../providers/sqlitetask-service/sqlitetask-service';


@Component({
  template: `<ion-menu id="SideMenu" [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}} 
        </button>
        <button menuClose ion-item (click)="logout()">
          Cerrar Sesión
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav  #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  public rootPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' },
    { title: 'Calendario', component: 'CalendarioPage' },
    { title: 'Actividad-Cal', component: 'ActividadPage' },
    { title: 'Proyecto', component: 'ProyectoPage' },
    { title: 'Categoria', component: 'CategoriaPage' }
  ]

  constructor(private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, private statusBar: StatusBar, private splashScreen: SplashScreen,    public sqlite: SQLite, public sqlitetaskService:SqlitetaskServiceProvider,private _user:User,private storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    this.storage.get('login')
                .then((datalogin)=>{
                  if(datalogin!=null)
                  {
                    this.rootPage='CalendarioPage';  
                  }else{
                    this.rootPage='WelcomePage';
                  }              
                });


      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.sqlitetaskService.createDatabase();
    });
    this.initTranslate();
  }


  
  


  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();    
    this.storage.get('lang').then((lang)=>{      
      if(lang==null || lang=='')
      {
        if (browserLang) {
          if (browserLang === 'zh') {
            const browserCultureLang = this.translate.getBrowserCultureLang();        
    
            if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
              this.translate.use('zh-cmn-Hans');
              this.storage.set('lang','zh-cmn-Hans');
    
            } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
              this.translate.use('zh-cmn-Hant');
              this.storage.set('lang','zh-cmn-Hant');
            }
          } else {
            this.translate.use(this.translate.getBrowserLang());
            this.storage.set('lang',this.translate.getBrowserLang());            
          }
        } else {
          this.translate.use('en'); // Set your language here
          this.storage.set('lang','en');          
        }
      }else{
        this.translate.use(lang);        
      }
    })
    .catch(e=>console.log("Error en variable de sesion lang"));
    

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  logout()
  {
    console.log("Cerrando sesión...");
    this._user.logout();
  }
}

import { PopoverSettingsComponent } from './../components/popover-settings/popover-settings';
// import { MatCardModule,MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Items } from '../mocks/providers/items';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
// FORMS
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'

//SQLITE
import { SQLite } from '@ionic-native/sqlite';
import { SqlitetaskServiceProvider } from '../providers/sqlitetask-service/sqlitetask-service';
import { CategoriaProvider } from '../providers/categoria/categoria';
import { CalendarioProvider } from '../providers/calendario/calendario';
import { ProyectoProvider } from '../providers/proyecto/proyecto';


// LOCAL NOTIFICATIONS
import { LocalNotifications } from '@ionic-native/local-notifications';

// ADMOBS FREE
import {AdMobFree} from '@ionic-native/admob-free';

// TOOLTIP
import {TooltipsModule} from 'ionic-tooltips'

// TECLADO
import { Keyboard } from '@ionic-native/keyboard';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    PopoverSettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    BrowserAnimationsModule, 
    FormsModule, 
    CustomFormsModule,   
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PopoverSettingsComponent
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    SQLite,
    SpeechRecognition,
    SqlitetaskServiceProvider,
    LocalNotifications,
    Keyboard,   
    AdMobFree,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CategoriaProvider,
    CalendarioProvider,
    ProyectoProvider
  ]
})
export class AppModule { }

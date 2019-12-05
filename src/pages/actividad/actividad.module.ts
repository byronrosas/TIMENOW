import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActividadPage } from './actividad';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'
@NgModule({
  declarations: [
    ActividadPage,    
  ],
  imports: [    
    FormsModule,
    CustomFormsModule,
    IonicPageModule.forChild(ActividadPage),
    TranslateModule.forChild()
  ],
})
export class ActividadPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarioPage } from './calendario';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CalendarioPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarioPage),
    TranslateModule.forChild()    
  ],
  exports: [
    CalendarioPage
  ]
})
export class CalendarioPageModule {}

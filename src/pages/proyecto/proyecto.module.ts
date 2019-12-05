import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProyectoPage } from './proyecto';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProyectoPage,
  ],
  imports: [
    IonicPageModule.forChild(ProyectoPage),
    TranslateModule.forChild()
  ],
})
export class ProyectoPageModule {}

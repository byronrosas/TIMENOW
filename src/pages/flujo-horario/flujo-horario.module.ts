import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FlujoHorarioPage } from './flujo-horario';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FlujoHorarioPage,
  ],
  imports: [
    IonicPageModule.forChild(FlujoHorarioPage),
    TranslateModule.forChild()
  ],
})
export class FlujoHorarioPageModule {}

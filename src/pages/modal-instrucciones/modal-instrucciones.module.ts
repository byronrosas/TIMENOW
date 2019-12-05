import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalInstruccionesPage } from './modal-instrucciones';

@NgModule({
  declarations: [
    ModalInstruccionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalInstruccionesPage),
  ],
})
export class ModalInstruccionesPageModule {}

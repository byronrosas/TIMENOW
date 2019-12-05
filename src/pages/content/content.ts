import { TranslateService } from '@ngx-translate/core';
import { Calendario } from './../../models/calendario';
import { Storage } from '@ionic/storage';
import { CalendarioProvider } from './../../providers/calendario/calendario';
import { Categoria } from './../../models/categoria';
import { Actividad } from './../../models/actividad';
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, ToastController,LoadingController } from 'ionic-angular';

import { SpeechRecognition } from '@ionic-native/speech-recognition'
import { ChangeDetectorRef } from '@angular/core';

import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {

  public optVista:string="newview";
  public actividad:Actividad;
  public categoriaList:Categoria[];
  public actividadList:Actividad[];
  public validator:boolean=false;
  coincidencias: String[];
  isRecording = false;  
  public msnTranslate:any;
  public btnUpdate:boolean=false;
  public colorList:any=['#ff7f2a','#00ffff','#800080','#aa0000','#2c5aa0','#00002b','#ff80e5','#002b00','#552200','#9955ff','#00ff00','#808000','#ff8f3e','#800000','#373e48','#003380','#ff00ff','#ff0066'];
  public arr:any=[];

  constructor(public navCtrl: NavController,private storage: Storage,private _calendario:CalendarioProvider,private speechRecognition: SpeechRecognition,private plt: Platform, private cd: ChangeDetectorRef,public alertCtrl: AlertController,private translateService: TranslateService,public toastCtrl: ToastController,public loadingCtrl: LoadingController) { 
    this.actividad=new Actividad();
    this.actividadList=new Array();

  }
  ionViewDidEnter(){
    console.log('ionViewDidLoad ContentPage');

    this.translateToastAndAlertMsn();

    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {
        let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    

        Promise.all([this._calendario.listCategorias(idusuario),this._calendario.listActividades(idusuario)]).then(values => { 
          console.log(values); // [3, 1337, "foo"] 
          let categorias=values[0];
          this.categoriaList=categorias;
          let actividades=values[1];
          this.actividadList=actividades;
          this.arr=actividades;
          this.ldismissLoading(loader);
        })             
        .catch(e=>{
          console.log("Error al listar ");
          this.ldismissLoading(loader);
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        });
                  
      }else{        
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    });
  }
 
  gotoPagePlus(page:string)
  {
    this.navCtrl.push(page);
  }



  isIos() {
    return this.plt.is('ios');
  }
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
      this.actividad.descripcion=this.coincidencias.toString();    });
  }
 
  getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      });
  }
 
  startListening() {
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {
      this.coincidencias = matches;      
      this.actividad.descripcion=this.coincidencias.toString();
      this.cd.detectChanges();
    });
    this.isRecording = true;
  }

  doSaveContent(contenidoform)
  {
    if(this.actividad.idactividad==null)
    {
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this._calendario.createActividad(this.actividad)
      .then((resp)=>{
        console.log("Actividad lista");
        this.ldismissLoading(loader);
        this.list();
        this.showAlert(this.msnTranslate.BTN_GUARDAR_CONTENIDO,this.msnTranslate.GUARDAR_MSN);
        this.reset(contenidoform);     
      })
      .catch(e=> {
        this.ldismissLoading(loader);
        console.log("Error al guardar actividad");
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
      
    }else{
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this._calendario.updateActividad(this.actividad)
      .then((resp)=>{
        console.log("Actividad lista");
        this.ldismissLoading(loader);
        this.showAlert(this.msnTranslate.BTN_ACTUALIZAR_CONTENIDO,this.msnTranslate.ACTUALIZAR_MSN);               
        this.list();
        this.reset(contenidoform);     
      })
      .catch(e=>{ 
        console.log("Error al guardar actividad");
        this.ldismissLoading(loader);
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });  
    }
    
  }

  detail(item:Actividad)
  {   
    this.showAlert(this.msnTranslate.DETALLE,       
      `<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:</strong>`+item.nombre+`</div>`
      +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.descripcion+`</div>`      
      +`<div><strong>`+this.msnTranslate.CATEGORIA+`:</strong>`+item.catnombre+`</div>`);
  }
  update(actividad:Actividad)
  {
    this.actividad=actividad;
    this.btnUpdate=true; 
    this.optVista="newview";   
  }


  delete(actividad:Actividad,index)
  {
    this.showConfirm("Eliminar","Desea eliminar esta Actividad?","No","¡Elimínalo!",()=>{
      console.log("Eliminación cancelada");
    },()=>{
      console.log("Eliminando...",actividad.idactividad);
      let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
      this._calendario.removeActividad(actividad)
      .then((resp)=>{
        if(resp)
        {
          this.ldismissLoading(loaderDelete); 
          this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
          this.actividadList.splice(index,1);
          
        }else{
          
          this.showConfirm(this.msnTranslate.ADVERTENCIA,this.msnTranslate.ADVERTENCIA_NOT_PROGRESS,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
            console.log("Eliminación cancelada");
          },()=>{
            let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
              this._calendario.removeContenidoYCalendario(actividad)
              .then(()=>{
                this.ldismissLoading(loaderDelete); 
                this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);                
                
                this.actividadList.splice(index,1);

              })
              .catch((e)=>{
                console.log("Error eliminando->",JSON.stringify(e));
                this.ldismissLoading(loaderDelete); 
                this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
              })
            });
          }
        
        
      })
      .catch((e)=>{
        console.log("Error eliminando->",JSON.stringify(e));
        this.ldismissLoading(loaderDelete); 
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
    });
  }

  list()
  {
    this.actividadList=[];
    this.arr=[];
    let loaderList=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);   
    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {        
        this._calendario.listActividades(idusuario)
        .then((actividades:[Actividad])=>{
          this.actividadList=actividades;
          this.arr=actividades;
          this.ldismissLoading(loaderList);
        })
        .catch((e)=>{
          this.ldismissLoading(loaderList);
          console.log("Error al listar actividades");
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        });
      }else{
        this.ldismissLoading(loaderList);      
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    })
    .catch((e)=>{
      this.ldismissLoading(loaderList); 
      this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
    });    
  }

 
  //ALERTS
  showConfirm(title,msg,btn1,btn2,fc,fc2) {
    const confirm = this.alertCtrl.create({
      title: title,
      message:msg,
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

  showAlert(title,msn) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle:msn,
      buttons: ['OK']
    });
    alert.present();
  }


  selectEtiqueta(color)
  {
    this.actividad.etiqueta=color;
  }

  filterItems(ev: any) {    
    let val = ev.target.value;        
    if (val && val.trim() !== '') {          
      let filter;            
      filter=_.filter(this.actividadList,(o:Actividad)=>{
        return o.nombre.toLowerCase().includes(val.toLowerCase()) || o.descripcion.toLowerCase().includes(val.toLowerCase()) || o.catnombre.toLowerCase().includes(val.toLowerCase());
      });
      
      this.actividadList=filter;
      console.log(filter);      
    }else{      
      this.actividadList=this.arr;
    }
  }

  presentToast(msn)
  {
    let toast = this.toastCtrl.create({
      message: msn,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  translateToastAndAlertMsn()
  {
    let translateArr=
    [  
     'ERROR_MSN',
     'ESTADO_ACT_MSN',
     'ERROR_LIST_MSN',
     'BTN_CANCELAR',
     'BTN_ACEPTAR',
     'BTN_ELIMINAR',
     'AGENDA',
     'SUG_ELIMINAR_MSN',
     'ELIMINAR_MSN',
     'ACTUALIZAR_MSN',
     'GUARDAR_MSN',
     'DETALLE',
     'ERROR_SESION_MSN',
     'ERROR',
     'ELIMINAR',
     'SUG_ELIMINAR_MSN',
     'CTP_NOMBRE',
     'CTP_DESCRIPCION',
     'PROYECTO',
     'CATEGORIA',
     'ESFUERZO_NECESARIO',
     'EXISTENCIA_ACT_MSN',
     'FECHA_VALIDACION_MSN',
     'TIPO_UNICO',
     'TIPO_RECURRENTE',
     'SE_HAN_ELIMINADO_MSN',
     'ACT_RECURRENTES_MSN',
     'ELIMINAR_RECURRENTES',
     'ELIMINAR_RECURRENCIAS_MSN',
     'ELIMINAR_RECURRENTES_MSN',
     'TIEMPO_INICIO',
     'TIEMPO_FIN',
     'BTN_ACTUALIZAR_ACTIVIDAD',
     'PRIORIDAD',
     'BTN_GUARDAR_CONTENIDO',
     'ADVERTENCIA_NOT_PROGRESS',
     'BTN_ACTUALIZAR_CONTENIDO',
     'ADVERTENCIA',
     'CARGANDO'
    ]
    this.translateService.get(translateArr).subscribe(
      value => {
        // value is our translated string
        this.msnTranslate=value;
      }
    )
  }

  lpresentLoadingCustom(msn) {
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

  ldismissLoading(loading)
  {   
    loading.dismiss(); 
  }

  loadingOnDismiss(loading,cb)
  {
    loading.onDidDismiss(cb);
  }

  validatorFn()
  {
    if(this.actividad.nombre==null || this.actividad.descripcion==null || this.actividad.etiqueta==null || this.actividad.idcategoria==null)
    {
      this.validator=false; 
    }else{
      this.validator=true; 
    }
  }
  reset(contenidoform)
  {
    contenidoform.reset();
    this.actividad.etiqueta=this.colorList[0];
  }
}

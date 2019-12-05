import { TranslateService } from '@ngx-translate/core';
import { Calendario } from './../../models/calendario';
import { CalendarioProvider } from './../../providers/calendario/calendario';
import { Categoria } from './../../models/categoria';
import { Proyecto } from './../../models/proyecto';
import { ProyectoProvider } from './../../providers/proyecto/proyecto';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,LoadingController } from 'ionic-angular';


import * as _ from 'lodash';
/**
 * Generated class for the ProyectoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-proyecto',
  templateUrl: 'proyecto.html',
})
export class ProyectoPage {

  public optVista:string="newview";
  public proyecto:Proyecto;
  public proyectoList:Proyecto[];
  public categoriaList:[Categoria];  
  public idusuario:any;
  public btnUpdate:boolean=false;
  public arr:any=[];
  public msnTranslate:any;
  public validator:boolean=false;
  public colorList:any=['#ff7f2a','#00ffff','#800080','#aa0000','#2c5aa0','#00002b','#ff80e5','#002b00','#552200','#9955ff','#00ff00','#808000','#ff8f3e','#800000','#373e48','#003380','#ff00ff','#ff0066'];
  constructor(public navCtrl: NavController, public navParams: NavParams,public _proyecto:ProyectoProvider,private storage: Storage,private _calendario:CalendarioProvider,public alertCtrl: AlertController, private translateService: TranslateService,public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
    this.proyecto=new Proyecto();
    this.proyectoList=new Array();    
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ProyectoPage');


    this.translateToastAndAlertMsn();


    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {
        let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
        this.idusuario=idusuario;
        this._calendario.listCategorias(idusuario)
        .then((categorias:[Categoria])=>{
          this.categoriaList=categorias;
          this.ldismissLoading(loader);
        })
        .catch(e=>{
          this.ldismissLoading(loader);
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        })

        this.list();
      }else{        
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    });

  }

  gotoPagePlus(page:string)
  {
    this.navCtrl.push(page);
  }

  //CRUD
  doSaveProyecto(proyectoform)
  {    
    if(this.proyecto.idproyecto==null)
    {
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this.proyecto.estado="0";
      this.proyecto.idusuario=this.idusuario;
      this._proyecto.createProyecto(this.proyecto)
      .then((resp)=>{
        console.log("Proyecto lista");
        
        // VALIDAR EL RESP
        Promise.all([this._proyecto.completadosProyecto(this.proyecto.idproyecto),this._proyecto.listCalendarioPorProyecto(this.proyecto.idproyecto)])
        .then((values:any)=>{
          let completadosTotal=(100*values[0].length)/values[1].length;
          if(isNaN(completadosTotal))
          {
            completadosTotal=0;
          }
          this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);        
          this._calendario.notificationLoad(resp.insertId,completadosTotal,new Date());
          this.ldismissLoading(loader);
          this.list();
        
          this.reset(proyectoform);
        })
        .catch((e)=>{
          console.log("Error al crear proyecto:=>",JSON.stringify(e));
          this.ldismissLoading(loader);
          this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
        }); 
        
        
      })
      .catch((e)=> {
        this.ldismissLoading(loader);
        console.log("Error al guardar proyecto",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      }
      );
    }else{
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this._proyecto.updateProyecto(this.proyecto)
      .then((resp)=>{

        this._calendario.notificationClear(this.proyecto.idproyecto,2);
        Promise.all([this._proyecto.completadosProyecto(this.proyecto.idproyecto),this._proyecto.listCalendarioPorProyecto(this.proyecto.idproyecto)])
        .then((values:any)=>{
          let completadosTotal=(100*values[0].length)/values[1].length;
          if(isNaN(completadosTotal))
          {
            completadosTotal=0;
          }
          this._calendario.notificationLoad(this.proyecto.idproyecto,completadosTotal,new Date());
          this.showAlert(this.msnTranslate.BTN_ACTUALIZAR_ACTIVIDAD,this.msnTranslate.ACTUALIZAR_MSN);      
          this.list();
          this.reset(proyectoform);
          this.ldismissLoading(loader);
        })
        .catch((e)=>
        {
          this.ldismissLoading(loader);
          console.log("Error al actualizar proyecto:=>",JSON.stringify(e));
          this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
        });                       
        
      })
      .catch((e)=>
      {
        this.ldismissLoading(loader);
        console.log("Error al guardar proyecto",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      }); 
    }
  }

  
  detail(item:Proyecto)
  {   
    this.showAlert(this.msnTranslate.DETALLE,       
    `<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:</strong>`+item.nombre+`</div>`
    +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.descripcion+`</div>`
    +`<div><strong>`+this.msnTranslate.PRIORIDAD+`:</strong>`+item.prioridad+`</div>`
    +`<div><strong>`+this.msnTranslate.CATEGORIA+`:</strong>`+item.catnombre+`</div>`);
  }
  update(proyecto:Proyecto)
  {    
    this.proyecto=proyecto;
    console.log("xP",this.proyecto);
    this.btnUpdate=true; 
    this.optVista="newview";   
  }


  delete(proyecto:Proyecto,index)
  {
    this.showConfirm(this.msnTranslate.BTN_ELIMINAR,this.msnTranslate.SUG_ELIMINAR_MSN,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
      console.log("Eliminación cancelada");
    },()=>{
      console.log("Eliminando...",proyecto.idproyecto);
      let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
      this._proyecto.removeProyecto(proyecto)
      .then((resp)=>{                     
        if(resp)
        {
          this.ldismissLoading(loaderDelete); 
          this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
          
          this._calendario.notificationClear(proyecto.idproyecto,2);
          this.proyectoList.splice(index,1);
          
        }else{
          this.showConfirm(this.msnTranslate.ADVERTENCIA,this.msnTranslate.ADVERTENCIA_NOT_PROGRESS,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
            console.log("Eliminación cancelada");
          },()=>{

            let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
            this._proyecto.removeProyectoYCalendario(proyecto)
            .then(()=>{              
              this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
              this._calendario.notificationClear(proyecto.idproyecto,2);
              this._proyecto.listCalendarioPorProyecto(proyecto.idproyecto)
              .then((t:Calendario[])=>{
                t.forEach(element => {                  
                  this._calendario.notificationClear(element.idcalendario,1);
                });
                this.ldismissLoading(loaderDelete); 
              })
              .catch((e)=>{
                this.ldismissLoading(loaderDelete);
                console.log("Error eliminando->",JSON.stringify(e));
                this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
              });
              this.proyectoList.splice(index,1);
            })
            .catch((e)=>{
              this.ldismissLoading(loaderDelete); 
              console.log("Error eliminando->",JSON.stringify(e));
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
    this.proyectoList=[];
    this.arr=[];
    let loaderList=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);   
    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {        
        this._proyecto.listProyectos(idusuario)
        .then((proyectos:Proyecto[])=>{
          this.proyectoList=proyectos;
          this.arr=proyectos;
          this.ldismissLoading(loaderList);
        })
        .catch((e)=>{
          this.ldismissLoading(loaderList);
          console.log("Error al listar proyectos",JSON.stringify(e));
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        });
      }else{
        this.ldismissLoading(loaderList);      
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
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
    this.proyecto.etiqueta=color;
  }

  filterItems(ev: any) {    
    let val = ev.target.value;        
    if (val && val.trim() !== '') {          
      let filter;            
      filter=_.filter(this.proyectoList,(o:Proyecto)=>{
        return o.nombre.toLowerCase().includes(val.toLowerCase()) || o.descripcion.toLowerCase().includes(val.toLowerCase());
      });
      
      this.proyectoList=filter;
      console.log(filter);      
    }else{      
      this.proyectoList=this.arr;
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
     'ADVERTENCIA_NOT_PROGRESS',
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
    if(this.proyecto.nombre==null || this.proyecto.descripcion==null || this.proyecto.etiqueta==null || this.proyecto.prioridad==null || this.proyecto.idcategoria==null)
    {
      this.validator=false; 
    }else{
      this.validator=true; 
    }
  }
  reset(proyectoform)
  {
    proyectoform.reset();
    this.proyecto.etiqueta=this.colorList[0];
    this.proyecto.prioridad=0;
  }
}

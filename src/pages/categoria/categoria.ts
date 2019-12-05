import { Storage } from '@ionic/storage';
import { CalendarioProvider } from './../../providers/calendario/calendario';
import { Categoria } from './../../models/categoria';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController} from 'ionic-angular';

import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the CategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categoria',
  templateUrl: 'categoria.html',
})
export class CategoriaPage {  
  public optVista:string="newview";
  public categoria:Categoria;
  public categoriaList:Categoria[];
  public idusuario:number;
  public btnUpdate:boolean=false;
  public validator:boolean=false;
  public arr:any=[];
  public msnTranslate:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public _calendario:CalendarioProvider,private storage: Storage,public alertCtrl: AlertController,private translateService: TranslateService,public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
    this.categoria=new Categoria();
    this.categoriaList=new Array();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriaPage');
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
        .catch((e)=>{
          console.log("Error al listar categorias");
          this.ldismissLoading(loader);
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        });
      }else{        
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    });

    
  }

  doSaveCategoria(categoriaform)
  {
    if(this.categoria.idcategoria==null)
    {
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this.categoria.idusuario=this.idusuario;
      this._calendario.createCategoria(this.categoria)
      .then((resp)=>{
        console.log("Categoria lista");
        this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);        
        this.list();
        this.reset(categoriaform);
        this.ldismissLoading(loader);
      })
      .catch((e)=>{ 
        this.ldismissLoading(loader);
        console.log("Error al guardar categoria",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
    }else{
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this._calendario.updateCategoria(this.categoria)
      .then((resp)=>{
        this.ldismissLoading(loader);
        console.log("Categoria lista");  
        this.showAlert(this.msnTranslate.BTN_ACTUALIZAR_ACTIVIDAD,this.msnTranslate.ACTUALIZAR_MSN);                     
        this.reset(categoriaform);
        this.list();
      })
      .catch((e)=> {
        console.log("Error al guardar la categoria");
        this.ldismissLoading(loader);
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      }); 
    }    
  }

  detail(item:Categoria)
  {   
    this.showAlert(this.msnTranslate.DETALLE,        
    `<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:</strong>`+item.nombre+`</div>`
    +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.descripcion+`</div>`);

  }
  update(categoria:Categoria)
  {
    this.categoria=categoria;
    this.btnUpdate=true; 
    this.optVista="newview";    
  }

  delete(categoria:Categoria,index)
  {
    this.showConfirm(this.msnTranslate.BTN_ELIMINAR,this.msnTranslate.SUG_ELIMINAR_MSN,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
      console.log("Eliminación cancelada");
    },()=>{
      console.log("Eliminando...",categoria.idcategoria);
      let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
      this._calendario.removeCategoria(categoria)
      .then((resp)=>{
        if(resp)
        {
          this.ldismissLoading(loaderDelete); 
          this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
          this.categoriaList.splice(index,1);
        }else{
          this.showConfirm(this.msnTranslate.ADVERTENCIA,this.msnTranslate.ADVERTENCIA_NOT_PROGRESS,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
            console.log("Eliminación cancelada");
          },()=>{
            let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
            this._calendario.deleteCATEGORIAwithPROYECTOandACTIVIDAD(categoria)
            .then((t)=>{
              this.ldismissLoading(loaderDelete); 
            })
            .catch((e)=>
            {
              this.ldismissLoading(loaderDelete);
              console.log("Error eliminando->",JSON.stringify(e));
            this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
            });
          });
        }       
        this.categoriaList.splice(index,1);
      })
      .catch((e)=>{
        this.ldismissLoading(loaderDelete); 
        console.log("Error eliminando->",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
    });
  }

  list()
  {
    this.categoriaList=[];
    this.arr=[];
    let loaderList=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);   
    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {        
        this._calendario.listCategorias(idusuario)
        .then((categorias:[Categoria])=>{
          this.categoriaList=categorias;
          this.arr=categorias;
          this.ldismissLoading(loaderList);
        })
        .catch((e)=>{
          this.ldismissLoading(loaderList);
          console.log("Error al listar categorias");
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
  filterItems(ev: any) {    
    let val = ev.target.value;        
    if (val && val.trim() !== '') {          
      let filter;            
      filter=_.filter(this.categoriaList,(o:Categoria)=>{
        return o.nombre.toLowerCase().includes(val.toLowerCase()) || o.descripcion.toLowerCase().includes(val.toLowerCase());
      });
      
      this.categoriaList=filter;
      console.log(filter);      
    }else{      
      this.categoriaList=this.arr;
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

  reset(categoriaform)
  {
    categoriaform.reset();
  }
  validatorFn()
  {
    if(this.categoria.nombre==null || this.categoria.descripcion==null)
    {
      this.validator=false; 
    }else{
      this.validator=true; 
    }
  }
}

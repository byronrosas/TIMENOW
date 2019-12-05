
import { ProyectoProvider } from './../../providers/proyecto/proyecto';
import { CalendarioProvider } from './../../providers/calendario/calendario';
import { Proyecto } from './../../models/proyecto';
import { Actividad } from './../../models/actividad';
import { Calendario } from './../../models/calendario';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams, AlertController, ToastController,LoadingController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { SpeechRecognition } from '@ionic-native/speech-recognition'
import { ChangeDetectorRef } from '@angular/core';

import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import * as moment from 'moment';
import * as _ from 'lodash';
/**
 * Generated class for the ActividadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-actividad',
  templateUrl: 'actividad.html',
})
export class ActividadPage {

  public optVista:string="newview";
  public calendario:any;
  public calendarioList:Calendario[];
  public actividadList:Actividad[];
  public proyectoList:Proyecto[];
  public btnUpdate:boolean=false;
  
  public toogleTipoSegment:string;
  
  public arr:any=[]; 
  public horaInicioR:any;
  public horaFinR:any;
  public FechaInicioR:any;
  public nDias:number;
  public msnCommunErr:any[];
  public idrepeticion:number;
  public msnTranslate:any;
  public colorList2:any;
  public validator:boolean=false;
  public msnValidarFecha:string;
  public validatorFechaI:boolean=false;
  public validatorFechaF:boolean=false;
  public validatorFechaR:boolean=false;  
  // public dateAct:string=new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+" "+new Date().getUTCHours().toString()+":"+new Date().getUTCMinutes().toString();
  public dateAct:string=moment().toISOString();
  // public msnError:any={
  //   errToogleTipo:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errProyecto:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errContenido:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errTiempoInicial:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errTiempoFinal:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errEstado:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errEsfuerzo:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errFechaInicio:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR],show:false},
  //   errNDias:{msn:[this.msnTranslate.MSN_INPUT_VALIDAR]   ,show:false} 
  // };
  // coincidencias: String[];
  // isRecording = false;
  public colorList:any; 
  public colorListForView:any=
  {noinicia:"#0000FF",enprogreso:"#338000",pendiente:"#DF0101",completada:"#d45500",cancelada:"#424242"};
     
  public indicadorEstado:any;                                                  
  constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,private storage: Storage,private _calendario:CalendarioProvider,private _proyecto:ProyectoProvider,private speechRecognition: SpeechRecognition,private plt: Platform, private cd: ChangeDetectorRef, private translateService: TranslateService,public alertCtrl: AlertController,public toastCtrl: ToastController,public platform:Platform,public loadingCtrl: LoadingController) {    
    
    this.calendario=new Calendario(); 
    this.calendario.estado="noinicia"; 
    this.calendario.tipo="Proyecto";               
    this.calendarioList=new Array();     
    this._calendario.notificationEventListener("click")
    .then((sub)=>{
      sub
      .subscribe((data)=>{
        alert("data=>"+JSON.stringify(data.data));

      },(e)=>{
        console.log("Error",JSON.stringify(e));
      });      
    })  
    .catch();
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad ActividadPage');
    
    this.translateToastAndAlertMsn();
    this.idrepeticion=null;
    this.translateService.get(["noinicia","enprogreso","pendiente","completada","cancelada"])
    .subscribe((translate)=>{      
          
          this.colorList=
          [            
            {estado:"noinicia",value:translate.noinicia,noinicia:"#0000FF"},    
            {estado:"enprogreso",value:translate.enprogreso,enprogreso:"#338000"},
            {estado:"pendiente",value:translate.pendiente,pendiente:"#DF0101"},
            {estado:"completada",value:translate.completada,completada:"#d45500"},
            {estado:"cancelada",value:translate.cancelada,cancelada:"#424242"}
          ]; 

          this.colorList2=
          {            
            "noinicia1":translate.noinicia,
            "enprogreso1":translate.enprogreso,
            "pendiente1":translate.pendiente,
            "completada1":translate.completada,
            "cancelada1":translate.cancelada,
          };                     
    },()=>{
      
      this.presentToast("Error-Translate"); 
    });    
      
      this.storage.get('login').then((idusuario) => {
        if(idusuario!=null)
        {
          let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
          Promise.all([this._calendario.listActividades(idusuario),this._calendario.listCalendarios(idusuario),this._proyecto.listProyectos(idusuario)]).then(values => { 
            let actividades=values[0];
            this.actividadList=actividades; 
            let calendarios=values[1];
            this.calendarioList=calendarios;
            console.log(this.calendarioList);
            this.arr=calendarios;
            let proyectos=values[2];
            this.proyectoList=proyectos;   
            this.ldismissLoading(loader);
          }).catch(e=>{            
            this.ldismissLoading(loader);
            this.loadingOnDismiss(loader,()=>{
              this.presentToast(this.msnTranslate.ERROR_LIST_MSN+"("+e+")");
            })            
          });
                                 
        }else{          
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN+"(Storage)");
        }
      });    


  }

  isIos() {
    return this.plt.is('ios');
  }
  gotoPagePlus(page:string)
  {
    this.navCtrl.push(page);
  }

  validatorFn(tipo)
  {
    this.validatorDateFnF(tipo);
    
    if(this.calendario.idproyecto==null || this.calendario.idactividad==null || this.calendario.estado==null || this.calendario.peso==null || this.calendario.tipo==null)    
    {
      this.validator=false;      
    }
    else{
      if(this.calendario.tipo=='Proyecto')
      {
        if(this.calendario.tiempoinicio==null || this.calendario.tiempofin==null)
        {          
          this.validator=false;
        }else{          
          this.validator=true;
        }
        
      }else if(this.calendario.tipo=='Comun' && (this.calendario.idcalendario==undefined || this.calendario.idcalendario!=null))
      {        
        if(this.calendario.tiempoinicio==null || this.calendario.tiempofin==null || this.FechaInicioR==null || this.horaInicioR==null || this.horaFinR==null)
        {          
          this.validator=false;
        }else{ 
          this.validator=true;         
        }
      }else if(this.calendario.tipo=='Comun' && (this.calendario.idcalendario!=undefined || this.calendario.idcalendario!=null))
      {        
        if(this.calendario.tiempoinicio==null || this.calendario.tiempofin==null)
        {          
          this.validator=false;
        }else{          
          this.validator=true;
        }
      }      
    }

    console.log("Hola");
    console.log(this.calendario);
    console.log(this.validator);
    console.log("hola");
  }



  repetirAct()
  {    
      // console.log(this.FechaInicioR+"T"+this.horaInicioR+':00'+'Z');
      // console.log(this.FechaInicioR+"T"+this.horaFinR+':00'+'Z'); 
      // console.log(moment(this.FechaInicioR));                  
      // console.log(this.FechaInicioR+"T"+this.horaFinR+':00'+'Z'); 
      // console.log(this.nDias);
      this.validatorFn(3);
      let cont=1;
        let fechaInicioaux=this.FechaInicioR;
        while(cont<=this.nDias)
        {
          let fi=fechaInicioaux+"T"+this.horaInicioR+':00'+'Z';
          let ff=fechaInicioaux+"T"+this.horaFinR+':00'+'Z';
          
          this.calendario.tiempoinicio=fi;
          this.calendario.tiempofin=ff;          
          console.log(fi+" - "+ff);
          console.log(this.calendario.tiempoinicio+" - "+this.calendario.tiempofin);
          this.validarFechas(this.calendario.tiempoinicio,this.calendario.tiempofin,(aux,tipo)=>{                         
              if(!aux)
              {
                switch(tipo)
                {
                  case 1:
                  let msn1=this.msnTranslate.FECHA_VALIDACION_MSN;
                  this.presentToast(msn1);
                  break;
                  case 2:
                  
                        let msn2=this.msnTranslate.EXISTENCIA_ACT_MSN;
                        this.presentToast(msn2);
                  break;
                }
              }                    
          });
          fechaInicioaux=moment(fechaInicioaux).add(1,'days').format('YYYY-MM-DD');//En esta fecha se hace los incrementos        
          cont++;    
         
        }            
       
  }
  //CRUD
  doSaveCalendario(actividadform)
  {         
    this.validarFechas(this.calendario.tiempoinicio,this.calendario.tiempofin,(aux,tipo)=>{
      if(aux)
      {
        if(this.toogleTipoSegment=="Proyecto")
        {
          let loaderSave=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
          this.calendario.tipo="Proyecto";  
          // console.log("tipo",this.calendario.tipo);         
          console.log("Se ha guardado normal");        
          this.save(loaderSave,actividadform);  
        }else if(this.toogleTipoSegment=="Comun"){
          this.calendario.tipo="Comun";
          // console.log("tipo",this.calendario.tipo);      
          // this.calendario.idproyecto=null;
          // let cont=1;
          // let fechaInicioaux=this.FechaInicioR;           
          // this.ldismissLoading(loaderSave);
          // while(cont<=this.nDias)
          // {            
            // let loaderSave=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO+' '+cont);
            // let fi=fechaInicioaux+"T"+this.horaInicioR+':00'+'Z';
            // let ff=fechaInicioaux+"T"+this.horaFinR+':00'+'Z';          
            // console.log(fi+" - "+ff);
            // this.calendario.tiempoinicio=fi;
            // this.calendario.tiempofin=ff;     
            // console.log("Se ha guardado"+cont);
            // // this.save(loaderSave,actividadform,cont);     
            // fechaInicioaux=moment(fechaInicioaux).add(1,'days').format('YYYY-MM-DD');//En esta fecha se hace los incrementos        
            // // if(cont==this.nDias)
            // // {
            // //   this.showAlert("ncon",cont);
            // //   this.idrepeticion=null;
            // // }
            // cont++;
            if(this.calendario.idcalendario==null)
            {
              let fechaInicioaux=this.FechaInicioR;                                   
              let fi=fechaInicioaux+"T"+this.horaInicioR+':00'+'Z';
              let ff=fechaInicioaux+"T"+this.horaFinR+':00'+'Z';          
              console.log(fi+" - "+ff);
              this.calendario.tiempoinicio=fi;
              this.calendario.tiempofin=ff;         
              
              let loaderSave=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO+'1');
              this._calendario.createCalendario(this.calendario)
              .then((r)=>{
                let idrep=r.insertId;
                this.calendario.idcalendario=idrep;        
                this.calendario.idrepeticion=idrep;     
                this._calendario.notificationNormalInicioFin(r.insertId,this.calendario.actnombre,this.calendario.actdescripcion,this.calendario.tiempoinicio,this.calendario.tiempofin,this.calendario.idRepeticion);                                                  
                this._calendario.updateCalendarioIdRepeticion(this.calendario)
                .then((r)=>{         
                  this.calendario.idcalendario=null;
                  this.ldismissLoading(loaderSave); 
                  
                  this.saveRecursivo(this.calendario,idrep,this.nDias,2,fechaInicioaux,actividadform);
                })
                .catch((e)=>{
                  this.ldismissLoading(loaderSave);
                  this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
                });
              })
              .catch((e)=>{
                this.ldismissLoading(loaderSave);
                this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
              });


            }else{
              let loaderSave=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
              this.save(loaderSave,actividadform);
            }
            
            
          // }          
  
        }
      }else{               
        switch(tipo)
        {
          case 1:
          let msn1=this.msnTranslate.FECHA_VALIDACION_MSN;
          this.presentToast(msn1);
          break;
          case 2:
          
                let msn2=this.msnTranslate.EXISTENCIA_ACT_MSN;
                this.presentToast(msn2);
          break;
        }
            

      }
       

    });
    




 
}

saveRecursivo(calendario?:Calendario,idRepeticion?:number,ndias?,cont?,fechaInicioaux?,form?)
{                              
            let loaderSave=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO+cont);
            fechaInicioaux=moment(fechaInicioaux).add(1,'days').format('YYYY-MM-DD');//En esta fecha se hace los incrementos        
            let fi=fechaInicioaux+"T"+this.horaInicioR+':00'+'Z';
            let ff=fechaInicioaux+"T"+this.horaFinR+':00'+'Z';
            calendario.idrepeticion=idRepeticion;
            calendario.tiempoinicio=fi;
            calendario.tiempofin=ff;
            if(cont<=ndias)
            {
              this._calendario.createCalendario(calendario)
              .then((r)=>{
                cont++;
                this.ldismissLoading(loaderSave);
                this._calendario.notificationNormalInicioFin(r.insertId,calendario.actnombre,calendario.actdescripcion,calendario.tiempoinicio,calendario.tiempofin,idRepeticion);                            
                this.saveRecursivo(calendario,idRepeticion,ndias,cont,fechaInicioaux,form);
              })
              .catch((e)=>{
                this.showAlert("error crear",JSON.stringify(e));
                this.ldismissLoading(loaderSave);
                this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);                
              });
            }else{
              this.ldismissLoading(loaderSave);
              this.list();
              this.reset(form);
              this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);        
            }                               
}

  save(loader,actividadform)
  {
     
      console.log("Aprobado");    
      if(this.calendario.estado==null)
      {
        this.calendario.estado='noinicia';
       
      }
      if(this.calendario.tipo==null || this.calendario.tipo==undefined)
      {
        this.calendario.tipo="Proyecto";
      }      


      if(this.calendario.peso==null || this.calendario.peso==undefined)
      {
        this.calendario.peso=0;
      }
      if(this.calendario.idcalendario==null)
      {       
        // console.log("Creando calendario---");
        this.calendario.actnombre=_.filter(this.actividadList,(act)=>{
          return act.idactividad===this.calendario.idactividad;
        })[0].nombre;
        this.calendario.actdescripcion=_.filter(this.actividadList,(act)=>{
          return act.idactividad===this.calendario.idactividad;
        })[0].descripcion;
        // if(this.idrepeticion==null)
        // {
        //   this.calendario.idrepeticion=this.idrepeticion;
        // }        
        this._calendario.createCalendario(this.calendario)
        .then((resp)=>{
          this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);        
          // console.log("Calendario creado",JSON.stringify(resp));           
          // VALIDAR RESP          
                  
          this.calendarioList.unshift(this.calendario);
          // if(this.calendario.tipo=="Proyecto")
          // {                        
            this._calendario.notificationNormalInicioFin(resp.insertId,this.calendario.actnombre,this.calendario.actdescripcion,this.calendario.tiempoinicio,this.calendario.tiempofin,this.calendario.idrepeticion);            
            Promise.all([this._proyecto.completadosProyecto(this.calendario.idproyecto),this._proyecto.listCalendarioPorProyecto(this.calendario.idproyecto)])
            .then((values:any)=>{              
              
              let completadosTotal=(100*values[0].length)/values[1].length;
              if(isNaN(completadosTotal))
              {
                completadosTotal=0;
              }
              this._calendario.notificationLoad(this.calendario.idproyecto,completadosTotal,new Date());                                          
            })
            .catch((e)=>{
              this.ldismissLoading(loader);
              console.log("Error al crear calendario=>",JSON.stringify(e));
              this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
            });        
          // }
          // else if(this.calendario.tipo=="Comun")
          // {                    
          //   this._calendario.notificationRepetida(this.calendario.idcalendario,this.calendario.actnombre+"(Rutina-Inicio)",this.calendario.actdescripcion,this.calendario.tiempoinicio,this.calendario.tiempofin);            
          // } 
          this.list();
          if(this.toogleTipoSegment=='Proyecto')
          {
            this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);
            this.ldismissLoading(loader);
            this.reset(actividadform);            
          }
        })
        .catch((e)=>{
          console.log("Error al guardar calendario",JSON.stringify(e));
          this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
          this.ldismissLoading(loader);
        });
        
      }else{
      //ACTUALIZANDO CALENDARIO... 
        this._calendario.updateCalendario(this.calendario)
        .then((resp)=>{
          // console.log("Calendario lista");
          this._calendario.notificationClear(this.calendario.idcalendario,1);
          // if(this.calendario.tipo=="Proyecto")
          // {            
            this._calendario.notificationNormalInicioFin(this.calendario.idcalendario,this.calendario.actnombre,this.calendario.actdescripcion,this.calendario.tiempoinicio,this.calendario.tiempofin,this.calendario.idrepeticion);            
            Promise.all([this._proyecto.completadosProyecto(this.calendario.idproyecto),this._proyecto.listCalendarioPorProyecto(this.calendario.idproyecto)])
            .then((values:any)=>{
              let completadosTotalq=0;
              if(values[1].rows.length!=0)
              {
                 completadosTotalq=(100*values[0].length)/values[1].rows.length;
              }                  
              
                
                this._calendario.notificationLoad(this.calendario.idproyecto,completadosTotalq,new Date()); 
                this.showAlert(this.msnTranslate.BTN_ACTUALIZAR_ACTIVIDAD,this.msnTranslate.ACTUALIZAR_MSN);
                this.ldismissLoading(loader);
                this.reset(actividadform);
              
            })
            .catch((e)=>
            {
              console.log("Error al crear calendario=>",JSON.stringify(e));
              this.ldismissLoading(loader);
              this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
            });        
          // }
          // else if(this.calendario.tipo=="Comun")
          // {
          //   this._calendario.notificationRepetida(this.calendario.idcalendario,this.calendario.actnombre+"(Rutina-Inicio)",this.calendario.actdescripcion,this.calendario.tiempoinicio,this.calendario.tiempofin);            
          // }                    
          this.list();
          
        })
        .catch((e)=> 
        {
          console.log("Error al guardar calendario",JSON.stringify(e));
          
          this.ldismissLoading(loader);
          this.showAlert(this.msnTranslate.BTN_GUARDAR_ACTIVIDAD,this.msnTranslate.GUARDAR_MSN);

        }); 
      }
    
     
  }

  detail(item:Calendario)
  { 
    let tipo;
    if(item.tipo=='Proyecto') 
    {
      tipo=this.msnTranslate.TIPO_UNICO;
    }else if(item.tipo=='Comun') {
      tipo=this.msnTranslate.TIPO_RECURRENTE;
    }
    this.showAlert(this.msnTranslate.DETALLE,`<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:`+item.actnombre+`(`+this.colorList2[item.estado+'1']+`)</strong></div>`
    +`<div><strong>`+this.msnTranslate.TIEMPO_INICIO+`:</strong>`+item.fi+` (`+item.hi+`)`+`</div>`
    +`<div><strong>`+this.msnTranslate.TIEMPO_FIN+`:</strong>`+item.ff+` (`+item.hf+`)`+`</div>`
    +`<div><strong>`+this.msnTranslate.TIPO_UNICO+`/`+this.msnTranslate.TIPO_RECURRENTE+`:</strong>`+tipo+`</div>`
    +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.actdescripcion+`</div>`
    +`<div><strong>`+this.msnTranslate.PROYECTO+`:</strong>`+item.pronombre+`</div>`
    +`<div><strong>`+this.msnTranslate.CATEGORIA+`:</strong>`+item.catnombre+`</div>`
    +`<div><strong>`+this.msnTranslate.ESFUERZO_NECESARIO+`:</strong>`+item.peso+`</div>`);
  }
  update(calendario:any)
  {
    this.calendario=calendario;
    this.btnUpdate=true;
    this.optVista="newview";    
  }

  deleteAllRecurrents(calendario:Calendario,i)
  {    
    this.proyectoList=[];
    this.showConfirm(this.msnTranslate.ELIMINAR_RECURRENTES,this.msnTranslate.ELIMINAR_RECURRENTES_MSN,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.ELIMINAR_RECURRENCIAS_MSN,()=>{
      console.log("Eliminación cancelada");
    },()=>{
      console.log("Eliminando...",calendario.idcalendario);
      let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
      this._calendario.removeCalendarioRecurrentes(calendario)
      .then((resp)=>{   
          this.ldismissLoading(loaderDelete);
          this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.SE_HAN_ELIMINADO_MSN+` <strong>`+ resp.rows.item.length+`</strong> `+this.msnTranslate.ACT_RECURRENTES_MSN);          
          this._calendario.notificationClear(calendario.idcalendario,1,calendario.idrepeticion,true);
          this.list();                       
      })
      .catch((e)=>{
        this.ldismissLoading(loaderDelete);
        console.log("Error eliminando->",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
    });
  }

  delete(calendario:Calendario,index)
  {
    this.showConfirm(this.msnTranslate.BTN_ELIMINAR,this.msnTranslate.SUG_ELIMINAR_MSN,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
      console.log("Eliminación cancelada");
    },()=>{
      let loaderDelete=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);
      console.log("Eliminando...",calendario.idcalendario);
      this._calendario.removeCalendario(calendario)
      .then((resp)=>{  
          this.ldismissLoading(loaderDelete);      
          this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
          this._calendario.notificationClear(calendario.idcalendario,1);
          this.list();
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
    this.calendarioList=[];
    this.arr=[]; 
    let loaderList=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);   
    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {  
        
        this._calendario.listCalendarios(idusuario)
        .then((calendarios:[Calendario])=>{
          this.calendarioList=calendarios;
          this.arr=calendarios;
          this.ldismissLoading(loaderList);                
        })
        .catch((e)=>{
          this.ldismissLoading(loaderList);      
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

    
  validatorDateFnF(tipo)
  {
    var NFI=moment(new Date(this.calendario.tiempoinicio).getFullYear()+"-"+(new Date(this.calendario.tiempoinicio).getMonth()+1)+"-"+new Date(this.calendario.tiempoinicio).getUTCDate()+" "+new Date(this.calendario.tiempoinicio).getUTCHours()+":"+new Date(this.calendario.tiempoinicio).getUTCMinutes(),'YYYY-MM-DD HH:mm');
    var NFF=moment(new Date(this.calendario.tiempofin).getFullYear()+"-"+(new Date(this.calendario.tiempofin).getMonth()+1)+"-"+new Date(this.calendario.tiempofin).getUTCDate()+" "+new Date(this.calendario.tiempofin).getUTCHours()+":"+new Date(this.calendario.tiempofin).getUTCMinutes(),'YYYY-MM-DD HH:mm');    
    var FIR=moment(new Date(this.FechaInicioR).getFullYear()+"-"+(new Date(this.FechaInicioR).getMonth()+1)+"-"+new Date(this.FechaInicioR).getUTCDate()+" "+new Date(this.FechaInicioR).getUTCHours()+":"+new Date(this.FechaInicioR).getUTCMinutes(),'YYYY-MM-DD HH:mm');    
    if(tipo==1)
    {
      //inicio 
      if(NFI.isBefore(moment()))
      {
        this.validatorFechaI=true;
        this.msnValidarFecha=this.msnTranslate.MSN_INPUT_VERIFICAR_MAYOR_ACTUAL;      
        
      }    
      else{
        this.validatorFechaI=false;
        this.msnValidarFecha='';
      
      }
    }else if(tipo==2)
    { 
      // final
      if(NFF.isBefore(moment()))
      {        
        this.validatorFechaF=true;
        this.msnValidarFecha=this.msnTranslate.MSN_INPUT_VERIFICAR_MAYOR_ACTUAL;      
        
      }    
      else if(NFF.isBefore(NFI))
      {        
        this.validatorFechaF=true;
        this.msnValidarFecha=this.msnTranslate.MSN_INPUT_VERIFICAR_MAYOR_INICIO;
        
      }else{        
        this.msnValidarFecha='';
        this.validatorFechaF=false;
        
      }
    }else if(tipo==3)
    {
    // repeticion
      if(FIR.isBefore(moment()))
      {
        this.validatorFechaR=true;        
        this.msnValidarFecha=this.msnTranslate.MSN_INPUT_VERIFICAR_MAYOR_ACTUAL;      
        
      }    
      else{
        this.msnValidarFecha='';
        this.validatorFechaR=false;
        
      }
    }
        

  }

async validarFechas(Nfi,Nff,cb)
 {

    var aux=true;
    var NFI=moment(new Date(Nfi).getFullYear()+"-"+(new Date(Nfi).getMonth()+1)+"-"+new Date(Nfi).getUTCDate()+" "+new Date(Nfi).getUTCHours()+":"+new Date(Nfi).getUTCMinutes(),'YYYY-MM-DD HH:mm');
    var NFF=moment(new Date(Nff).getFullYear()+"-"+(new Date(Nff).getMonth()+1)+"-"+new Date(Nff).getUTCDate()+" "+new Date(Nff).getUTCHours()+":"+new Date(Nff).getUTCMinutes(),'YYYY-MM-DD HH:mm');
    // console.log(NFI);
    // console.log(NFF);
    // console.log(Nff);
    // console.log(Nfi);
    // console.log(moment(Nff));
    // console.log(moment(Nfi));
    // console.log("od",NFI.isSameOrAfter(moment()));
    // console.log("ot",NFF.isSameOrAfter(moment(Nfi)));

    if(NFI.isSameOrAfter(moment()) && NFF.isSameOrAfter(NFI))
    {

      console.log("Fecha despues");  
      var idusuario=await this.storage.get('login');
      aux=await this._calendario.listCalendarios(idusuario)
          .then((calendarios:[Calendario])=>{
            console.log("ListCal");
              calendarios.forEach((o)=>{
              var Gfi=moment(o.tiempoinicio.toString());
              var Gff=moment(o.tiempofin.toString());
              var Nfi=NFI;
              var Nff=NFF;                    
              var estado=o.estado;
              if(aux==true && (o.estado != "completada" || estado != "cancelada"))
              {
                Gff=moment((new Date(Gff.toString()).getFullYear()+"-"+(new Date(Gff.toString()).getMonth()+1)+"-"+new Date(Gff.toString()).getDate()+" "+new Date(Gff.toString()).getUTCHours().toString()+":"+new Date(Gff.toString()).getUTCMinutes().toString()).toString(),"YYYY-MM-DD HH:mm");
                Gfi=moment((new Date(Gfi.toString()).getFullYear()+"-"+(new Date(Gfi.toString()).getMonth()+1)+"-"+new Date(Gfi.toString()).getDate()+" "+new Date(Gfi.toString()).getUTCHours().toString()+":"+new Date(Gfi.toString()).getUTCMinutes().toString()).toString(),"YYYY-MM-DD HH:mm");
                // console.log("Actividad no completada");
                // console.log("Gfi",Gfi);
                // console.log("GfiM",moment(Gfi,"YYYY-MM-DD HH:mm"));     
                // console.log("Gff",Gff);
                // console.log("GffM",moment(Gff,"YYYY-MM-DD HH:mm"));
    
                // console.log("Nfi",Nfi);
                // console.log("Nff",Nff);
                // console.log("Condicion 1,",(Nfi.isSame(Gfi)!=true));
                // console.log("Condicion 2,",(Nfi.isSameOrBefore(Gff)==true ));
                // console.log("condicion 3,",Nff.isSameOrBefore(Gfi)==true);
                // console.log("condicion 4,",Nff.isSameOrAfter(Gff)==true);
                // console.log("condicion 5,",Nfi.isSameOrAfter(Gfi)==true);
                // console.log("condicion 6,",Nfi.isSameOrAfter(Gff)==true);  
                // console.log((Nfi.isSame(Gfi)!=true && ((Nfi.isSameOrBefore(Gff)==true && Nff.isSameOrBefore(Gfi)==true)||(Nff.isSameOrAfter(Gff)==true && Nfi.isSameOrAfter(Gfi)==true && Nfi.isAfter(Gff)==true))));                      
                // console.log((Nfi.isSame(Gfi)!=true && ((Nfi.isSameOrBefore(Gff)==true && Nff.isSameOrBefore(Gfi)==true)||(Nff.isSameOrAfter(Gff)==true && Nfi.isSameOrAfter(Gfi)==true && Nfi.isAfter(Gff)==true)))==false);
                if((Nfi.isSame(Gfi)!=true && ((Nfi.isSameOrBefore(Gff)==true && Nff.isSameOrBefore(Gfi)==true)||(Nff.isSameOrAfter(Gff)==true && Nfi.isSameOrAfter(Gfi)==true && Nfi.isAfter(Gff)==true)))==false)
                {
                  console.log("Actividad encontro choque");                  
                  return false; 
                  
                }          
              }     
                               
          });
          return true;
          // console.log("Ya llegue",aux);                  
          })
          .catch((e)=>{
            this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
            return false;
          });
            
      
      cb(aux,2);
    }else{

      cb(false,1);     
    }   
  } 

  selectEstado(item)
  {
    this.calendario.estado=item.estado; 
    this.indicadorEstado=[item.estado];
  }
  verNots()
  {
    this.platform.ready()
    .then(()=>{ 
      this._calendario.listarNot();
      this._calendario.listarNotProgramadas();
    });    
  }
  borrarNot()
  {
    this.platform.ready()
    .then(()=>{ 
      this._calendario.borrarNot();      
    });  
  }
  updateToogle()
  {
    if(this.toogleTipoSegment=='Comun')
    {
      this.calendario.tipo='Comun';        
      
    }else{
      this.calendario.tipo='Proyecto';            
    }      
  }

  cambioFechaF(tipo)
  {    
    
    this.validatorFn(tipo);
      this.validarFechas(this.calendario.tiempoinicio,this.calendario.tiempofin,(aux,tipo)=>{
        if(!aux)
        {
          switch(tipo)
          {
            case 1:
                  let msn1=this.msnTranslate.FECHA_VALIDACION_MSN;
                  this.presentToast(msn1);
            break;
            case 2:
            
                  let msn2=this.msnTranslate.EXISTENCIA_ACT_MSN;
                  this.presentToast(msn2);
            break;
          } 
        }
      });    
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

  filterItems(ev: any) {    
    let val = ev.target.value;        
    if (val && val.trim() !== '') {         
      let filter;            
      filter=_.filter(this.calendarioList,(o:any)=>{
        return o.actnombre.toLowerCase().includes(val.toLowerCase()) || o.pronombre.toLowerCase().includes(val.toLowerCase());
      });
      
      this.calendarioList=filter;
      console.log(filter);      
    }else{      
      this.calendarioList=this.arr;
    }
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
     'CARGANDO',
     'MSN_INPUT_VERIFICAR_MAYOR_ACTUAL',
     'MSN_INPUT_VERIFICAR_MAYOR_INICIO'     
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

  reset(actividadform)
  {
    actividadform.reset();
    this.calendario.idrepeticion=null;
    this.calendario.tipo="Proyecto";
    this.calendario.estado="noinicia";
    this.calendario.peso=0;
  }

  loadingOnDismiss(loading,cb)
  {
    loading.onDidDismiss(cb);
  }
}


// http://sonidosmp3gratis.com/notificacion
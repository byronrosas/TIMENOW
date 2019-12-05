import { Nota } from './../../models/nota';
import { Calendario } from './../../models/calendario';
import { Actividad } from './../../models/actividad';
import { Categoria } from './../../models/categoria';
import { SqlitetaskServiceProvider } from './../sqlitetask-service/sqlitetask-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {Platform } from 'ionic-angular';

import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotification } from '@ionic-native/local-notifications';
import { TranslateService } from '@ngx-translate/core';
/*
  Generated class for the CalendarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalendarioProvider {

  public msnTranslate:any;
  constructor(public http: HttpClient,public _sql:SqlitetaskServiceProvider,public localNoti:LocalNotifications,public platform:Platform,private translateService: TranslateService) {
    console.log('Hello CalendarioProvider Provider');  
    this.translateToastAndAlertMsn();        
    
  }
  

  // NOTIFICACIONES

  notificationEventListener(event:string)
  {
      //NOTIFICACIONES 
      return this.platform.ready()
      .then(()=>{
          return this.localNoti.on(event)                 
      });

  }


  notificationNormalInicioFin(idAct,title,text,timeInicio,timeFin,r?)
  {
 
    this.platform.ready()
    .then(()=>{ 
      this.localNoti.getIds()
      .then((notiIDs)=>{
        let id=notiIDs.length+1;
        timeInicio=new Date(timeInicio).getFullYear()+"-"+(new Date(timeInicio).getMonth()+1)+"-"+new Date(timeInicio).getDate()+" "+new Date(timeInicio).getUTCHours().toString()+":"+new Date(timeInicio).getUTCMinutes().toString();
        timeFin=new Date(timeFin).getFullYear()+"-"+(new Date(timeFin).getMonth()+1)+"-"+new Date(timeFin).getDate()+" "+new Date(timeFin).getUTCHours().toString()+":"+new Date(timeFin).getUTCMinutes().toString();        
        this.localNoti.schedule({
          id:id,
          title:title,
          text:text+this.msnTranslate.EN_ESTE_MOMENTO_I_MSN,
          trigger: {at:new Date(timeInicio)},
          led: {color:'#FF00FF',on:500,off:500},
          vibrate:true,          
          launch:true,
          icon: 'file://assets/imgs/ictimenowic.png',

          smallIcon: 'res://mipmap-xhdpi/icon',
          sound: 'file://assets/audio/SD_ALERT_INICIO.mp3',
          data:{"id":id,"idAct":idAct,"r":r,"title":title,"text":text,"date":timeInicio}                                               
       });

       this.localNoti.schedule({
        id:id+1,
        title:title+this.msnTranslate.EN_ESTE_MOMENTO_F_MSN,
        text:text,
        trigger: {at:new Date(timeFin)},
        led: {color:'#FF00FF',on:500,off:500},
        vibrate:true,        
        launch:true,
        icon: 'file://assets/imgs/ictimenowic.png',
        smallIcon: 'res://mipmap-xhdpi/icon',
        sound: 'file://assets/audio/SD_ALERT_FIN.mp3',
        data:{"id":id,"idAct":idAct,"r":r,"title":title,"text":text,"date":timeFin}                                               
     });
      
      })
      .catch((e)=>{
        console.log("Error notificacion;ini y fin:=>",JSON.stringify(e));
      });              
    });    
  }

  listarNot()
  {
    this.localNoti.getAll()
    .then((not)=>
   {
     console.log("Notificaciones lista");
     console.log(not);
   })
    .catch(e=>console.log("erro not",e));
  }
  borrarNot()
  {
    console.log("Borrar nots");
    this.localNoti.cancelAll()
    .then((e)=>{
      console.log("Borrados",e);
    })
    .catch(e=> console.log("err clrear",e));    
  }
  listarNotProgramadas()
  {
    this.localNoti.getAllScheduled()
    .then((not)=>
   {
     console.log("Notificaciones lista programadas");
     console.log(not);
   })
    .catch(e=>console.log("erro not",e));
  }
  notificationNormal(idAct,title,text,time,r?)
  {
 
    this.platform.ready()
    .then(()=>{ 
      this.localNoti.getIds()
      .then((notiIDs)=>{
        let id=notiIDs.length+1;
        console.log("#####");
        console.log(id)
        console.log(idAct)
        console.log(time);
        console.log(new Date());
        console.log("#####X");
        this.localNoti.schedule({
          id:id,
          title:title,
          text:text,
          trigger: {at:new Date()},
          led: {color:'#FF00FF',on:500,off:500},
          vibrate:true,
          sound: null,
          launch:true,
          icon: 'file://assets/imgs/ictimenowic.png',
          smallIcon: 'res://mipmap-xhdpi/icon',
          data:{"id":id,"idAct":idAct,"title":title,"r":r,"text":text,"date":time}                                               
       });
       this.localNoti.getAll()
       .then((not)=>
      {
        console.log("Notificaciones lista");
        console.log(not);
      })
       .catch(e=>console.log("erro not",e));
      })
      .catch((e)=>{
        console.log("Error notificacion;:=>",JSON.stringify(e));
      });              
    });    
  }

  notificationRepetida(idAct,title,text,timeinicio,timefin)
  {
    this.platform.ready()
    .then(()=>{
        this.localNoti.getIds()
        .then((notiIDs)=>{ 
        let id=notiIDs.length+1;       
        this.localNoti.schedule({
          id:id,
          title:title,
          text:text,          
          trigger: {at:timeinicio,every:ELocalNotificationTriggerUnit.DAY,before:timefin},
          led: {color:'#FF00FF',on:500,off:500},
          vibrate:true,
          sound: null,
          launch:true,
          icon: 'file://assets/imgs/ictimenowic.png',
          smallIcon: 'res://mipmap-xhdpi/icon',
          data:{"id":id,"idAct":idAct,"title":title,"text":text,"timeinicio":timeinicio,"timefin":timefin,"tipo":1}                                                                                                
      });
      })
      .catch((e)=>{
        console.log("Error notificaion;:=>",JSON.stringify(e));
      }); 
    });    
  }

  

  notificationLoad(idProy,progreso,time)
  {
    this.platform.ready()
    .then(()=>{
      this._sql.queryByIdPROYECTO(idProy)
      .then((proyecto)=>{        
        this.localNoti.getIds()
        .then((notiIDs)=>{ 
        let id=notiIDs.length+1;        
          this.localNoti.schedule({
            id:id,
            title:proyecto.rows.item(0).nombre,
            text: ''+progreso+'%',
            progressBar:{value:progreso},
            trigger: {at:time},
            led: {color:'#FF00FF',on:500,off:500},
            vibrate:true,    
            icon: 'file://assets/imgs/ictimenowic.png',          
            smallIcon: 'res://mipmap-xhdpi/icon', 
            data:{"id":id,"idAct":idProy,"progreso":progreso,"date":time,"tipo":2}                                                                                                                  
        });
      })
      .catch((e)=>{
        console.log("Error notificaion;load:=>",JSON.stringify(e));
      }); 
      })
      .catch((e)=>console.log("Error en query por id proycto",JSON.stringify(e)));                 
    });    
  }

  notificationClear(idAct,tipo,r?,tipor?:boolean)
  {
    this.platform.ready()
    .then(()=>{
      this.localNoti.getAllScheduled()
      .then((notificacion:[ILocalNotification])=>{       
        notificacion.forEach((item)=>{
          if(tipor)
          {
            if(item.data.r==r)
            {
              this.localNoti.cancel(item.id);
            }
          }else if(tipor==false || tipor==null || tipor==undefined){
            if(item.data.idAct==idAct && item.data.tipo==tipo)
            {
              this.localNoti.cancel(item.id);
            }
          }
      });
    })
    .catch((e)=>{
      console.log("Error notificaion;:=>",JSON.stringify(e));
    }); 
    }); 
  }
  // NOTIFICAIONES CIERRE

  createCategoria(categoria:Categoria)
  {
    console.log("Creando categoria...");
    let sec=this._sql.createCATEGORIA(categoria);
    return sec;
  }

  createActividad(actividad:Actividad)
  {
    console.log("Creando actividad...");
    let sec=this._sql.createACTIVIDAD(actividad);
    return sec;
  }

  createCalendario(calendario:Calendario)
  {
    console.log("Creando calendario...");
    let sec=this._sql.createCALENDARIO(calendario);
    return sec;
  }

  updateCalendario(calendario:Calendario)
  {
    let sec=this._sql.updateCALENDARIO(calendario)
    .then(()=>{
      console.log("Actualizado calendario");
    })
    .catch((e)=>{
      console.log("Error al actualizar:"+JSON.stringify(e));
    });
    return sec;
  } 

  updateCalendarioIdRepeticion(calendario:Calendario)
  {
    let sec=this._sql.updateCALENDARIOidRepeticion(calendario)
    .then(()=>{
      console.log("Actualizado calendario por id de repeticion");
    })
    .catch((e)=>{
      console.log("Error al actualizar por id de repeticion:"+JSON.stringify(e));
    });
    return sec;
  } 

  updateCategoria(categoria:Categoria)
  {
    let sec=this._sql.updateCATEGORIA(categoria);
    return sec;
  } 
  updateActividad(actividad:Actividad)
  {
    let sec=this._sql.updateACTIVIDAD(actividad);
    return sec;
  } 

  listActividades(idusuario:number)
  {    
    console.log("Listando Actividades...");
    let sec=this._sql.listAllActividades(idusuario);
    sec.then((t)=>{      
      console.log("Listado de actividades listo :)");
      console.log(JSON.stringify(t));
      return t;
      
    })
    .catch((e)=>console.log("Hola registro error"));
    return sec;
  }

 

  listCategorias(idusuario:number)
  {
    console.log("Listando Categorias...");
    let sec=this._sql.listAllByUser("CATEGORIA",idusuario);
    sec.then((t)=>{      
      console.log("Listado de categorias listo :)");
      console.log(JSON.stringify(t));
      return t;
      
    })
    .catch((e)=>console.log("Hola registro error"));
    return sec;
  }
  saveNota(nota:Nota)
  {
    let sec=this._sql.createNOTA(nota);
    return sec;
  }
  updateNota(nota:Nota)
  {
    let sec=this._sql.updateNOTA(nota);
    return sec;
  }
  deleteNota(nota:Nota)
  {
    let sec=this._sql.deleteNOTA(nota);
    return sec;
  }
  listNotas(idusuario:number)
  {
    console.log("Listando notas...");
    var arrIcons=[{id:"notifications",class:"",activ:false},{id:"mail",class:"",activ:false},{id:"call",class:"",activ:false},{id:"basket",class:"",activ:false},{id:"basket",class:"",activ:false},{id:"briefcase",class:"",activ:false},{id:"bus",class:"",activ:false},{id:"cafe",class:"",activ:false}];
    let sec=this._sql.listNotaByUser(idusuario);
    sec.then((t)=>{      
      console.log("Listado de notas listo :)");
      // console.log(JSON.stringify(t));
      var arr=[];
      t.forEach(element => {
        element.estadoTap=false;
        element.isCollapse=false;
        element.estadoAnim="in"; 
        element.arrIcons=arrIcons;
        element.arrIcons.forEach(icon => {
          switch(icon.id)
          {
            case element.etiqueta1:
              icon.class="icon-etiqueta";
              icon.activ=true;
            break;
            case element.etiqueta2:
              icon.class="icon-etiqueta";
              icon.activ=true;
            break;
            case element.etiqueta3:
              icon.class="icon-etiqueta";
              icon.activ=true;
            break;
            case element.etiqueta4:
              icon.class="icon-etiqueta";
              icon.activ=true;
            break;
          }
        });               
        setInterval(()=>{
          var d=new Date();
          if(element.time!=null)
            element.diff=moment(element.time).diff(d);
        }, 1000);       
        arr.push(element);
      });
      t=arr;
      return t;
      
    })
    .catch((e)=>console.log("Error listando notas",JSON.stringify(e)));
    return sec;
  }
  listCalendarios(idusuario:number)
  {
    console.log("Listando Calendarios...");
    let sec=this._sql.queryAllCalendario(idusuario);
    sec.then((t)=>{      
      console.log("Listado de calendarios listo :)");
      // console.log(JSON.stringify(t));
      var arr=[];
      t.forEach(element => {
        element.estadoAnim="in";
        element.fi=new Date(element.tiempoinicio).getUTCDate()+"/"+(new Date(element.tiempoinicio).getMonth()+1);
        element.anioi=new Date(element.tiempoinicio).getFullYear();
        element.ff=new Date(element.tiempofin).getUTCDate()+"/"+(new Date(element.tiempofin).getMonth()+1);
        element.aniof=new Date(element.tiempofin).getFullYear();
        element.hi=moment((new Date(element.tiempoinicio).getUTCHours()+":"+new Date(element.tiempoinicio).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
        element.hf=moment((new Date(element.tiempofin).getUTCHours()+":"+new Date(element.tiempofin).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
        arr.push(element);
      });
      t=arr;
      return t;
      
    })
    .catch((e)=>console.log("Error listando calendarios",JSON.stringify(e)));
    return sec;
  }

  removeCalendario(calendario:Calendario)  
  {
    let sec=this._sql.deleteCALENDARIO(calendario);
    return sec;
  }
  removeCalendarioRecurrentes(calendario:Calendario)  
  {
    let sec=this._sql.deleteCALENDARIOByIdrepeticion(calendario);
    return sec;
  }

  removeCategoria(categoria:Categoria)  
  {
    let sec=this._sql.deleteCATEGORIA(categoria);
    return sec;
  }

  deleteCATEGORIAwithPROYECTOandACTIVIDAD(categoria:Categoria)
  {
    let sec=this._sql.deleteCATEGORIAwithPROYECTOandACTIVIDAD(categoria);
    return sec; 
  }

  removeActividad(actividad:Actividad)  
  {
    let sec=this._sql.deleteACTIVIDAD(actividad);
    return sec;
  }

  removeContenidoYCalendario(actividad:Actividad)
  {
    let sec=this._sql.deleteCONTENIDOwithCALENDARIO(actividad);
    return sec;
  }

  translateToastAndAlertMsn()
  {
    let translateArr=
    [  
      'EN_ESTE_MOMENTO_I_MSN',
      'EN_ESTE_MOMENTO_F_MSN',
      'PROGRESS_PROYECTO_MSN'
    ]
    this.translateService.get(translateArr).subscribe(
      value => {
        // value is our translated string
        this.msnTranslate=value;
      }
    )
  }
}

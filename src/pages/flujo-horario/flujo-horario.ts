import { Horario } from './../../models/horario';
import { Proyecto } from './../../models/proyecto';
import { ProyectoProvider } from './../../providers/proyecto/proyecto';
import { Storage } from '@ionic/storage';
import { SqlitetaskServiceProvider } from './../../providers/sqlitetask-service/sqlitetask-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController,LoadingController} from 'ionic-angular';

import * as moment from 'moment';
import * as _ from 'lodash';

import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the FlujoHorarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-flujo-horario',
  templateUrl: 'flujo-horario.html',
})
export class FlujoHorarioPage {

public date_:any = [];
public hour_:any = [];
public horaInicioR:any=[];
public horaFinR:any=[];
public ha:any;
public hc:any;
public fi: any;
public ff: any;
public fechaTratada:any;
public proyectoList:Proyecto[];
public horario:Horario;
public horarioCompleto:any[];
public msnTranslate:any;
public colorList:any;
public colorList2:any;
public isCollapse:boolean=false;
public isCollapse2:boolean=false;
public colorListForView:any=
{noinicia:"#0000FF",enprogreso:"#338000",pendiente:"#DF0101",completada:"#d45500",cancelada:"#424242"};
  constructor(public navCtrl: NavController, public navParams: NavParams,public _sql:SqlitetaskServiceProvider,public storage:Storage,public _proyecto:ProyectoProvider,private translateService: TranslateService,public alertCtrl: AlertController,public toastCtrl: ToastController,public loadingCtrl: LoadingController) {    
    
    this.proyectoList=new Array();

  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad FlujoHorarioPage');
    this.translateToastAndAlertMsn();
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
        this._proyecto.listProyectos(idusuario)
        .then((proyectos:[Proyecto])=>{
          this.proyectoList=proyectos;
          this.ldismissLoading(loader);
        })
        .catch((e)=>{
          console.log("Error al listar proyectos");
          this.ldismissLoading(loader);
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        });
      }else{
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    });
  }
  
  changeDateFin()
  {
    if(this.horaInicioR!=null || this.horaFinR!=null)
    {
      this.ha = moment(this.horaInicioR, 'HH:mm');
      this.hc = moment(this.horaFinR, 'HH:mm');
    }else{
      this.ha = moment('00:00', 'HH:mm');
      this.hc = moment('23:59', 'HH:mm');
    }   

    // HORA    
    while (this.ha.isBefore(this.hc)) {
      this.hour_.push({
        "hora": this.ha.format('HH:mm'),        
      });
      this.ha.add(15, 'minutes');  
    }
    console.log(this.hour_);
    this.generarHorario(moment(this.fi),moment(this.ff));
  }

  ocultarProyecto(item:Proyecto,i,estado)
  {
    if(estado==true)
    {
      this.proyectoList[i].estadoAnim=false;
      // this.horarioCompleto.forEach(element => {
      //   console.log("Inicio de elemento");
      //   console.log(element);
      //   if(element.pro.idproyecto==item.idproyecto)
      //   {
      //     element.visible=false;
      //   }
      // });
      this.generarHorario(moment(this.fi),moment(this.ff));
    }else if(estado==false){
      this.proyectoList[i].estadoAnim=true;
      this.generarHorario(moment(this.fi),moment(this.ff));
    }    
    
  }

  generarHorario(prevDate,nextDate)
  {
    
    var date_=[];
    this.ha = moment(this.horaInicioR, 'HH:mm');
    this.hc = moment(this.horaFinR, 'HH:mm');    
    if(moment(nextDate).isSameOrAfter(moment(prevDate)))
    {
      // var prevDate = moment().subtract(15, 'days');
      // var nextDate = moment().add(15, 'days');      
      // FECHA
      while (prevDate.isBefore(nextDate)) {
        this.ha = moment(this.horaInicioR, 'HH:mm');
        this.hc = moment(this.horaFinR, 'HH:mm');   
        var o={};
        // HORA
        var hour=[];      
        while (this.ha.isBefore(this.hc)) {          
          hour.push({
          "hora": this.ha.format('H:mm:ss'),          
          "horarioItem":{}          
          });
          this.ha.add(15, 'minutes');  
          console.log("())))");
        }
        // console.log(hour);
        o['horario']=hour;
        o['DateText']=prevDate.format('ddd - Do MMM');
        o['Date']=  prevDate.format('DD/MM/YYYY');
        o['DateFormat']=prevDate;
        o['DateTrun']=prevDate.format('DD/MM');
        o['WeekNumber']=prevDate.week();             
        date_.push(o);
        prevDate.add(1, 'days');  
      }
      console.log("antes de ",date_);
      console.log("(x))))");
      this.tratamientoDeCalendario(this.fi,this.ff,date_);
    }
    
  }

  tratamientoDeCalendario(fechaInicial,fechaFinal,calendario)
  {
    console.log("calenarios Trata",calendario);
    fechaInicial=moment(fechaInicial).format('YYYY-MM-DD');
    fechaFinal=moment(fechaFinal).format('YYYY-MM-DD');
    this.storage.get('login').then((idusuario) => {
      if(idusuario!=null)
      {
        let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
        this._sql.queryBetweenDate(idusuario,fechaInicial,fechaFinal)
        .then((response)=>{
          console.log("Cargando datos",JSON.stringify(response));
          let rowsTable = [];
          this.horarioCompleto=[];          
          this.proyectoList.forEach((pro:Proyecto)=>{            
                let itemHorario={
                  "proyecto":pro,
                  "actividades":[],
                  "visible":pro.estadoAnim
                };  
                if(pro.estadoAnim)
                {
                  for (let index = 0; index < response.rows.length; index++) 
                  {
                    // console.log("Bucle de act=>",JSON.stringify(response.rows.item(index)));
                    this.horario=response.rows.item(index);            
                      if(this.horario.idproyecto==pro.idproyecto)
                      {         
                        // console.log("|||||  ZCVBGFNNBSBSDVDSVS=>",JSON.stringify(response.rows.item(index)));                             
                        rowsTable.push(this.horario);
                      }
                                            
                  }
                  itemHorario.actividades=this.agruparPorFecha(rowsTable);  
                  
                  this.horarioCompleto.push(itemHorario);   
                }                                                
                 
        });
          
               
        this.date_=this.asignarItemACalendario(this.horarioCompleto,calendario);
        this.ldismissLoading(loader);
        })
        .catch((e)=>{
          this.ldismissLoading(loader);
          console.log("Error tratamiento calendario=>",JSON.stringify(e));
        });
      }else{
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      }
    });    
  }

  agruparPorFecha(data:any[])
  {
    return _.chain(data)
    .groupBy("tiempoinicio")
    .toPairs()
    .map(function (currentItem) {
        return _.zipObject(["tiempoinicio", "items"], currentItem);
    })
    .value();    
  }

  asignarItemACalendario(horario,calendario)
  {

    console.log("asignarITem",calendario);    
    console.log(horario);    
    // horario=> Son las fechas-actividades dentro del rango, pertenecen al proyecto.
    // calendario=> Son las fechas sin actividades dentro del rango.

    // Calendario
        // o['horario']=hour;//Arreglo de horas horario.hora
        // o['DateText']=prevDate.format('ddd - Do MMM');
        // o['Date']=  prevDate.format('DD/MM/YYYY');
        // o['DateTrun']=prevDate.format('DD/MM');
        // o['WeekNumber']=prevDate.week();
        let arr=[];
        calendario.forEach((fecha,k)=>{
      // console.log("FECA1");
      // console.log(fecha); 
          
      horario.forEach(proyecto => {
        console.log(proyecto);
        console.log("aun no ",fecha);
        if(proyecto.visible)
        {
          console.log("entro",fecha);          
          proyecto.actividades.forEach(actividad => {                        
            //Actividad por fecha
            // {
            //   tiempoinicio:------,
            //   items:[
            //     {
            //       Objetos de tipo Horario
            //     },...
            //   ]
            // }
            if(moment(actividad.tiempoinicio).format('DD/MM/YYYY')==fecha.Date)
            {              
                fecha.horario.forEach((hora,i) => {
                  
                  actividad.items.forEach((itemHorario:Horario) => {
                    if(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes()==moment(hora.hora,'HH:m').format('HH:m'))                                      
                    {                                                                                        
                      // console.log(moment(moment(hora.hora,'HH:m').format('HH:m')));
                    // console.log(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes()));
                    // console.log(moment(moment(hora.hora,'HH:m').format('HH:m')).diff(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes())));
                    // console.log(moment(moment(hora.hora,'HH:m').format('HH:m'))>=(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes())));
                    // console.log(moment(moment(hora.hora,'HH:m').format('HH:m')).toString()>=(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes())).toString());
                      // console.log(moment(hora.hora,'HH:m').format('HH:m'));
                      // console.log(itemHorario.tiempofin);
                      // console.log(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes());
                      // console.log(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes(),'HH:m').format('HH:m'));
                      // console.log(moment(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes(),'HH:m').format('HH:m'),'HH:m'));
                      let hi= moment(moment(new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes(),'HH:m').format('HH:m'),'HH:m')
                      let hf= moment(moment(new Date(itemHorario.tiempofin.toString()).getUTCHours()+":"+new Date(itemHorario.tiempofin.toString()).getUTCMinutes(),'HH:m').format('HH:m'),'HH:m');
                      let tf= moment(moment(new Date(itemHorario.tiempofin.toString()).getUTCDate()+"/"+new Date(itemHorario.tiempofin.toString()).getUTCMonth()+"/"+new Date(itemHorario.tiempofin.toString()).getUTCFullYear()+" "+new Date(itemHorario.tiempofin.toString()).getUTCHours()+":"+new Date(itemHorario.tiempofin.toString()).getUTCMinutes(),'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm'),'DD/MM/YYYY HH:mm');
                      let ti;
                      // console.log("tiempo a priebsf",new Date(itemHorario.tiempofin.toString()).getUTCFullYear()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCMonth()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCDate()+"T"+new Date(itemHorario.tiempofin.toString()).getUTCHours()+":"+new Date(itemHorario.tiempofin.toString()).getUTCMinutes());
                      // console.log("tiempo a priebsi",new Date(itemHorario.tiempoinicio.toString()).getUTCFullYear()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCMonth()+"-"+new Date(itemHorario.tiempoinicio.toString()).getUTCDate()+"T"+new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes());
                      tf=moment(new Date(itemHorario.tiempofin.toString()).getUTCFullYear()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCMonth()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCDate()+"T"+new Date(itemHorario.tiempofin.toString()).getUTCHours()+":"+new Date(itemHorario.tiempofin.toString()).getUTCMinutes(),'YYYY-MM-DD HH:mm');
                      ti=moment(new Date(itemHorario.tiempoinicio.toString()).getUTCFullYear()+"-"+new Date(itemHorario.tiempofin.toString()).getUTCMonth()+"-"+new Date(itemHorario.tiempoinicio.toString()).getUTCDate()+"T"+new Date(itemHorario.tiempoinicio.toString()).getUTCHours()+":"+new Date(itemHorario.tiempoinicio.toString()).getUTCMinutes(),'YYYY-MM-DD HH:mm');
                      // console.log("dif en meses",tf.diff(ti,'years'));
                      // console.log("dif en meses",tf.diff(ti,'months'));
                      // console.log("dif en dias",tf.diff(ti,'days'));
                      // console.log("dif en horas",tf.diff(ti,'hours'));
                      // console.log("dif en minutos",tf.diff(ti,'minutes'));
                      let difYears=tf.diff(ti,'years');
                      let difMonths=tf.diff(ti,'months');
                      let difDays=tf.diff(ti,'days');
                      let difHours=tf.diff(ti,'hours');
                      let difMinutes=tf.diff(ti,'minutes');
                      let aux1=(difHours*60)/15;
                      
                      
                      let aux2=difMinutes/15
                      let auxTotal=aux2;

                      
                      // console.log("humanize",moment.duration(hi.diff(hf)).humanize());

                      // console.log("momentf");
                      let controlFecha=0;
                      let controlHora=i;
                      fecha.horario[i].horarioItem=itemHorario;                                            
                      for (let index = 0; index <= auxTotal; index++) {
                        // console.log("Comp");
                        // console.log(k+controlFecha);                        
                        // console.log(fecha.horario.length);
                        // console.log(i+index);
                        // console.log(calendario[k+controlFecha]);
                        // console.log("CompF");                      
                        if((controlHora+index)<fecha.horario.length)
                        {                          
                          calendario[k+controlFecha].horario[controlHora+index].horarioItem=itemHorario;                                                  
                        }else{
                          controlFecha++;
                          controlHora=0;                           
                          auxTotal=auxTotal-index;
                          index=0;
                          calendario[k+controlFecha].horario[controlHora+index].horarioItem=itemHorario; 
                        }                       
                      }
                   
                      
                    }                    
                  });                    
                });
            }
          });
        }       
      });
      
      // return fecha;
      
    });
    return calendario;
    // console.log(this.date_);
  }

  verificarJSON(o)
  {
    if(JSON.stringify(o)=='{}')
    {
      return false;
    }else{
      return true;
    }
  }

  detail(item:Horario)
  { 
    let tipo;
    if(item.tipo=='Proyecto') 
    {
      tipo=this.msnTranslate.TIPO_UNICO;
    }else if(item.tipo=='Comun') {
      tipo=this.msnTranslate.TIPO_RECURRENTE;
    }
    this.showAlert(this.msnTranslate.DETALLE,`<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:`+item.actnombre+`(`+this.colorList2[item.estado+'1']+`)</strong></div>`    
    +`<div><strong>`+this.msnTranslate.TIPO_UNICO+`/`+this.msnTranslate.TIPO_RECURRENTE+`:</strong>`+tipo+`</div>`
    +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.actdescripcion+`</div>`
    +`<div><strong>`+this.msnTranslate.PROYECTO+`:</strong>`+item.pronombre+`</div>`
    +`<div><strong>`+this.msnTranslate.CATEGORIA+`:</strong>`+item.catnombre+`</div>`
    +`<div><strong>`+this.msnTranslate.ESFUERZO_NECESARIO+`:</strong>`+item.peso+`</div>`);
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

  presentToast(msn)
  {
    let toast = this.toastCtrl.create({
      message: msn,
      duration: 3000,
      position: 'top'
    });
    toast.present();
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

  collapse(indicador)
  {
    switch(indicador)
    {
      case 1:
        if(this.isCollapse)
          this.isCollapse=false;
        else
          this.isCollapse=true;
      break;
      case 2:
        if(this.isCollapse2)
          this.isCollapse2=false;
        else
          this.isCollapse2=true;
      break;
    }

  }

}



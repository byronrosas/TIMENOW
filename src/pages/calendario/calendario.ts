import { Usuario } from './../../models/usuario';
import { Nota } from './../../models/nota';

import { WelcomePage } from './../welcome/welcome';
import { LoginPage } from './../login/login';
import { Proyecto } from './../../models/proyecto';
import { CalendarioProvider } from './../../providers/calendario/calendario';
import { Calendario } from './../../models/calendario';
import { Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, PopoverController, Slides, Platform, ToastController,LoadingController,ModalController} from 'ionic-angular';
import { ProyectoProvider } from '../../providers/proyecto/proyecto';
import { Storage } from '@ionic/storage';
import { trigger,state,style, transition, animate } from '@angular/animations';

import { TranslateService } from '@ngx-translate/core';
import { PopoverSettingsComponent } from './../../components/popover-settings/popover-settings';


import * as moment from 'moment';
import * as _ from 'lodash';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { ViewChild } from '@angular/core';
import { notImplemented } from '../../../node_modules/@angular/core/src/render3/util';



// import * as kf from './keyframes';
/**
 * Generated class for the CalendarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
// @Component({
//   selector: 'page-calendario',
//   templateUrl: 'calendario.html',
//   animations: [
//     trigger('itemState', [
//       transition('* => bounceOutLeft',animate(1000,keyframes(kf.bounceOutLeft))),
//     ])
//   ]
// })

@Component({
    selector: 'page-calendario',
    templateUrl: 'calendario.html',
    animations: [
      trigger('visibility', [
          state('in', style({
              opacity: 1              
          })),
          state('out', style({
              opacity: 0
          })),
          transition('* => *', animate('.5s'))
      ])
    ]   
  })
export class CalendarioPage {
  @ViewChild('slides') slides: Slides;
  
  

  searchQuery: string = '';
  public calendario:Calendario;
  public calendarioList:any[]=[];
  public calendarioListToday:any[]=[];
  public calendarioListTomorrow:any[]=[];
  public calendarioListTwoDays:any[]=[];
  public calendarioListThreeDays:any[]=[];
  public idusuario:number;
  public notas:any[];
  public nota:Nota;
  public proyectoList:Proyecto[];
  public usuario:Usuario;
  public username:string;
  visibility = 'shown'; 
  animationState:string;
  swiper:any;
  idioms: any[] = [];
  today:any= moment();
  tomorrow:any=moment().add(1, 'days');
  TwoDays:any=moment().add(2, 'days');
  ThreeDays:any=moment().add(3, 'days');
  public colorList:any;   
  public colorList2:any; 
  

  public colorListForView:any=
  {noinicia:"#0000FF",enprogreso:"#338000",pendiente:"#DF0101",completada:"#d45500",cancelada:"#424242"};
  public msnTranslate:any;

    
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public navParams: NavParams,public _calendario:CalendarioProvider,public storage: Storage,public _proyecto:ProyectoProvider,private translateService: TranslateService,public alertCtrl: AlertController,private toastCtrl: ToastController,private admobFree: AdMobFree, public loadingCtrl: LoadingController,private modal: ModalController) {

    // CONFIG BANNER    
    this.nota=new Nota();
    this.nota.estadoTap=true;
    this.nota.isCollapse=false;
    this.nota.arrIcons=[{id:"notifications",class:"",activ:false},{id:"mail",class:"",activ:false},{id:"call",class:"",activ:false},{id:"basket",class:"",activ:false},{id:"basket",class:"",activ:false},{id:"briefcase",class:"",activ:false},{id:"bus",class:"",activ:false},{id:"cafe",class:"",activ:false}];
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true
     };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare()
    .then(() => {
      // banner Ad is ready
      // if we set autoShow to false, then we will need to call the show method here
      console.log("Listo banner");
    })
    .catch(e => console.log(e));
    this.calendario=new Calendario();    
    this.idioms = [
      {
        value: 'es',
        label: '',
        chk:false
      },
      {
        value: 'en',
        label: '',
        chk:false        
      }
    ];
       
  }


  onIonDrag(event){
    this.swiper = event;
    this.swiper.lockSwipes(true);
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad CalendarioPage');  
    
    this.translateToastAndAlertMsn();
    
    
    this.translateService.get(["noinicia","enprogreso","pendiente","completada","cancelada"])
    .subscribe((translate)=>{      
          
          this.colorList=
          [            
            {estado:"noinicia",value:translate.noinicia,noinicia1:translate.noinicia,noinicia:"#0000FF"},    
            {estado:"enprogreso",value:translate.enprogreso,enprogreso1:translate.enprogreso,enprogreso:"#338000"},
            {estado:"pendiente",value:translate.pendiente,pendiente1:translate.pendiente,pendiente:"#DF0101"},
            {estado:"completada",value:translate.completada,completada1:translate.completada,completada:"#d45500"},
            {estado:"cancelada",value:translate.cancelada,cancelada1:translate.cancelada,cancelada:"#424242"}
          ];
          this.colorList2=
          {            
            "noinicia1":translate.noinicia,
            "enprogreso1":translate.enprogreso,
            "pendiente1":translate.pendiente,
            "completada1":translate.completada,
            "cancelada1":translate.cancelada,
          };  

    });
    
    
    this.notas=[];
    this.calendarioList=[];
    this.calendarioListToday=[];
    this.calendarioListTomorrow=[];
    this.calendarioListTwoDays=[];
    this.calendarioListThreeDays=[];

    Promise.all([this.storage.get('login'),this.storage.get('user')]).then((values) => {
      let idusuario=values[0];
      this.usuario=values[1];
      this.username=this.usuario.nombre;      
      if(idusuario!=null)
      {

        let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
        this.idusuario=idusuario;
        Promise.all([this._proyecto.listProyectos(idusuario),this._calendario.listCalendarios(idusuario),this._calendario.listNotas(idusuario)])
        .then((values)=>
        {
          let proyectos=values[0]; 
          this.proyectoList=proyectos;
          let nota=values[2];
          this.notas=nota;
          let calendario=values[1];
          this.calendarioList=calendario;           
          _.map(this.calendarioList,(calendario)=>{            
            if(calendario.tiempofin!=null && calendario.tiempoinicio!=null )
            {
              let tiempoInicio=moment(new Date(calendario.tiempoinicio).getFullYear()+'-'+new Date(calendario.tiempoinicio).getMonth()+'-'+new Date(calendario.tiempoinicio).getUTCDate()).format('YYYY MM DD');
              let tiempoFin=moment(new Date(calendario.tiempofin).getFullYear()+'-'+new Date(calendario.tiempofin).getMonth()+'-'+new Date(calendario.tiempofin).getUTCDate()).format('YYYY MM DD');              
              let tiempoActual=moment(new Date(this.today).getFullYear()+'-'+new Date(this.today).getMonth()+'-'+new Date(this.today).getDate()).format('YYYY MM DD');
              let tiempoUndia=moment(new Date(this.tomorrow).getFullYear()+'-'+new Date(this.tomorrow).getMonth()+'-'+new Date(this.tomorrow).getDate()).format('YYYY MM DD');
              let tiempoDosDias=moment(new Date(this.TwoDays).getFullYear()+'-'+new Date(this.TwoDays).getMonth()+'-'+new Date(this.TwoDays).getDate()).format('YYYY MM DD');
              let tiempoTresDias=moment(new Date(this.ThreeDays).getFullYear()+'-'+new Date(this.ThreeDays).getMonth()+'-'+new Date(this.ThreeDays).getDate()).format('YYYY MM DD');
              calendario.fi=new Date(calendario.tiempoinicio).getUTCDate()+"/"+(new Date(calendario.tiempoinicio).getMonth()+1)+"/"+new Date(calendario.tiempoinicio).getFullYear();
              calendario.ff=new Date(calendario.tiempofin).getUTCDate()+"/"+(new Date(calendario.tiempofin).getMonth()+1)+"/"+new Date(calendario.tiempofin).getFullYear();
              calendario.hi=moment((new Date(calendario.tiempoinicio).getUTCHours()+":"+new Date(calendario.tiempoinicio).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
              calendario.hf=moment((new Date(calendario.tiempofin).getUTCHours()+":"+new Date(calendario.tiempofin).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
              if(moment(tiempoInicio).isSame(tiempoActual) || moment(tiempoFin).isSame(tiempoActual))
              {                
                this.calendarioListToday.push(calendario);                
              }
              
              if(moment(tiempoInicio).isSame(tiempoUndia) || moment(tiempoFin).isSame(tiempoUndia))
              {
                this.calendarioListTomorrow.push(calendario);
              }

              if(moment(tiempoInicio).isSame(tiempoDosDias) || moment(tiempoFin).isSame(tiempoDosDias))
              {
                this.calendarioListTwoDays.push(calendario);
              }

              if(moment(tiempoInicio).isSame(tiempoTresDias) || moment(tiempoFin).isSame(tiempoTresDias))
              {
                this.calendarioListThreeDays.push(calendario);
              }

            }
          });
          this.ldismissLoading(loader);
        })
        .catch(e=>{
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

modoEditarNota(nota:Nota)
{    
    if(nota.estadoTap)
      nota.estadoTap=false;
    else
      nota.estadoTap=true; 
}



collapse(nota:Nota)
{
  if(nota.isCollapse)
    nota.isCollapse=false;
  else
    nota.isCollapse=true;
}
saveNota()
{
  if(this.nota.descripcion!='' && this.nota.descripcion!=null)
  {
    console.log("Estamos guardando nota");
    this.nota.estadoTap=false;
    this.nota.isCollapse=false;
    this.nota.idusuario=this.idusuario;
    this._calendario.saveNota(this.nota)
    .then(()=>{
      this.listarNotas();
      this.nota=new Nota();
      this.nota.descripcion='';
      this.nota.estadoTap=true;
      this.nota.isCollapse=false;      
    })
    .catch((e)=>{
      console.log(e);
      this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
    });
  }  
}

checkBlur(nota:Nota)
{
  if(nota.descripcion!='' && nota.descripcion!=null)
  {
    if(nota.tiempo!=null)
    {
      if(moment(nota.tiempo.toString()).isBefore(new Date()))
      {
        let msn1=this.msnTranslate.FECHA_VALIDACION_MSN;
        this.presentToast(msn1);  
      }else{
        this.saveN(nota);
      }
    }else{
      this.saveN(nota);
    }  
  }    
}

saveN(nota)
{
  console.log("Estamos guardando nota");
      nota.estadoTap=false;
      nota.arrIcons.forEach(element => {
        if(element.activ && nota.etiqueta1!=element.id)
        {
          nota.etiqueta1=element.activ;
        }
        if(element.activ && nota.etiqueta2!=element.id)
        {
          nota.etiqueta2=element.activ;
        }
        if(element.activ && nota.etiqueta3!=element.id)
        {
          nota.etiqueta3=element.activ;
        }
        if(element.activ && nota.etiqueta4!=element.id)
        {
          nota.etiqueta4=element.activ;
        }
      });
      this._calendario.updateNota(nota)
      .then(()=>{
        this.listarNotas();       
      })
      .catch(()=>{
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });  
}

eliminarNota(nota:Nota)
{
  this._calendario.deleteNota(nota)
  .then(()=>
  {
    this.listarNotas();
  })
  .catch((e)=>{
    console.log("Error al eliminar notas",e);
    this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
  });
}
validarFechaMayor(nota:Nota)
{
  if(moment(nota.tiempo.toString()).isBefore(new Date()))
  {
    let msn1=this.msnTranslate.FECHA_VALIDACION_MSN;
    this.presentToast(msn1);  
  }
}
cambioEstadoIcon(nota:Nota,indiceIco)
{
  if(nota.arrIcons[indiceIco].class=="" && !nota.arrIcons[indiceIco].activ)
  {
    nota.arrIcons[indiceIco].class="icon-etiqueta";
    nota.arrIcons[indiceIco].activ=true;
  }else{
    nota.arrIcons[indiceIco].class="";
    nota.arrIcons[indiceIco].activ=false;
  }
}
checkFocus(nota:Nota)
{
  console.log("Estamos creando nota");
  nota.estadoTap=true;

}

listarNotas()
{
  this.storage.get('login')
  .then((idusuario) => {
    if(idusuario!=null)
    {
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this.notas=[];
      this._calendario.listNotas(idusuario)
      .then((nota:[any])=>{

        this.notas=nota;
        console.log("notasllisto");
        console.log(this.notas);
        this.ldismissLoading(loader);                                 
      })
      .catch(e=>{
        this.ldismissLoading(loader);
        console.log("Error al listar calendarios",JSON.stringify(e));
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      });
    }else{
      this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
    }
  })
  .catch((e)=>{
    this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
  }); 
}


changeSlide(index,day,item)
{ 
 
  var estado="in";
  if(item.estadoAnim=="in")
  {
    estado="out";
    switch(day)
    {
          case 0:
          this.calendarioListToday[index].estadoAnim =estado;
          break;
          case 1:
          this.calendarioListTomorrow[index].estadoAnim =estado;
          break;
          case 2:
          this.calendarioListTwoDays[index].estadoAnim =estado;
          break;
          case 3:
          this.calendarioListThreeDays[index].estadoAnim =estado;
          break;
    } 
  }else if(item.estadoAnim=="out"){
    estado="in";
    switch(day)
    {
          case 0:
          this.calendarioListToday[index].estadoAnim =estado;
          break;
          case 1:
          this.calendarioListTomorrow[index].estadoAnim =estado;
          break;
          case 2:
          this.calendarioListTwoDays[index].estadoAnim =estado;
          break;
          case 3:
          this.calendarioListThreeDays[index].estadoAnim =estado;
          break;
    } 
  }

}
  // startAnimation(state)
  // {
  //   console.log(state);
  //   if(!this.animationState)
  //   {
  //     this.animationState=state;
  //   }
  // }
  // resetAnimationState()
  // {
  //   this.animationState='';    
  // }
  toogleNotaVisibility(e,index,nDias)
  {
    if(e.direction==2){
      this.notas[index].estadoAnim ='out';
      this.eliminarNota(this.notas[index]);
    }else if(e.direction==4){
      this.mostrarNota(this.notas[index])
    } 
  }
  toggleVisibility(e,index,nDias) {    
    if(e.direction==2){
      //Izquierda      
      switch(nDias)
      {
        case 0:
        this.calendarioListToday[index].estadoAnim ='out';
        break;
        case 1:
        this.calendarioListTomorrow[index].estadoAnim ='out';
        break;
        case 2:
        this.calendarioListTwoDays[index].estadoAnim ='out';
        break;
        case 3:
        this.calendarioListThreeDays[index].estadoAnim ='out';
        break;
      }      
      // this.calendarioList[index].estadoAnim = this.calendarioList[index].estadoAnim == 'in' ? 'out' : 'in';      
    }else if(e.direction==4)
    {
      //Derecha
      switch(nDias)
      {
        case 0:
        this.calendarioListToday[index].estadoAnim ='in';
        break;
        case 1:
        this.calendarioListTomorrow[index].estadoAnim ='in';
        break;
        case 2:
        this.calendarioListTwoDays[index].estadoAnim ='in';
        break;
        case 3:
        this.calendarioListThreeDays[index].estadoAnim ='in';
        break;
      }       
      // this.calendarioList[index].estadoAnim = this.calendarioList[index].estadoAnim == 'in' ? 'out' : 'in';
    }
    
  }
  mostrarNota(nota:Nota)
  {
    this.showAlert(this.msnTranslate.DETALLE,`<div><strong>`+nota.descripcion+`</strong></div>`);
  }
  mostrar(item:Calendario)
  {
    this.showAlert(this.msnTranslate.DETALLE,`<div><strong>`+this.msnTranslate.CTP_NOMBRE+`:`+item.actnombre+`(`+this.colorList2[item.estado+'1']+`)</strong></div>`
  +`<div><strong>`+this.msnTranslate.CTP_DESCRIPCION+`:</strong>`+item.actdescripcion+`</div>`
  +`<div><strong>`+this.msnTranslate.PROYECTO+`:</strong>`+item.pronombre+`</div>`
  +`<div><strong>`+this.msnTranslate.CATEGORIA+`:</strong>`+item.catnombre+`</div>`
  +`<div><strong>`+this.msnTranslate.ESFUERZO_NECESARIO+`:</strong>`+item.peso+`</div>`);
  }

  tapEvent(e,index,estado,nDias) {
    console.log(estado);       
    if(estado=='in')
    {
      console.log("Ver detalle",index); 
      switch(nDias)
      {
        case 0:
        this.calendario=this.calendarioListToday[index];
        break;
        case 1:
        this.calendario=this.calendarioListTomorrow[index];
        break;
        case 2:
        this.calendario=this.calendarioListTwoDays[index];
        break;
        case 3:
        this.calendario=this.calendarioListThreeDays[index];
        break;        
      }        
            
    }
    else if(estado=='out'){      
      console.log("Out");
      switch(nDias)
      {
        case 0:
        this.calendario=this.calendarioListToday[index];
        break;
        case 1:
        this.calendario=this.calendarioListTomorrow[index];
        break;
        case 2:
        this.calendario=this.calendarioListTwoDays[index];
        break;
        case 3:
        this.calendario=this.calendarioListThreeDays[index];
        break;                  
      }

      
    }
    
    this.showConfirm(this.msnTranslate.BTN_ELIMINAR,this.msnTranslate.SUG_ELIMINAR_MSN,this.msnTranslate.BTN_CANCELAR,this.msnTranslate.BTN_ELIMINAR+'!',()=>{
      console.log("Eliminación cancelada");

    },()=>{
      console.log("Eliminando...",index);
      let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
      this._calendario.removeCalendario(this.calendario)
      .then(()=>{
        this.ldismissLoading(loader);
        this.showAlert(this.msnTranslate.ELIMINAR,this.msnTranslate.ELIMINAR_MSN);
      })
      .catch((e)=>{
        this.ldismissLoading(loader);
        console.log("Error eliminando->",JSON.stringify(e));
        this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_MSN);
      });
    });
    // if(e.direction==2){
    //   //Izquierda
      // this.calendarioList.splice(index,1);      
    // }else if(e.direction==4)
    // {
    //   //Derecha
    //   console.log(index);
    // }    
  }

  presentPopoverSettings() {
    const popover = this.popoverCtrl.create(PopoverSettingsComponent);
    popover.present();
    
    popover.onDidDismiss(popoverData=>{
      console.log(popoverData);
      if(popoverData!=null)
      {
        switch(popoverData.id)
        {
          case 1:

          break;
          case 2:

          break;
          case 3:
            this.storage.get('lang').then((lang)=>{            
              if(lang=='es' || lang=='Spanish')
              {
                this.idioms[0].chk=true;
                this.idioms[1].chk=false;
                this.showRadioLanguaje();
              }else if(lang=='en' || lang=='English')
              {
                this.idioms[0].chk=false;
                this.idioms[1].chk=true;
                this.showRadioLanguaje();
              }
            })
            .catch(e=>console.log("Error en variable de sesion lang"));          
          break;
          case 4:
            Promise.all([this.storage.remove('login'),this.storage.remove('user')])
            .then(()=>{
                return this.storage.get('login')
                .then((datalogin)=>{
                  if(datalogin==null)
                  {
                      this.navCtrl.push('WelcomePage')
                      .then(()=>{
                        const startIndex = this.navCtrl.getActive().index;
                        this.navCtrl.remove(startIndex-1);
                      });
                  }                  
                });
            })
            .catch((e)=>{
              console.error("Error logout:=>",e);
              this.showAlert(this.msnTranslate.ERROR,this.msnTranslate.ERROR_SESION_MSN);
            });
          break;
        }                          
      }      
    });
  }

  chooseLanguaje(lang) {
    this.translateService.use(lang);  
    console.log("lang",lang);  
    this.storage.set('lang',lang);
  }

  showRadioLanguaje() {
    let alert = this.alertCtrl.create();
    this.translateService.get(["ESPANOL","INGLES"])
    .subscribe((translate)=>{      
      this.idioms[0].label=translate.ESPANOL;
      this.idioms[1].label=translate.INGLES;      
      alert.setTitle('Lightsaber color');
    this.idioms.forEach(element => {
      alert.addInput({
        type: 'radio',
        label: element.label,
        value: element.value,
        checked: element.chk
      });      
    });
    
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
       console.log(data);
       this.chooseLanguaje(data);
      }
    });
    alert.present();
    });
    
    
    
  }


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

  radioChecked(item,estado)
  {    
    item.estado=estado;
    this._calendario.updateCalendario(item)
    .then((r)=>{
      console.log("Update");
      this.presentToast("Actuañ :(");      
      this.presentToast(this.msnTranslate.ESTADO_ACT_MSN+" "+this.colorList2[item.estado+'1']);
           
            Promise.all([this._proyecto.completadosProyecto(item.idproyecto),this._proyecto.listCalendarioPorProyecto(item.idproyecto)])
            .then((values:any)=>{
              let completadosTotalq=0;
              if(values[1].rows.length!=0)
              {
                 completadosTotalq=(100*values[0].length)/values[1].rows.length;
              }   
              
              console.log("Cargado de completados",completadosTotalq);                            
              this._calendario.notificationLoad(item.idproyecto,completadosTotalq,new Date());
            })
            .catch((e)=>{
              console.log("Error al tomar completados=>",JSON.stringify(e));
              
              this.showAlert('',this.msnTranslate.ERROR_MSN+JSON.stringify(e));
            });        
       
      this.listarCalendario(); 
    })
    .catch(()=>{
      this.presentToast(this.msnTranslate.ERROR_MSN);
    });
  }




  listarCalendario()
  {
    this.storage.get('login')
      .then((idusuario) => {
        if(idusuario!=null)
        {
          let loader=this.lpresentLoadingCustom(this.msnTranslate.CARGANDO);    
          this.calendarioList=[];          
          this.calendarioListToday=[];
          this.calendarioListTomorrow=[];
          this.calendarioListTwoDays=[];
          this.calendarioListThreeDays=[];
          this._calendario.listCalendarios(idusuario)
          .then((calendario:[any])=>{

            this.calendarioList=calendario;                                  
            _.map(this.calendarioList,(calendario)=>{            
              if(calendario.tiempofin!=null && calendario.tiempoinicio!=null )
              {
                let tiempoInicio=moment(new Date(calendario.tiempoinicio).getFullYear()+'-'+new Date(calendario.tiempoinicio).getMonth()+'-'+new Date(calendario.tiempoinicio).getDate()).format('YYYY MM DD');
                let tiempoFin=moment(new Date(calendario.tiempofin).getFullYear()+'-'+new Date(calendario.tiempofin).getMonth()+'-'+new Date(calendario.tiempofin).getDate()).format('YYYY MM DD');              
                let tiempoActual=moment(new Date(this.today).getFullYear()+'-'+new Date(this.today).getMonth()+'-'+new Date(this.today).getDate()).format('YYYY MM DD');
                let tiempoUndia=moment(new Date(this.tomorrow).getFullYear()+'-'+new Date(this.tomorrow).getMonth()+'-'+new Date(this.tomorrow).getDate()).format('YYYY MM DD');
                let tiempoDosDias=moment(new Date(this.TwoDays).getFullYear()+'-'+new Date(this.TwoDays).getMonth()+'-'+new Date(this.TwoDays).getDate()).format('YYYY MM DD');
                let tiempoTresDias=moment(new Date(this.ThreeDays).getFullYear()+'-'+new Date(this.ThreeDays).getMonth()+'-'+new Date(this.ThreeDays).getDate()).format('YYYY MM DD');
                
                calendario.hi=moment((new Date(calendario.tiempoinicio).getUTCHours()+":"+new Date(calendario.tiempoinicio).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
                calendario.hf=moment((new Date(calendario.tiempofin).getUTCHours()+":"+new Date(calendario.tiempofin).getUTCMinutes()).toString(),'HH:mm').format('HH:mm a');
                if(moment(tiempoInicio).isSame(tiempoActual) || moment(tiempoFin).isSame(tiempoActual))
                {                
                  this.calendarioListToday.push(calendario);                
                }
                
                if(moment(tiempoInicio).isSame(tiempoUndia) || moment(tiempoFin).isSame(tiempoUndia))
                {
                  this.calendarioListTomorrow.push(calendario);
                }
  
                if(moment(tiempoInicio).isSame(tiempoDosDias) || moment(tiempoFin).isSame(tiempoDosDias))
                {
                  this.calendarioListTwoDays.push(calendario);
                }
  
                if(moment(tiempoInicio).isSame(tiempoTresDias) || moment(tiempoFin).isSame(tiempoTresDias))
                {
                  this.calendarioListThreeDays.push(calendario);
                }
  
              }
            });
            this.ldismissLoading(loader);                                 
          })
          .catch(e=>{
            this.ldismissLoading(loader);
            console.log("Error al listar calendarios",JSON.stringify(e));
            this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
          });
        }else{
          this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
        }
      })
      .catch((e)=>{
        this.presentToast(this.msnTranslate.ERROR_LIST_MSN);
      });  
  }

  showAlert(title,msn) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle:msn,
      buttons: ['OK']
    });
    alert.present();
  }

  next() {
    if(this.swiper){
      this.swiper.lockSwipes();
    }
    this.slides.slideNext();
  }

  prev() {
    if(this.swiper){
      this.swiper.lockSwipes();
    }
    this.slides.slidePrev();
  }




 presentToast(msn) {
  let toast = this.toastCtrl.create({
    message: msn,
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
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

  openModalInstrucciones()
  {
    const modalInstrucciones=this.modal.create('ModalInstruccionesPage');
    modalInstrucciones.present();
  }
}

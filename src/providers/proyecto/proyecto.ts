import { Calendario } from './../../models/calendario';
import { Proyecto } from './../../models/proyecto';
import { Storage } from '@ionic/storage';
import { SqlitetaskServiceProvider } from './../sqlitetask-service/sqlitetask-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ProyectoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProyectoProvider {

  constructor(public http: HttpClient,public _sql:SqlitetaskServiceProvider) {
    console.log('Hello ProyectoProvider Provider');
  }

  createProyecto(proyecto:Proyecto)
  {
    console.log("Creando proyecto...");
    let sec=this._sql.createPROYECTO(proyecto);
    return sec;
  }

  listProyectos(idusuario:number)
  {
    console.log("Listando Proyectos...");
    let sec=this._sql.listAllByUserPROYECTOInnerCATEGORIA("PROYECTO",idusuario);
    sec.then((t)=>{      
      console.log("Listado de proyectos listo :)");
      console.log(JSON.stringify(t));
      return t;
      
    })
    .catch((e)=>console.log("Hola registro error",JSON.stringify(e)));
    return sec;
  }

  listCalendarioPorProyecto(idproyecto:number)
  {
    console.log("Listando Calendarios...");
    let sec=this._sql.queryPROYECTOwithCALENDARIO(idproyecto);
    sec.then((t)=>{      
      console.log("Listado de calendarios por proyecto listo :)");
      console.log(JSON.stringify(t));      
      return t;
      
    })
    .catch((e)=>console.log("Hola registro error en calendarios por proyecto"));
    return sec;    
  }

  completadosProyecto(idproyecto:number)
  {
    return this.listCalendarioPorProyecto(idproyecto)
    .then((allCalByPro)=>{
      console.log("Pro",JSON.stringify(allCalByPro.rows));
      var t=[];
      for (let index = 0; index < allCalByPro.rows.length; index++) {
        if(allCalByPro.rows.item(index).estado=="completada")
        {
          t.push(allCalByPro.rows.item(index));       
        }
      }      
      return t      
    })
    .catch((e)=>{
      console.log("Error completados Proyecto=>",JSON.stringify(e));
    });
  }

  canceladosProyecto(idproyecto:number)
  {
    return this.listCalendarioPorProyecto(idproyecto)
    .then((allCalByPro)=>{
      console.log("Pro",JSON.stringify(allCalByPro.rows));
      let t=[];
      for (let index = 0; index < allCalByPro.rows.length; index++) {
        if(allCalByPro.rows.item(index).estado=="cancelada")
        {
          t.push(allCalByPro.rows.item(index));       
        }
      }      
      return t
    })
    .catch((e)=>{
      console.log("Error cancelados Proyecto=>",JSON.stringify(e));
    });
  }

  noIniciadosProyecto(idproyecto:number)
  {
    return this.listCalendarioPorProyecto(idproyecto)
    .then((allCalByPro)=>{
      console.log("Pro",JSON.stringify(allCalByPro.rows));
      let t=[];
      for (let index = 0; index < allCalByPro.rows.length; index++) {
        if(allCalByPro.rows.item(index).estado=="noinicia")
        {
          t.push(allCalByPro.rows.item(index));       
        }
      }      
      return t
    })
    .catch((e)=>{
      console.log("Error no inicia Proyecto=>",JSON.stringify(e));
    });   

  }

  enProgresoProyecto(idproyecto:number)
  {
    return this.listCalendarioPorProyecto(idproyecto)
    .then((allCalByPro)=>{
      console.log("Pro",JSON.stringify(allCalByPro.rows));
      let t=[];
      for (let index = 0; index < allCalByPro.rows.length; index++) {
        if(allCalByPro.rows.item(index).estado=="enprogreso")
        {
          t.push(allCalByPro.rows.item(index));       
        }
      }      
      return t
    })
    .catch((e)=>{
      console.log("Error en progreso Proyecto=>",JSON.stringify(e));
    });   
  }

  pendientes(idproyecto:number)
  {
    return this.listCalendarioPorProyecto(idproyecto)
    .then((allCalByPro)=>{
      console.log("Pro",JSON.stringify(allCalByPro.rows));
      let t=[];
      for (let index = 0; index < allCalByPro.rows.length; index++) {
        if(allCalByPro.rows.item(index).estado=="pendiente")
        {
          t.push(allCalByPro.rows.item(index));       
        }
      }      
      return t
    })
    .catch((e)=>{
      console.log("Error pendiente Proyecto=>",JSON.stringify(e));
    });
  }

  removeProyecto(proyecto:Proyecto)  
  {
    let sec=this._sql.deletePROYECTO(proyecto);
    return sec;
  }

  removeProyectoYCalendario(proyecto:Proyecto)
  {
    let sec=this._sql.deletePROYECTOwithCALENDARIO(proyecto);
    return sec;
  }
  
  updateProyecto(proyecto:Proyecto)  
  {
    let sec=this._sql.updatePROYECTO(proyecto);
    return sec;
  }


}

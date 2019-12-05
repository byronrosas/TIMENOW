import { Proyecto } from './proyecto';
import { Actividad } from './actividad';
import { DateTime } from "ionic-angular/umd";

export class Horario {    
    constructor(
        public idcalendario?: number, 
        public idrepeticion?: number,
        public tiempoinicio?: DateTime, 
        public tiempofin?:DateTime,
        public peso?:number, 
        public estado?:string,
        public tipo?:string,
        public idactividad?:number,        
        public idproyecto?:number,
        public pronombre?:string,
        public proetiqueta?:string,
        public proprioridad?:string,
        public actnombre?:string,
        public actdescripcion?:string,
        public catidcategoria?:number,
        public catnombre?:string,         
        public estadoAnim?:string        
           ){
    }    
 }
 //Estados: noinicia,enprogreso, pendiente, completada, cancelada.
 //tipo: Proyecto, Comun
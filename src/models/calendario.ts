import { Proyecto } from './proyecto';
import { Actividad } from './actividad';
import { DateTime } from "ionic-angular/umd";

export class Calendario {    
    constructor(
        public idcalendario?: number, 
        public idrepeticion?: number,
        public tiempoinicio?: String, 
        public tiempofin?:String,
        public peso?:number, 
        public estado?:string,
        public tipo?:string,
        public idactividad?:number,        
        public idproyecto?:number,
        public pronombre?:string,
        public proetiqueta?:string,
        public actnombre?:string,
        public actdescripcion?:string,
        public actetiqueta?:string,
        public catidcategoria?:number,
        public catnombre?:string,
        public estadoAnim?:string ,
        public fi?:string,
        public ff?:string,
        public anioi?:string,
        public aniof?:string,
        public hi?:string,
        public hf?:string,
           ){
    }    
 }
 //Estados: noinicia,enprogreso, pendiente, completada, cancelada.
 //tipo: Proyecto, Comun
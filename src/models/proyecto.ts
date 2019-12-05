import { Calendario } from './calendario';
import { DateTime } from '../../node_modules/ionic-angular/umd';
export class Proyecto {    
    constructor(
        public idproyecto?: number, 
        public nombre?: string, 
        public descripcion?:string,
        public prioridad?:number, 
        public idcategoria?:number,
        public idusuario?:number,
        public estado?:string,
        public etiqueta?:string,
        public fechaplaneada?:DateTime,
        public listCalendarios?:Calendario[],
        public catnombre?:string,
        public estadoAnim?:boolean
    ){
    }    

    addCalendario(calendario:Calendario){        
        this.listCalendarios.push(calendario);
    }
 
    removeCalendario(calendario:Calendario){
        let i;
        for(i = 0; i < this.listCalendarios.length; i++) {
            if(this.listCalendarios[i].idcalendario == calendario.idcalendario){
                this.listCalendarios.splice(i, 1);
            }
        }
 
    }
 }
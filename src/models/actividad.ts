import { Categoria } from './categoria';
import { Calendario } from './calendario';
export class Actividad {    
    constructor(
        public idactividad?: number, 
        public nombre?: string, 
        public etiqueta?:string,
        public descripcion?:string,                 
        public idcategoria?:number, 
        public catnombre?:string,       
        public categoria?:Categoria,        
        public listCalendarios?:Calendario[]){
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
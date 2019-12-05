import { Actividad } from './actividad';
import { Proyecto } from './proyecto';
export class Categoria {    
    constructor(
        public idcategoria?: number, 
        public nombre?: string,  
        public descripcion?:string,
        public idusuario?:number,
        public listProyectos?:Proyecto[],
        public listActividades?:Actividad[]){
    } 
    
    addProyecto(proyecto:Proyecto){        
        this.listProyectos.push(proyecto);
    }
 
    removeProyecto(proyecto:Proyecto){
        let i;
        for(i = 0; i < this.listProyectos.length; i++) {
            if(this.listProyectos[i].idproyecto == proyecto.idproyecto){
                this.listProyectos.splice(i, 1);
            }
        }
 
    }

    addActividad(actividad:Actividad){        
        this.listActividades.push(actividad);
    }
 
    removeActividad(actividad:Actividad){
        let i;
        for(i = 0; i < this.listActividades.length; i++) {
            if(this.listActividades[i].idactividad == actividad.idactividad){
                this.listActividades.splice(i, 1);
            }
        }
 
    }
 }
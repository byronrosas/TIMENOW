import { Proyecto } from './proyecto';
export class Usuario {    
    constructor(
        public idusuario?: number, 
        public nombre?: string, 
        public password?:string,
        public correo?:string, 
        public estado?:string,
        public listProyectos?:Proyecto[]){
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
 }
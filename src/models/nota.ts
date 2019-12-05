import { DateTime } from 'ionic-angular/umd';
export class Nota {    
    constructor(
        public idnota?: number,         
        public descripcion?:string,
        public etiqueta1?:string,
        public etiqueta2?:string,
        public etiqueta3?:string,
        public etiqueta4?:string,
        public notificar?:number,
        public tiempo?: DateTime, 
        public idusuario?:number,
        public estadoTap?:boolean,
        public isCollapse?:boolean,
        public diff?:string,
        public arrIcons?:any,
        public estadoAnim?:string){
    } 
 }
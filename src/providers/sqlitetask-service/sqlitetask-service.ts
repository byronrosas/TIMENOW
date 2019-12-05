import { Nota } from './../../models/nota';
import { Validators } from '@angular/forms';
import { Calendario } from './../../models/calendario';
import { Proyecto } from './../../models/proyecto';
import { Actividad } from './../../models/actividad';
import { Categoria } from './../../models/categoria';
import { Usuario } from './../../models/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite,SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the SqlitetaskServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class SqlitetaskServiceProvider {

  private db: SQLiteObject = null;
  private isOpen:boolean;

  constructor(public http: HttpClient,public storage:SQLite) {
    console.log('Hello SqlitetaskServiceProvider Provider');
    if(!this.isOpen)
    {
      this.storage=new SQLite();
      this.createDatabase(); 
    }       

  }

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

      //SQLITE
  createDatabase(){
        this.storage.create({
          name: 'timenow.db',
          location: 'default' // the location field is required
        })
        .then((db) => {
          this.db=db;
          this.isOpen=true;
          console.log("DB Creada:",db);
          this.setDatabase(db);
          this.createTableUsuario()
          .then(()=>{
            console.log("TABLA USUARIO->Creada");
            this.createTableCategoria()
            .then(()=>{       
              console.log("TABLA CATEGORIA->Creada");               
              this.createTableProyecto()
              .then(()=>{
                console.log("TABLA PROYECTO->Creada");
                this.createTableCalendario()
                .then(()=>{
                  console.log("TABLA CALENDARIO->Creada");
                })
                .catch(e=> console.log("Error al crear la tabla CALENDARIO => ",e));
              })
              .catch(e=> console.log("Error al crear la tabla PROYECTO => ",e));
              this.createTableActividad()
              .then(()=>{
                  console.log("TABLA ACTIVIDAD->Creada");
              })
              .catch(e=> console.log("Error al crear la tabla ACTIVIDAD => ",e));

              // TABLA NOTAS
              this.createTableNota()
              .then(()=>{
                  console.log("TABLA NOTA->Creada");
              })
              .catch(e=> console.log("Error al crear la tabla ACTIVIDAD => ",e));
            })
            .catch(e=> console.log("Error al crear la tabla CATEGORIA => ",e));
          })
          .catch(e=> console.log("Error al crear la tabla USUARIO => ",e));                      
        })
        .catch(error =>{
          console.error(error);
        });
      } 

  //COMANDOS DE CREACIÓN
  /*Tabla USUARIO------------------------------------------*/
  createTableUsuario()
  {

    let sql='CREATE TABLE IF NOT EXISTS "USUARIO" ( `idusuario` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nombre` TEXT NOT NULL, `password` TEXT NOT NULL, `correo` TEXT NOT NULL UNIQUE, `estado` TEXT NOT NULL )';    
    return this.db.executeSql(sql,[]);
  }
  /*Tabla CATEGORIA------------------------------------------*/
  createTableCategoria()
  {    
    // let sql="DROP TABLE CATEGORIA;";
    let sql='CREATE TABLE IF NOT EXISTS "CATEGORIA" ( `idcategoria` INTEGER NOT NULL UNIQUE, `nombre` TEXT NOT NULL, `descripcion` TEXT, `idusuario` INTEGER NOT NULL, FOREIGN KEY(`idusuario`) REFERENCES `USUARIO`(`idusuario`), PRIMARY KEY(`idcategoria`) )';    
    return this.db.executeSql(sql,[]);
  }

  /*Tabla CATEGORIA------------------------------------------*/
  createTableNota()
  {    
    // let sql="DROP TABLE CATEGORIA;";
    let sql='CREATE TABLE IF NOT EXISTS "NOTA" ( `idnota` INTEGER NOT NULL UNIQUE, `descripcion` TEXT,`etiqueta1` TEXT, `etiqueta2` TEXT,`etiqueta3` TEXT, `etiqueta4` TEXT,`notificar` INTEGER, `tiempo` DATETIME, `idusuario` INTEGER NOT NULL, FOREIGN KEY(`idusuario`) REFERENCES `USUARIO`(`idusuario`), PRIMARY KEY(`idnota`) )';    
    return this.db.executeSql(sql,[]);
    
  }

  /*Tabla ACTIVIDAD------------------------------------------*/
  createTableActividad()
  {
    // let sql="DROP TABLE ACTIVIDAD;";
    let sql='CREATE TABLE IF NOT EXISTS "ACTIVIDAD" ( `idactividad` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nombre` TEXT NOT NULL, `etiqueta` TEXT NOT NULL, `descripcion` TEXT, `idcategoria` INTEGER NOT NULL, FOREIGN KEY(`idcategoria`) REFERENCES `CATEGORIA`(`idcategoria`) )';    
    return this.db.executeSql(sql,[]);
  }

  /*Tabla PROYECTO------------------------------------------*/
  createTableProyecto()
  {    
    // let sql="DROP TABLE PROYECTO;";
    let sql='CREATE TABLE IF NOT EXISTS "PROYECTO" ( `idproyecto` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, `nombre` TEXT NOT NULL, `descripcion` TEXT, `prioridad` INTEGER NOT NULL, `idcategoria` INTEGER NOT NULL, `idusuario` INTEGER NOT NULL, `estado` TEXT NOT NULL,`etiqueta` TEXT NOT NULL, `fechaplaneada` DATETIME,FOREIGN KEY(`idusuario`) REFERENCES `USUARIO`(`idusuario`), FOREIGN KEY(`idcategoria`) REFERENCES `CATEGORIA`(`idcategoria`) )';        
    return this.db.executeSql(sql,[]);
  }

  /*Tabla CALENDARIO------------------------------------------*/
  createTableCalendario()
  {
    // let sql="DROP TABLE CALENDARIO;";
    let sql='CREATE TABLE IF NOT EXISTS `CALENDARIO` ( `idcalendario` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,`idrepeticion` INTEGER, `tiempoinicio` DATETIME NOT NULL, `tiempofin` DATETIME, `peso` INTEGER NOT NULL, `estado` TEXT NOT NULL, `idactividad` INTEGER NOT NULL, `idproyecto` INTEGER,`tipo` TEXT NOT NULL, FOREIGN KEY(`idproyecto`) REFERENCES `PROYECTO`(`idproyecto`), FOREIGN KEY(`idactividad`) REFERENCES `ACTIVIDAD`(`idactividad`) )';   
    return this.db.executeSql(sql,[]);
  }

  //Insertar datos a la tabla USUARIO
  createUSUARIO(usuario:Usuario)
  {   
    return this.validar(0,4,usuario.correo)
    .then((valido)=>{
      if(valido)
      {
        let sql = "INSERT INTO `USUARIO`(`nombre`,`password`,`correo`,`estado`) VALUES (?,?,?,?);";    
        return this.db.executeSql(sql, [usuario.nombre,usuario.password,usuario.correo,usuario.estado]);        
      }else{
        return false;
      }
    })
    .catch((e)=>console.log("Error"));          
  }

  //Actualizar datos de la tabla USUARIO
  updateUSUARIO(usuario:Usuario){
    let sql = 'UPDATE `USUARIO` SET nombre=?, password=?, correo=?, estado=? WHERE idusuario=?';
    return this.db.executeSql(sql,[usuario.nombre,usuario.password,usuario.correo,usuario.estado,usuario.idusuario]);
  }

  //Remover datos de la tabla USUARIO parametro OBJETO
  deleteUSUARIO(usuario:Usuario){
    let sql = 'DELETE FROM `USUARIO` WHERE idusuario=?';
    return this.db.executeSql(sql, [usuario.idusuario]);
  }
  

  //Insertar datos a la tabla CATEGORIA
  createCATEGORIA(categoria:Categoria)
  {    
    let sql = "INSERT INTO `CATEGORIA`(`nombre`, `descripcion`,`idusuario`) VALUES (?,?,?);";    
    return this.db.executeSql(sql, [categoria.nombre,categoria.descripcion,categoria.idusuario]);
  }

  //Actualizar datos de la tabla CATEGORIA
  updateCATEGORIA(categoria: Categoria){
    let sql = 'UPDATE `CATEGORIA` SET nombre=?, descripcion=? WHERE idcategoria=?';
    return this.db.executeSql(sql,[categoria.nombre,categoria.descripcion,categoria.idcategoria]);
  } 
  
  //Remover datos de la tabla CATEGORIA parametro OBJETO
  deleteCATEGORIA(categoria:Categoria){
    return this.validar(categoria.idcategoria,1)
              .then((resp)=>{
                if(resp)
                {
                  let sql = 'DELETE FROM `CATEGORIA` WHERE idcategoria=?';
                  return this.db.executeSql(sql, [categoria.idcategoria]);
                }else{
                  return false;
                }               
              })
              .catch(e=>console.log("Error"));      
  }

  //Insertar datos a la tabla NOTA  
  createNOTA(nota:Nota)
  {    
    let sql = "INSERT INTO `NOTA`(`descripcion`,`etiqueta1`,`etiqueta2`,`etiqueta3`,`etiqueta4`,`notificar`,`tiempo`,`idusuario`) VALUES (?,?,?,?,?,?,?,?);";    
    return this.db.executeSql(sql, [nota.descripcion,nota.etiqueta1,nota.etiqueta2,nota.etiqueta3,nota.etiqueta4,nota.notificar,nota.tiempo,nota.idusuario]);
  }

  //Actualizar datos de la tabla NOTA
  updateNOTA(nota:Nota){
    let sql = 'UPDATE `NOTA` SET descripcion=?,etiqueta1=?,etiqueta2=?,etiqueta3=?,etiqueta4=?,notificar=?,tiempo=? WHERE idnota=?';
    return this.db.executeSql(sql,[nota.descripcion,nota.etiqueta1,nota.etiqueta2,nota.etiqueta3,nota.etiqueta4,nota.notificar,nota.tiempo,nota.idnota]);
  }

  //Eliminar datos de la tabla NOTA
  deleteNOTA(nota:Nota){
      let sql = 'DELETE FROM `NOTA` WHERE idnota=?';
      return this.db.executeSql(sql,[nota.idnota]);
  }

  //Insertar datos a la tabla ACTIVIDAD
  createACTIVIDAD(actividad:Actividad)
  {  
    let sql = "INSERT INTO `ACTIVIDAD`(`nombre`, `etiqueta`, `descripcion`,`idcategoria`) VALUES (?,?,?,?);";    
    return this.db.executeSql(sql, [actividad.nombre,actividad.etiqueta,actividad.descripcion,actividad.idcategoria]);
  }
  
  //Actualizar datos de la tabla ACTIVIDAD 
  updateACTIVIDAD(actividad:Actividad){
    let sql = 'UPDATE `ACTIVIDAD` SET nombre=?, etiqueta=?, descripcion=?, idcategoria=? WHERE idactividad=?';
    return this.db.executeSql(sql, [actividad.nombre,actividad.etiqueta,actividad.descripcion,actividad.idcategoria,actividad.idactividad]);
  }
  
  //Remover datos de la tabla ACTIVIDAD parametro OBJETO
  deleteACTIVIDAD(actividad:Actividad){
    

    return this.validar(actividad.idactividad,3)
              .then((resp)=>{
                if(resp)
                {
                  let sql = 'DELETE FROM `ACTIVIDAD` WHERE idactividad=?';
                  return this.db.executeSql(sql, [actividad.idactividad]);
                }else{
                  return false;
                }               
              })
              .catch(e=>console.log("Error")); 
  }

  //Insertar datos a la tabla PROYECTO
  createPROYECTO(proyecto:Proyecto)
  {    
    let sql = "INSERT INTO `PROYECTO`(`nombre`, `descripcion`, `prioridad`, `idcategoria`, `idusuario`, `estado`, `etiqueta`, `fechaplaneada`) VALUES (?,?,?,?,?,?,?,?);";    
    return this.db.executeSql(sql, [proyecto.nombre,proyecto.descripcion,proyecto.prioridad,proyecto.idcategoria,proyecto.idusuario,proyecto.estado,proyecto.etiqueta,proyecto.fechaplaneada]);
  }

  //Actualizar datos de la tabla PROYECTO
  updatePROYECTO(proyecto:Proyecto){
    let sql = 'UPDATE `PROYECTO` SET nombre=?, descripcion=?, prioridad=?, idcategoria=?, idusuario=?, estado=? ,etiqueta=?, fechaplaneada=? WHERE idproyecto=?';
    return this.db.executeSql(sql,[proyecto.nombre,proyecto.descripcion,proyecto.prioridad,proyecto.idcategoria,proyecto.idusuario,proyecto.estado,proyecto.etiqueta,proyecto.fechaplaneada,proyecto.idproyecto]);
  }

  //Remover datos de la tabla PROYECTO parametro OBJETO
  deletePROYECTO(proyecto:Proyecto){
    return this.validar(proyecto.idproyecto,1)
    .then((resp)=>{
      if(resp)
      {
        let sql = 'DELETE FROM `PROYECTO` WHERE idproyecto=?';
        return this.db.executeSql(sql, [proyecto.idproyecto]);        
      }else{
        return false;
      }               
    })
    .catch(e=>console.log("Error"));         
  }

  deletePROYECTOwithCALENDARIO(proyecto:Proyecto){
   
        let sql = 'DELETE FROM `PROYECTO` WHERE idproyecto=?';
        return this.db.executeSql(sql, [proyecto.idproyecto])
        .then(()=>{          
            let sql2 = 'DELETE FROM `CALENDARIO` WHERE idproyecto=?';
            return this.db.executeSql(sql2, [proyecto.idproyecto]);         
        })
        .catch((e)=>{
          console.log("Error",JSON.stringify(e));
        });              
  }

  deleteCATEGORIAwithPROYECTOandACTIVIDAD(categoria:Categoria){
   
    let sql = 'DELETE FROM `CATEGORIA` WHERE idcategoria=?';
    return this.db.executeSql(sql, [categoria.idcategoria])
    .then(()=>{          
        let sql2 = 'DELETE FROM `PROYECTO` WHERE idcategoria=?';
        let sql3 = 'DELETE FROM `ACTIVIDAD` WHERE idcategoria=?';
        return Promise.all([this.db.executeSql(sql2, [categoria.idcategoria]),this.db.executeSql(sql3, [categoria.idcategoria])]);         
    })
    .catch((e)=>{
      console.log("Error",JSON.stringify(e));
    });              
  }



  deleteCONTENIDOwithCALENDARIO(actividad:Actividad){
   
    let sql = 'DELETE FROM `ACTIVIDAD` WHERE idactividad=?';
    return this.db.executeSql(sql, [actividad.idactividad])
    .then(()=>{          
        let sql2 = 'DELETE FROM `CALENDARIO` WHERE idactividad=?';
        return this.db.executeSql(sql2, [actividad.idactividad]);         
    })
    .catch((e)=>{
      console.log("Error",JSON.stringify(e));
    });              
}

  //Insertar datos a la tabla CALENDARIO
  createCALENDARIO(calendario:Calendario)
  {        
    let sql = "INSERT INTO `CALENDARIO`(`idrepeticion`,`tiempoinicio`,`tiempofin`, `peso`, `estado`, `idactividad`, `idproyecto`,`tipo`) VALUES (?,?,?,?,?,?,?,?);";    
    return this.db.executeSql(sql, [calendario.idrepeticion,calendario.tiempoinicio,calendario.tiempofin,calendario.peso,calendario.estado,calendario.idactividad,calendario.idproyecto,calendario.tipo]);
  }

  //Actualizar datos de la tabla CALENDARIO
  updateCALENDARIO(calendario:Calendario){
    let sql = 'UPDATE `CALENDARIO` SET tiempoinicio=?, tiempofin=?, peso=?, estado=?, idactividad=?, idproyecto=?, tipo=? WHERE idcalendario=?';
    return this.db.executeSql(sql,[calendario.tiempoinicio,calendario.tiempofin,calendario.peso,calendario.estado,calendario.idactividad,calendario.idproyecto,calendario.tipo,calendario.idcalendario]);
  }

  //Actualizar datos de la tabla CALENDARIO
  updateCALENDARIOidRepeticion(calendario:Calendario){
    let sql = 'UPDATE `CALENDARIO` SET idrepeticion=? WHERE idcalendario=?';
    return this.db.executeSql(sql,[calendario.idrepeticion,calendario.idcalendario]);
  }

  //Remover datos de la tabla CALENDARIO parametro OBJETO
  deleteCALENDARIO(calendario:Calendario){
    let sql = 'DELETE FROM `CALENDARIO` WHERE idcalendario=?';
    return this.db.executeSql(sql, [calendario.idcalendario]);
  }
  deleteCALENDARIOByIdrepeticion(calendario:Calendario){
    let sql = 'DELETE FROM `CALENDARIO` WHERE idrepeticion=?';
    return this.db.executeSql(sql, [calendario.idrepeticion]);
  }

  //Remover datos de la tabla CALENDARIO parametro ID
  deleteByIdCALENDARIO(idcalendario:any){
    let sql = 'DELETE FROM `CALENDARIO` WHERE idcalendario=?';
    return this.db.executeSql(sql, [idcalendario]);
  }

  //COMANDOS DE CONSULTA**************************************************
  //Buscar por id USUARIO
  queryByIdUSUARIO(idusuario)
  {
    let sql = 'SELECT * FROM `USUARIO` WHERE idusuario=?';
    return this.db.executeSql(sql, [idusuario]);
  }

  //Buscar por id ACTIVIDAD
  queryByIdACTIVIDAD(idactividad:number)
  {
    let sql = 'SELECT * FROM `ACTIVIDAD` WHERE idactividad=?';    
    let sec=this.db.executeSql(sql, [idactividad])
    .then((actividad:Actividad)=>{
      return this.queryACTIVIDADwithCALENDARIO(actividad.idactividad)
      .then((calendarios:[Calendario])=>{
        return actividad.listCalendarios=calendarios;
      })      
    })
    .catch(e=>console.log("Error al buscar actividad"));
    return sec; 
  }

    //Buscar calendarios por actividad
  queryACTIVIDADwithCALENDARIO(idactividad?:number)
  {    
    let sql = 'SELECT * FROM `CALENDARIO`  WHERE idactividad=?';
       
    return this.db.executeSql(sql, [idactividad]);
  }
    //Buscar calendarios por proyecto
  queryPROYECTOwithCALENDARIO(idproyecto?:number)
  {    
    let sql = 'SELECT * FROM `CALENDARIO`  WHERE idproyecto=?';
       
    return this.db.executeSql(sql, [idproyecto]);
  }

  //Buscar por id PROYECTO
  queryByIdPROYECTO(idproyecto:number)
  {
    let sql = 'SELECT * FROM `PROYECTO` WHERE idproyecto=?';
    return this.db.executeSql(sql, [idproyecto]);
  }

  //Buscar por id CATEGORIA
  queryByIdCATEGORIA(idcategoria:number)
  {
    let sql = 'SELECT * FROM `CATEGORIA` WHERE idcategoria=?';
    return this.db.executeSql(sql, [idcategoria]);
  }


  //Buscar por id CALENDARIO
  queryByIdCALENDARIO(idcalendario:number)
  {
    let sql = 'SELECT * FROM `CALENDARIO` WHERE idcalendario=?';
    return this.db.executeSql(sql, [idcalendario]);
  }


  queryLogin(correo:string,password:string)
  {
    let sql = 'SELECT * FROM USUARIO WHERE correo=? AND password=?;';
    return this.db.executeSql(sql, [correo,password])
    .then((response) => {
      let rowsTable=[];
      let usuario:Usuario;
      
        for (let index = 0; index < response.rows.length; index++) {
          usuario=response.rows.item(index);
          console.log(rowsTable);
          rowsTable.push(usuario);
        }
      if(rowsTable.length<=0)
      {
        rowsTable=null;
      }      
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error));
  }

  listAllActividades(idusuario)
  {
    let sql = 'SELECT actividad.idactividad, actividad.nombre, actividad.etiqueta,actividad.descripcion, actividad.idcategoria, categoria.nombre AS catnombre FROM ACTIVIDAD AS actividad INNER JOIN CATEGORIA AS categoria ON actividad.idcategoria=categoria.idcategoria WHERE categoria.idusuario=?';
    return this.db.executeSql(sql, [idusuario])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {
        rowsTable.push( response.rows.item(index) );
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error)); 
  }

  listNotaByUser(idusuario:number){
    let sql = 'SELECT * FROM NOTA WHERE idusuario=?';
    return this.db.executeSql(sql, [idusuario])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {
        rowsTable.push( response.rows.item(index) );
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error));
  }

  listAllByUser(table:string,idusuario:number){
    let sql = 'SELECT * FROM '+table+' WHERE idusuario=?';
    return this.db.executeSql(sql, [idusuario])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {
        rowsTable.push( response.rows.item(index) );
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error));
  }

  listAllByUserPROYECTOInnerCATEGORIA(table:string,idusuario:number){
    let sql = 'SELECT p.idproyecto,p.nombre, p.descripcion, p.prioridad, p.idcategoria, p.idusuario, p.estado,p.etiqueta, p.fechaplaneada, c.nombre AS catnombre FROM '+table+' p INNER JOIN CATEGORIA c ON p.idcategoria=c.idcategoria WHERE c.idusuario=?';
    return this.db.executeSql(sql, [idusuario])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {
        response.rows.item(index).estadoAnim=true;
        rowsTable.push( response.rows.item(index) );
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error));
  }

  listAll(table:string){
    let sql = 'SELECT * FROM '+table;
    return this.db.executeSql(sql, [])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {
        rowsTable.push( response.rows.item(index) );
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error));
  }

  // listAllCal()
  // {
  //   let sql = "SELECT T1.idcalendario, T1.tiempoinicio, T1.tiempofin, T1.peso, T1.estado, T2.nombre,T2.descripcion,T3.nombre as nombrepro FROM CALENDARIO T1 INNER JOIN ACTIVIDAD T2 ON T1.idactividad = T2.idactividad  INNER JOIN  PROYECTO T3 ON T3.idproyecto=T1.idproyecto";
  //   return this.db.executeSql(sql, [])
  //   .then(response => {
  //     console.log("Cargando datos");
  //     let rowsTable = [];
  //     for (let index = 0; index < response.rows.length; index++) {
  //       rowsTable.push( response.rows.item(index) );
  //     }
  //     return Promise.resolve( rowsTable );
  //   })
  //   .catch(error => Promise.reject(error));        
  // }
  queryAllCalendario(idusuario:number)
  {
      // let sql = "SELECT calendario.idcalendario,calendario.tiempoinicio,calendario.tiempofin,calendario.peso,calendario.estado,calendario.idactividad,calendario.idproyecto, actividad.nombre AS actividad.nombre, categoria.nombre AS categoria.nombre FROM CALENDARIO calendario INNER JOIN ACTIVIDAD actividad ON calendario.idactividad = actividad.idactividad INNER JOIN CATEGORIA categoria ON actividad.idcategoria = categoria.idcategoria";
      let sql = "SELECT calendario.idcalendario,calendario.idrepeticion,calendario.tiempoinicio,calendario.tiempofin,calendario.peso,calendario.estado,calendario.tipo,calendario.idactividad,calendario.idproyecto,proyecto.nombre as pronombre,proyecto.etiqueta as proetiqueta, actividad.nombre AS actnombre,actividad.descripcion AS actdescripcion,actividad.etiqueta AS actetiqueta, categoria.idcategoria as catidcategoria,categoria.nombre AS catnombre FROM CALENDARIO calendario INNER JOIN PROYECTO proyecto ON proyecto.idproyecto=calendario.idproyecto INNER JOIN ACTIVIDAD actividad ON calendario.idactividad = actividad.idactividad INNER JOIN CATEGORIA categoria ON actividad.idcategoria = categoria.idcategoria WHERE categoria.idusuario=?";
      return this.db.executeSql(sql, [idusuario])
    .then(response => {
      console.log("Cargando datos");
      let rowsTable = [];
      for (let index = 0; index < response.rows.length; index++) {

        rowsTable.push(response.rows.item(index));
      }
      return Promise.resolve( rowsTable );
    })
    .catch(error => Promise.reject(error)); 
  }

  queryBetweenDate(idusuario,fechainicio,fechafin)
  {        
    let sql = "SELECT calendario.idcalendario,calendario.idrepeticion,calendario.tiempoinicio,calendario.tiempofin,calendario.peso,calendario.estado,calendario.tipo,calendario.idactividad,calendario.idproyecto, proyecto.nombre AS pronombre, proyecto.etiqueta AS proetiqueta, proyecto.prioridad AS proprioridad, actividad.nombre AS actnombre,actividad.descripcion AS actdescripcion, categoria.idcategoria as catidcategoria,categoria.nombre AS catnombre FROM CALENDARIO calendario INNER JOIN PROYECTO proyecto ON calendario.idproyecto=proyecto.idproyecto INNER JOIN ACTIVIDAD actividad ON calendario.idactividad = actividad.idactividad INNER JOIN CATEGORIA categoria ON actividad.idcategoria = categoria.idcategoria WHERE categoria.idusuario=? AND ( calendario.tiempoinicio BETWEEN ? AND ? )";    
    return this.db.executeSql(sql, [idusuario,fechainicio,fechafin]);
  }

  //VALIDAR
  validar(id:number,tipo:number,campo?:any)
  {
    //id deber ser de una categoria
    switch(tipo)
    {
      case 1:  
        //VALIDAR ELIMINACION CATEGORIA->PROYECTO  Y CATEGORIA->ACTIVIDAD
        let sql = 'SELECT * FROM `PROYECTO` WHERE idcategoria=?';  
        let sec=this.db.executeSql(sql, [id])
        let sql2 = 'SELECT * FROM `ACTIVIDAD` WHERE idcategoria=?';
        let sec2=this.db.executeSql(sql2, [id])            
        let validaciones=Promise.all([sec,sec2])
        .then((values:any)=>{          
          console.log(JSON.stringify(values));          
          if(values[0].rows.length>=1 || values[1].rows.length>=1)
          {
            //Existen registros relacionados
            return false;
          }else{
            //Permitido eliminar
            return true;
          }
        })
        .catch(e=>console.log("Error en validacion tipo:",tipo));        
        
      
        // let sec=this.db.executeSql(sql, [id])
        // .then((response)=>
        // {
        //   //CATEGORIA PROYECTO
        //   //RETORNA SQLResultSet         
        //   if(response.rowsAffected)
        //   {
        //     return true;
        //   }else{
        //     throw ErrorEvent;
            
        //   }          
        // })
        // .then((response)=>
        // {
        //   //CATEGORIA ACTIVIDAD  
        //   //RETORNA SQLResultSet
                                
        //     return response.rowsAffected;
        // })        
        // .catch((e)=>{console.log("Error en validacion:"+tipo); return false;});
        return validaciones;                   
      case 2:
      //PROYECTO CALENDARIO
      let sql3 = 'SELECT * FROM `CALENDARIO` WHERE idproyecto=?';
      let sec3=this.db.executeSql(sql3, [id])
      .then((response)=>
      {
        if(response.rows.length>=1)
        {
          //Existen registros relacionados
          return false;
        }else{
          //Permitido eliminar
          return true;
        }
      })        
      .catch((e)=>console.log("Error en validacion:"+tipo));
      return sec3;      
      case 3:
      //ACTIVIDAD CALENDARIO
      let sql4 = 'SELECT * FROM `CALENDARIO` WHERE idactividad=?';
      let sec4=this.db.executeSql(sql4, [id])
      .then((response)=>
      {
          if(response.rows.length>=1)
          {
            //Existen registros relacionados
            return false;
          }else{
            //Permitido eliminar
            return true;
          }
      })        
      .catch((e)=>console.log("Error en validacion:"+tipo));
      return sec4;
      case 4:
      //VALIDACION UNIQUE  USUARIO correo
        //ACTIVIDAD CALENDARIO      
        let sql5 = 'SELECT * FROM `USUARIO` WHERE correo=?';
      let sec5=this.db.executeSql(sql5, [campo])
      .then((response)=>
      {
          if(response.rows.length>=1)
          {
            //Existen registros relacionados
            return false;
          }else{
            //Permitido eliminar
            return true;
          }
      })        
      .catch((e)=>console.log("Error en validacion:"+tipo));
      return sec5;
      default:
      return null;      
    }
  }

  //https://cordova.apache.org/docs/es/latest/cordova/storage/sqlresultset/sqlresultset.html
    
}

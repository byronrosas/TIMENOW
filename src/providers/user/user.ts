import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';



import { Usuario } from './../../models/usuario';
import { SqlitetaskServiceProvider } from './../sqlitetask-service/sqlitetask-service';
import { Storage } from '@ionic/storage';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: Usuario;
  usuarios:any[]=[];
  constructor(private storage: Storage,public _sql:SqlitetaskServiceProvider) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this._sql.queryLogin(accountInfo.correo,accountInfo.password);

    seq.then((res:[Usuario]) => {      
      if (res != null) {
        console.log("Login valido",JSON.stringify(res));
        this._loggedIn(res[0]);
        this.storage.set('login',res[0].idusuario);
        this.storage.set('user',res[0]); 
      } else {
        this._loggedIn(null);
        console.log("Login invalido");
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(usuario:Usuario) {
    // let seq = this.api.post('signup', accountInfo).share();
    let seq=this._sql.createUSUARIO(usuario);    
    
    seq.then((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res) {
        console.log("USUARIO Creado: => ",JSON.stringify(res));        
        this._loggedIn(res);  
        this.storage.set('login',res.insertId);      
        this.storage.set('user',usuario); 
      }
    })
    .catch((e)=>{
      console.log("ERROR crear usuario => ");      
      console.log(e);
    });

    return seq;
  }

  listUser()
  {
    console.log("Listando Usuarios...");
    let sec=this._sql.listAll("USUARIO");
    sec.then((t)=>{
      this.usuarios=t;
      console.log("Listado de usuarios listo :)");
      console.log(JSON.stringify(t));
      return t;
      
    })
    .catch((e)=>console.log("Hola registro error"));
    return sec;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    this.storage.set('login',null);
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp:Usuario) {
    this._user = resp;
  }
}

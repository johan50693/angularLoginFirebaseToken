import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url ='https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey='AIzaSyBT7fvke-l2IPXrj5lO9dFvp2JqUue3B_8';
  usertoken: string;

  constructor(private http: HttpClient ) { 
    this.leerToken();
  }
  
  logout(){
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel){

    const authData= {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true,
    };
  
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(
      map( resp =>{
        console.log("Login - Se guarda Token");
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }

  registrarUsuario(usuario:UsuarioModel){

  const authData= {
    email: usuario.email,
    password: usuario.password,
    returnSecureToken: true,
  };

  return this.http.post(
    `${this.url}signUp?key=${this.apiKey}`,
    authData
  ).pipe(
    map( resp =>{
      console.log("Registro - Se guarda token");
      this.guardarToken(resp['idToken']);
      return resp;
    })
  );

  }

  private guardarToken(idToken:string){
    this.usertoken=idToken;
    localStorage.setItem('token',idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira',hoy.getTime().toString());
  }

  leerToken(){
    if (localStorage.getItem('token')) {
      this.usertoken= localStorage.getItem('token');
    }else{
      this.usertoken='';
    }
    return this.usertoken;
  }

  estaAutenticado(): boolean{

    if (this.usertoken.length < 2) {
      return false;
    }

    const expira=Number(localStorage.getItem('expira'));
    const expiraDate= new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    }else{
      return false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  usuario: UsuarioModel= new UsuarioModel();
  recordarme= false;

  constructor(private auth: AuthService, private router:Router) { 
    console.log(this.recordarme);
  }


  ngOnInit() {
    if(localStorage.getItem('email')){
      this.usuario.email= localStorage.getItem('email');
      this.recordarme=true;
    }
  }

  onSubmit(form: NgForm){
    
    
    if(form.invalid){
      console.log("El formulario es invalido");
      return;
    }
    
    Swal.fire({
      text: 'Cargando...',
      icon: 'info',
      confirmButtonText: 'Cool',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp => {
      console.log(resp);
      Swal.close();

      if(this.recordarme){
        localStorage.setItem('email',this.usuario.email);
      }
      
      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err);
      Swal.fire({
        text: err.error.error.message,
        title: 'Error al autenticar',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });

  }

}

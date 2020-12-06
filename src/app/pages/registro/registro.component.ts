import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme=false;

  constructor(private auth: AuthService, private router: Router) { 

  }

  ngOnInit() { 
    this.usuario = new UsuarioModel();
  }

  onSubmit(form: NgForm){

    if(form.invalid){
      console.log("Formulario invalido");
      return;
    }

    Swal.fire({   
      text: 'Cargando...',
      icon: 'info',
      confirmButtonText: 'Cool',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.auth.registrarUsuario(this.usuario).subscribe(resp => {
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
        title: 'Error al registrar',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    });
  }

}

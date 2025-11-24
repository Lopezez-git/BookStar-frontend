import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from "../../auth-header/auth-header";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, AuthHeaderComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  senha = '';

  aceitouTermos = false; 

  constructor(private http: HttpClient, private router: Router) {}

  fazerLogin() {

    if (!this.aceitouTermos) {
      alert('Você precisa aceitar os termos antes de entrar.');
      return;
    }

    const dadosLogin = {
      email: this.email,
      senha: this.senha
    };

    this.http.post('http://localhost:5010/usuario/login', dadosLogin).subscribe({
      next: (res: any) => {
        console.log('Login realizado com sucesso:', res);
        alert(res.mensagem);

        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        alert(err.error?.erro || 'Falha no login. Verifique o email e a senha.');
      }
    });
  }
}
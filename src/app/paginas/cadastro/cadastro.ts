import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class Cadastro {

  nome = '';
  username = '';
  cpf = '';
  email = '';
  senha = '';

  aceitouTermos = false;

  constructor(private http: HttpClient, private router: Router) { }

  cadastrarUsuario() {

  
    if (!this.aceitouTermos) {
      alert('Você precisa aceitar os Termos de Uso antes de continuar.');
      return; // impede o cadastro
    }

  
    const novoUsuario = {
      nome: this.nome,
      username: this.username,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha
    };

    if (!this.validarCPF(this.cpf)) {
      alert('CPF inválido. Verifique e tente novamente.');
      return;
    }

    this.http.post('http://localhost:5010/usuario/cadastro', novoUsuario).subscribe({
      next: (res) => {
        console.log('Usuário cadastrado com sucesso:', res);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário:', err);
        alert('Falha ao cadastrar. Verifique o servidor.');
      }
    });
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    // Evita CPFs inválidos conhecidos (11111111111 etc)
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    // Valida primeiro dígito
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    // Valida segundo dígito
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

}

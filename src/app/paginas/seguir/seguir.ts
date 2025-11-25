import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from '../../auth-header/auth-header';

interface Usuario {
  id: number;
  nome: string;
  username: string;
  fotoPerfil: string;
  seguindo: boolean;
}

interface UsuarioLogado {
  id: number;
  nome: string;
  username: string;
  fotoPerfil: string;
  email?: string;
}

@Component({
  selector: 'app-seguir',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './seguir.html',
  styleUrls: ['./seguir.css']
})
export class SeguirComponent implements OnInit {
  
  usuarioLogado: UsuarioLogado | null = null;
  sugestoes: Usuario[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(
    // private authService: AuthService, // ← Descomente quando criar o serviço
    // private usuarioService: UsuarioService // ← Descomente quando criar o serviço
  ) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
    this.carregarSugestoes();
  }

  carregarUsuarioLogado(): void {
    // OPÇÃO 1: Buscar do AuthService (se você guarda os dados do usuário lá)
 
    // OPÇÃO 2: Buscar do localStorage (se você salva os dados lá após o login)
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      this.usuarioLogado = JSON.parse(usuarioStorage);
    }

    // OPÇÃO 3: Fazer uma chamada HTTP para pegar dados atualizados
  }

  carregarSugestoes(): void {
    this.carregando = true;
    
    // Implementar chamada ao backend


    setTimeout(() => {
      this.sugestoes = [
        {
          id: 1,
          nome: 'Allan Lopes',
          username: '@allanlopes',
          fotoPerfil: '/Allan Lopes.jpg',
          seguindo: false
        },
        {
          id: 2,
          nome: 'Lethicia Nobre',
          username: '@lethicianobre',
          fotoPerfil: '/Lethicia-Nobre.png',
          seguindo: false
        },
        {
          id: 3,
          nome: 'Ana Carolina',
          username: '@anacarolina',
          fotoPerfil: '/Ana Carolina.jpg',
          seguindo: false
        },
        {
          id: 4,
          nome: 'Thalyta Cristina',
          username: '@thalytacristina',
          fotoPerfil: '/Thalyta Cristina.jpg',
          seguindo: false
        }
      ];
      this.carregando = false;
    }, 500);
  }

  seguirUsuario(usuario: Usuario): void {
    // Implementar chamada ao backend


    usuario.seguindo = true;
    console.log(`Seguindo ${usuario.nome}`);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from '../../auth-header/auth-header';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Usuario {
  id: number;
  nomeUsuario: string;
  username: string;
  perfilImagem: string;
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
  imports: [CommonModule, AuthHeaderComponent, HttpClientModule],
  templateUrl: './seguir.html',
  styleUrls: ['./seguir.css']
})
export class SeguirComponent implements OnInit {

  usuarioLogado: UsuarioLogado | null = null;

  sugestoes: Usuario[] = [];
  carregando: boolean = true;
  erro: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarSugestoes();
  }

  carregarPerfil() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Nenhum token encontrado no localStorage!");
    this.erro = 'Usuário não autenticado.';
    this.carregando = false;
    return;
  }

  this.http.get<any>('http://localhost:5010/usuario/perfil', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .subscribe({
    next: (res) => {
      console.log("Resposta da API:", res);

      this.usuarioLogado = {
        id: res.id,
        nome: res.nome,
        username: res.username ?? '',
        fotoPerfil: res.imagem_perfil
          ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}`
          : '/Default_pfp.jpg'
      };

      this.carregando = false;
    },
    error: (err) => {
      console.error('Erro ao carregar perfil:', err);
      this.erro = 'Erro ao carregar perfil (token inválido ou expirado).';
      this.carregando = false;
    }
  });
}


  carregarSugestoes(): void {
    this.carregando = true;

    setTimeout(() => {
      this.sugestoes = [
        {
          id: 1,
          nomeUsuario: 'Allan Lopes',
          username: '@allanlopes',
          perfilImagem: '/Allan Lopes.jpg',
          seguindo: false
        },
        {
          id: 2,
          nomeUsuario: 'Lethicia Nobre',
          username: '@lethicianobre',
          perfilImagem: '/Lethicia-Nobre.png',
          seguindo: false
        },
        {
          id: 3,
          nomeUsuario: 'Ana Carolina',
          username: '@anacarolina',
          perfilImagem: '/Ana Carolina.jpg',
          seguindo: false
        },
        {
          id: 4,
          nomeUsuario: 'Thalyta Cristina',
          username: '@thalytacristina',
          perfilImagem: '/Thalyta Cristina.jpg',
          seguindo: false
        }
      ];

      this.carregando = false;
    }, 500);
  }

  seguirUsuario(usuario: Usuario): void {
    usuario.seguindo = true;
    console.log(`Seguindo ${usuario.nomeUsuario}`);
  }
}

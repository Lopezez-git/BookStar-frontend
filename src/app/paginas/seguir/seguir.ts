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

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarSugestoes();
  }

  // ================== PERFIL ====================
  carregarPerfil() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.erro = 'Usuário não autenticado.';
      this.carregando = false;
      return;
    }

    this.http.get<any>('http://localhost:5010/usuario/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .subscribe({
        next: (res) => {
          this.usuarioLogado = {
            id: res.id,
            nome: res.nome,
            username: res.username,
            fotoPerfil: res.imagem_perfil
              ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}`
              : '/Default_pfp.jpg'
          };
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao carregar perfil:', err);
          this.erro = 'Erro ao carregar perfil.';
          this.carregando = false;
        }
      });
  }

  // ================== SUGESTÕES ====================
  carregarSugestoes(): void {
  const token = localStorage.getItem('token');

  if (!token) {
    this.erro = "Usuário não autenticado.";
    return;
  }

  this.http.get<any>('http://localhost:5010/usuario/all', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .subscribe({
      next: (res) => {
        console.log('Resposta completa:', res);
        
        // Verifica se res tem listaUsuarios ou se é um array direto
        const lista = res.listaUsuarios || res;
        
        this.sugestoes = lista.map((u: any) => ({
          id: u.id,
          nomeUsuario: u.nome,
          username: u.username,
          perfilImagem: u.imagem_perfil
            ? `http://localhost:5010/storage/perfil/${u.imagem_perfil}`
            : '/Default_pfp.jpg',
          seguindo: false
        }));
        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao carregar sugestões:", err);
        this.erro = "Erro ao carregar sugestões";
        this.carregando = false;
      }
    });
}

  // ================== SEGUIR ====================
  seguirUsuario(usuario: Usuario): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    console.log("Enviando:", { id_seguido: usuario.id });

    this.http.post(
      'http://localhost:5010/usuario/seguir',
      { id_seguido: usuario.id },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        usuario.seguindo = true;
        console.log(`Agora você segue: ${usuario.nomeUsuario}`);
      },
      error: (err) => {
        if (err.error?.mensagem) {
          // Mostra o alert com a mensagem do backend
          alert(err.error.mensagem);

          // Atualiza o estado visual caso queira marcar como seguido
          if (err.error.mensagem === 'Você já segue esse usuário.') {
            usuario.seguindo = true;
          }
        } else {
          console.error('Erro ao seguir usuário:', err);
        }
      }
    });
    ;
    ;
  }

}

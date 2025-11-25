import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthHeaderComponent } from "../../auth-header/auth-header";

interface Usuario {
  id: number;
  nome: string;
  username: string;
  avatar: string;
}

@Component({
  selector: 'app-seguindo',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './seguindo.html',
  styleUrls: ['./seguindo.css']
})
export class SeguindoComponent implements OnInit {
  
  nomeUsuario: string = '';
  usernameUsuario: string = '';
  perfilImagem: string = '';
  seguidores: number = 0;
  seguindo: number = 0;

  usuariosSeguindo: Usuario[] = [];
  previewImagem: string | null = null;

  carregando: boolean = true;
  erro: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.carregarSeguindo();
  }

  // ================= PERFIL =================
  carregarPerfil(): void {
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
        this.nomeUsuario = res.nome;
        this.usernameUsuario = res.username;
        this.perfilImagem = res.imagem_perfil
          ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}`
          : '/Default_pfp.jpg';

        this.seguidores = res.seguidores;
        this.seguindo = res.seguindo;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar perfil.';
        this.carregando = false;
      }
    });
  }

  // ================= LISTA DE SEGUINDO =================
  carregarSeguindo(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.erro = "Usuário não autenticado.";
      return;
    }

    this.http.get<any>('http://localhost:5010/usuario/seguindo', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: (res) => {

        // Aceita qualquer formato que o backend mandar
        const lista = res.seguindo || res.lista || res;

        this.usuariosSeguindo = (lista || []).map((u: any) => ({
          id: u.id || u.id_seguido,
          nome: u.nome,
          username: u.username,
          avatar: u.imagem_perfil
            ? `http://localhost:5010/storage/perfil/${u.imagem_perfil}`
            : '/Default_pfp.jpg'
        }));

      },
      error: () => {
        this.erro = "Erro ao carregar lista de seguindo.";
      }
    });
  }

  // ================= TROCAR FOTO =================
  trocarFoto(event: any): void {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => (this.previewImagem = reader.result as string);
    reader.readAsDataURL(arquivo);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('imagem', arquivo);

    this.http.put('http://localhost:5010/usuario/perfil/capa', formData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: (res: any) => {
        this.perfilImagem = res.usuario.imagem_url;
        alert("Foto atualizada com sucesso!");
      },
      error: () => alert("Erro ao enviar foto.")
    });
  }

  // ================= DEIXAR DE SEGUIR =================
  deixarDeSeguir(usuario: Usuario): void {
    if (!confirm(`Deseja deixar de seguir ${usuario.nome}?`)) return;

    const token = localStorage.getItem('token');

    this.http.delete(`http://localhost:5010/usuario/deixar-seguir/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: () => {
        this.usuariosSeguindo = this.usuariosSeguindo.filter(u => u.id !== usuario.id);
        this.seguindo--;
        alert(`Você deixou de seguir ${usuario.nome}`);
      },
      error: (err) => {
        alert(err.error?.erro || "Erro ao deixar de seguir.");
      }
    });
  }

  get listaSeguindo() {
    return this.usuariosSeguindo;
  }

  get fotoUsuario() {
    return this.previewImagem || this.perfilImagem;
  }
}

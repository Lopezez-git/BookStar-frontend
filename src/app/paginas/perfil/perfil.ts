import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import livrosJson from '../../../assets/livros.json';

interface Livro {
  id: number; // ID do JSON para routerLink
  livroIdBackend: number; // ID do backend para DELETE
  titulo: string;
  autor: string;
  capa: string;
  avaliacao: number;
  comentario: string;
  status: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  nomeUsuario: string = '';
  usernameUsuario: string = '';
  perfilImagem: string = '';
  seguidores: number = 0;
  seguindo: number = 0;

  abaAtiva: string = 'livrosLidos';
  livrosFiltrados: Livro[] = [];
  previewImagem: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.carregarPerfil();
    this.buscarLivrosPorAba('livrosLidos');
  }

  carregarPerfil() {
    this.http.get<any>('http://localhost:5010/usuario/perfil', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: res => {
        this.nomeUsuario = res.nome;
        this.usernameUsuario = res.username;
        this.perfilImagem = res.imagem_perfil
          ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}`
          : '/Default_pfp.jpg';
        this.seguidores = res.seguidores;
        this.seguindo = res.seguindo;
      },
      error: err => console.error('Erro ao carregar perfil:', err)
    });
  }

  mudarAba(aba: string) {
    this.abaAtiva = aba;
    this.buscarLivrosPorAba(aba);
  }

  buscarLivrosPorAba(aba: string) {
    let url = '';
    if (aba === 'livrosLidos') url = 'http://localhost:5010/usuario/biblioteca/concluido';
    if (aba === 'queroLer') url = 'http://localhost:5010/usuario/biblioteca/quero-ler';
    if (aba === 'estouLendo') url = 'http://localhost:5010/usuario/biblioteca/estou-lendo';

    if (!url) {
      this.livrosFiltrados = [];
      return;
    }

    this.http.get<any>(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: res => {
        const lista = res.livros || res || [];

        this.livrosFiltrados = lista.map((l: any) => {
          // Procura no JSON para pegar ID do routerLink
          const livroJson = livrosJson.find(
            x => x.titulo.trim().toLowerCase() === l.titulo.trim().toLowerCase()
          );
          if (!livroJson) console.warn("Livro não encontrado no JSON:", l.titulo);

          return {
            id: livroJson?.id ?? null,
            livroIdBackend: l.livroId, // ID do backend para DELETE
            titulo: l.titulo,
            autor: l.autores,
            capa: `http://localhost:5010${l.capa_url}`,
            avaliacao: l.avaliacao || 0,
            comentario: l.comentario || '',
            status: l.status
          };
        });

        console.log('Livros filtrados:', this.livrosFiltrados);
      },
      error: err => {
        console.error("Erro ao carregar livros:", err);
        this.livrosFiltrados = [];
      }
    });
  }

  removerLivro(livro: Livro) {
    if (!livro.livroIdBackend) {
      alert("Não é possível remover este livro: ID do backend não encontrado.");
      return;
    }

    if (!confirm(`Tem certeza que deseja remover "${livro.titulo}"?`)) return;

    console.log('Tentando remover livro com ID backend:', livro.livroIdBackend);

    this.http.delete(`http://localhost:5010/usuario/biblioteca/delete/${livro.livroIdBackend}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        console.log('Livro removido com sucesso!');
        this.livrosFiltrados = this.livrosFiltrados.filter(l => l.livroIdBackend !== livro.livroIdBackend);
        alert('Livro removido da sua biblioteca!');
      },
      error: err => {
        console.error('Erro ao remover livro:', err);
        alert('Erro ao remover livro. Verifique se o ID existe ou se você tem permissão.');
      }
    });
  }

  trocarFoto(event: any) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append('imagem', arquivo);

    const leitor = new FileReader();
    leitor.onload = () => (this.previewImagem = leitor.result as string);
    leitor.readAsDataURL(arquivo);

    this.http.put('http://localhost:5010/usuario/perfil/capa', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (res: any) => {
        console.log("Upload OK:", res);
        this.perfilImagem = res.usuario.imagem_url;
        alert("Foto atualizada com sucesso!");
      },
      error: err => {
        console.error("Erro no upload:", err);
        alert("Erro ao enviar foto.");
      }
    });
  }
}

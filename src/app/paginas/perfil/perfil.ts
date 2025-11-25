import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

interface Livro {
  id: number;
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (res) => {
        this.nomeUsuario = res.nome;
        this.usernameUsuario = res.username;

        this.perfilImagem = res.imagem_perfil
          ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}`
          : '/Default_pfp.jpg';

        this.seguidores = res.seguidores;
        this.seguindo = res.seguindo;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
      }
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (res) => {
        const lista = res.livros || res || [];

        this.livrosFiltrados = lista.map((l: any) => ({
          id: l.livroId,          // <-- CORREÇÃO
          titulo: l.titulo,
          autor: l.autores,
          capa: `http://localhost:5010${l.capa_url}`,
          avaliacao: l.avaliacao || 0,
          comentario: l.comentario || '',
          status: l.status
        }));


        console.log('Livros filtrados:', this.livrosFiltrados);
      },
      error: (err) => {
        console.error("Erro ao carregar livros:", err);
        this.livrosFiltrados = [];
      }
    });
  }

  // ⛔ FUNÇÃO DEFINITIVA DE REMOVER LIVRO DA BIBLIOTECA
  removerLivro(livro: Livro) {
    if (!confirm(`Tem certeza que deseja remover "${livro.titulo}"?`)) {
      return;
    }

    this.http.delete(`http://localhost:5010/usuario/biblioteca/delete/${livro.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: () => {
        console.log('Livro removido com sucesso!');

        this.livrosFiltrados = this.livrosFiltrados.filter(l => l.id !== livro.id);

        alert('Livro removido da sua biblioteca!');
      },
      error: (err) => {
        console.error('Erro ao remover livro:', err);
        alert('Erro ao remover livro. Tente novamente.');
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (res: any) => {
        console.log("Upload OK:", res);
        this.perfilImagem = res.usuario.imagem_url;
        alert("Foto atualizada com sucesso!");
      },
      error: (err) => {
        console.error("Erro no upload:", err);
        alert("Erro ao enviar foto.");
      }
    });
  }
}

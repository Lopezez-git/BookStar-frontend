import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  capa: string;
  avaliacao: number;
  status: 'lido' | 'queroLer' | 'lendo' | 'naoFinalizado';
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {

  nomeUsuario: string = '';
  perfilImagem: string = '';
  seguidores: number = 0;
  seguindo: number = 0;

  abaAtiva: string = 'livrosLidos';

  livros: Livro[] = [
    {
      id: 1,
      titulo: 'You: Caroline Kepnes',
      autor: 'Caroline Kepnes',
      capa: '/assets/you-cover.jpg',
      avaliacao: 5,
      status: 'lido'
    },
    {
      id: 2,
      titulo: 'IT: A coisa: Stephen King',
      autor: 'Stephen King',
      capa: '/assets/it-cover.jpg',
      avaliacao: 4,
      status: 'lido'
    }
  ];

  livrosFiltrados: Livro[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.carregarPerfil();
    this.filtrarLivros();
  }

  carregarPerfil() {
    // Busca dados do perfil do usuário logado
    this.http.get<any>('http://localhost:5010/usuario/perfil').subscribe({
      next: (res) => {

        console.log("Resposta da api: " , res.imagem_perfil);
        this.nomeUsuario = res.nome;
        this.perfilImagem = res.imagem_perfil 
        ? `http://localhost:5010/storage/perfil/${res.imagem_perfil}` : '/Default_pfp.jpg';
        this.seguidores = res.seguidores;
        this.seguindo = res.seguindo;
        this.livros = res.livros || this.livros;
        this.filtrarLivros();
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        // Mantém dados mockados se houver erro
      }
    });
  }

  mudarAba(aba: string) {
    this.abaAtiva = aba;
    this.filtrarLivros();
  }

  filtrarLivros() {
    switch(this.abaAtiva) {
      case 'livrosLidos':
        this.livrosFiltrados = this.livros.filter(l => l.status === 'lido');
        break;
      case 'queroLer':
        this.livrosFiltrados = this.livros.filter(l => l.status === 'queroLer');
        break;
      case 'estouLendo':
        this.livrosFiltrados = this.livros.filter(l => l.status === 'lendo');
        break;
      case 'naoFinalizados':
        this.livrosFiltrados = this.livros.filter(l => l.status === 'naoFinalizado');
        break;
      case 'clubes':
        this.livrosFiltrados = []; // Implementar lógica de clubes
        break;
      case 'reviews':
        this.livrosFiltrados = this.livros.filter(l => l.avaliacao > 0);
        break;
      default:
        this.livrosFiltrados = this.livros;
    }
  }
}
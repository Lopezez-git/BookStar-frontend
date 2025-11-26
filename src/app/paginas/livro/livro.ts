import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import livrosData from '../../../assets/livros.json';

interface Livro {
  id: string;
  titulo: string;
  descricao: string;
  autor: string;
  foto_autor: string;
  biografiaAutor: string;
  capa_livro?: string;
}

type StatusLivro = 'quero ler' | 'estou lendo' | 'concluido' | '';

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livro.html',
  styleUrls: ['./livro.css']
})
export class LivroComponent implements OnInit {

  livro: Livro | null = null;
  carregando = true;
  erro = '';

  avaliacaoUsuario = 0;
  hoverRating = 0;
  comentarioUsuario = '';
  statusLocal: StatusLivro = '';
  livroNaBiblioteca = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buscarDetalhesLivro(id);
      this.carregarInfoDoBanco(id);
    }
  }

  buscarDetalhesLivro(id: string): void {
    this.carregando = true;
    const livroEncontrado = (livrosData as Livro[]).find(l => l.id === id);

    if (livroEncontrado) {
      this.livro = livroEncontrado;
      this.carregando = false;
    } else {
      this.erro = 'Livro não encontrado.';
      this.carregando = false;
    }
  }

  carregarInfoDoBanco(id: string): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any>('http://localhost:5010/usuario/biblioteca', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (lista) => {
        const item = lista.find((obj: any) => obj.titulo === this.livro?.titulo);
        if (item) {
          this.livroNaBiblioteca = true;
          this.statusLocal = item.status || '';
          this.avaliacaoUsuario = item.avaliacao || 0;
          this.comentarioUsuario = item.comentario || '';
        }
      },
      error: (err) => console.error('Erro ao carregar biblioteca:', err)
    });
  }

  // ⬅ Aqui está a correção principal: alterna corretamente
  marcarStatus(status: StatusLivro): void {
    this.statusLocal = this.statusLocal === status ? '' : status;
  }

  getRatingArray(): number[] { return [1, 2, 3, 4, 5]; }
  setRating(r: number): void { this.avaliacaoUsuario = r; }
  setHoverRating(r: number): void { this.hoverRating = r; }
  resetHoverRating(): void { this.hoverRating = 0; }

  atualizarLivroNoBanco(): void {
    if (!this.livro) return;

    const token = localStorage.getItem('token');
    if (!token) { alert('Você precisa estar logado!'); return; }

    const body: any = {
      avaliacao: this.avaliacaoUsuario,
      comentario: this.comentarioUsuario
    };
    if (this.statusLocal) body.status = this.statusLocal;

    const tituloEncoded = encodeURIComponent(this.livro.titulo);

    // 🔥 AQUI ESTÁ A CORREÇÃO:
    if (this.livroNaBiblioteca) {
      // Já existe → PUT direto
      this.http.put(
        `http://localhost:5010/usuario/biblioteca/atualizar/${tituloEncoded}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      ).subscribe({
        next: () => alert('Livro atualizado com sucesso!'),
        error: e => alert(e.error?.erro || 'Erro ao atualizar livro.')
      });

    } else {
      // Não existe → POST
      this.http.post(
        `http://localhost:5010/usuario/biblioteca/post/${tituloEncoded}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      ).subscribe({
        next: () => {
          alert('Livro adicionado à biblioteca!');
          this.livroNaBiblioteca = true;
        },
        error: (err) => {
          alert(err.error?.erro || 'Erro ao adicionar livro.');
        }
      });
    }
  }

}

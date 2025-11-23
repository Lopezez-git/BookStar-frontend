import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importa um JSON local
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

@Component({
  selector: 'app-livro-detalhes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './livro.html',
  styleUrls: ['./livro.css']
})
export class LivroComponent implements OnInit {
  livro: Livro | null = null;
  carregando = true;
  erro = '';

  // Avaliação do usuário
  avaliacaoUsuario = 0;
  hoverRating = 0;
  comentarioUsuario = '';
  livroFinalizado = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buscarDetalhesLivro(id);
    }
  }

  buscarDetalhesLivro(id: string): void {
    this.carregando = true;

    // Procura o livro no JSON local
    const livroEncontrado = (livrosData as Livro[]).find(l => l.id === id);

    if (livroEncontrado) {
      this.livro = livroEncontrado;
      this.carregando = false;
    } else {
      this.erro = 'Livro não encontrado.';
      this.carregando = false;
    }
  }

  // Avaliação
  setRating(rating: number): void {
    this.avaliacaoUsuario = rating;
  }

  setHoverRating(rating: number): void {
    this.hoverRating = rating;
  }

  resetHoverRating(): void {
    this.hoverRating = 0;
  }

  getRatingArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  toggleFinalizado(): void {
    this.livroFinalizado = !this.livroFinalizado;
  }

  salvarAvaliacao(): void {
    if (this.avaliacaoUsuario === 0) {
      alert('Selecione uma avaliação!');
      return;
    }

    const avaliacao = {
      livroId: this.livro?.id,
      rating: this.avaliacaoUsuario,
      comentario: this.comentarioUsuario,
      finalizado: this.livroFinalizado
    };

    console.log('Avaliação salva:', avaliacao);
    alert('Avaliação salva com sucesso!');
  }

  voltar(): void {
    this.router.navigate(['/livros']);
  }
}

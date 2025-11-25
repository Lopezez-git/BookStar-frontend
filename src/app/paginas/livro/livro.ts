import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Importa JSON local
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
  imports: [CommonModule, FormsModule],
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buscarDetalhesLivro(id);
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

  // 🔥 SALVAR AVALIAÇÃO NO BACKEND
  salvarAvaliacao(): void {
    if (!this.livro) {
      alert("Erro: livro não carregado!");
      return;
    }

    if (this.avaliacaoUsuario === 0) {
      alert('Selecione uma avaliação!');
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para salvar.");
      return;
    }

    const body = {
      comentario: this.comentarioUsuario,
      avaliacao: this.avaliacaoUsuario
    };

    const tituloEncoded = encodeURIComponent(this.livro.titulo);

    this.http.post(
      `http://localhost:5010/usuario/biblioteca/post/${tituloEncoded}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (res: any) => {
        console.log("Resposta do backend:", res);
        alert("Avaliação salva com sucesso!");
      },
      error: (err) => {
        console.error("Erro ao salvar avaliação:", err);

        if (err.error?.erro === "Livro já está na biblioteca do usuário.") {
          alert("Este livro já está na sua biblioteca!");
        } else {
          alert(err.error?.erro || "Erro ao salvar avaliação.");
        }
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/livros']);
  }
}

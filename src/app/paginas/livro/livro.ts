import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  
  // Status do livro: 'quero ler', 'estou lendo', 'concluido'
  statusLivro: string = '';
  livroNaBiblioteca = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.buscarDetalhesLivro(id);
      this.carregarStatusLivro();
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

  // 🔥 Carregar status do livro da biblioteca
  carregarStatusLivro(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any>('http://localhost:5010/usuario/biblioteca', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (biblioteca) => {
        if (!this.livro) return;

        // Procura o livro atual na biblioteca
        const livroNaBib = biblioteca.find((item: any) => 
          item.id_livro == this.livro!.id
        );

        if (livroNaBib) {
          this.livroNaBiblioteca = true;
          this.statusLivro = livroNaBib.status || '';
          this.avaliacaoUsuario = livroNaBib.avaliacao || 0;
          this.comentarioUsuario = livroNaBib.comentario || '';
        }
      },
      error: (err) => {
        console.log('Erro ao carregar biblioteca:', err);
      }
    });
  }

  // Verifica se o livro está concluído
  get livroFinalizado(): boolean {
    return this.statusLivro === 'concluido';
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

  // 🔥 Toggle status concluído
  toggleFinalizado(): void {
    if (!this.livro) {
      alert('Erro: livro não carregado!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado!');
      return;
    }

    // Se não está na biblioteca, adiciona primeiro
    if (!this.livroNaBiblioteca) {
      this.adicionarLivroNaBiblioteca('concluido');
      return;
    }

    // Alterna entre concluído e não concluído
    const novoStatus = this.statusLivro === 'concluido' ? 'estou lendo' : 'concluido';

    // Atualiza no backend
    this.http.put(
      `http://localhost:5010/usuario/biblioteca/status/${this.livro.id}`,
      { status: novoStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res: any) => {
        this.statusLivro = novoStatus;
        console.log('Status atualizado:', res);
        const msg = novoStatus === 'concluido' ? 'concluído' : 'em leitura';
        alert(`Livro marcado como ${msg}!`);
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        alert(err.error?.erro || 'Erro ao atualizar status do livro.');
      }
    });
  }

  // 🔥 Adicionar livro na biblioteca com status inicial
  adicionarLivroNaBiblioteca(statusInicial: string = 'quero ler'): void {
    if (!this.livro) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado!');
      return;
    }

    const tituloEncoded = encodeURIComponent(this.livro.titulo);

    this.http.post(
      `http://localhost:5010/usuario/biblioteca/post/${tituloEncoded}`,
      {
        comentario: this.comentarioUsuario || '',
        avaliacao: this.avaliacaoUsuario || 0
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res: any) => {
        this.livroNaBiblioteca = true;
        
        // Depois de adicionar, atualiza o status para concluído se necessário
        if (statusInicial === 'concluido') {
          this.http.put(
            `http://localhost:5010/usuario/biblioteca/status/${this.livro!.id}`,
            { status: statusInicial },
            { headers: { Authorization: `Bearer ${token}` }}
          ).subscribe({
            next: () => {
              this.statusLivro = statusInicial;
              alert('Livro adicionado e marcado como concluído!');
            }
          });
        } else {
          this.statusLivro = 'quero ler';
          alert('Livro adicionado à biblioteca!');
        }
      },
      error: (err) => {
        console.error('Erro ao adicionar livro:', err);
        alert(err.error?.erro || 'Erro ao adicionar livro.');
      }
    });
  }

  // 🔥 SALVAR AVALIAÇÃO
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
        this.livroNaBiblioteca = true;
        alert("Avaliação salva com sucesso!");
      },
      error: (err) => {
        console.error("Erro ao salvar avaliação:", err);

        if (err.error?.erro === "Livro já está na biblioteca do usuário.") {
          alert("Este livro já está na sua biblioteca! Use o botão de status para atualizar.");
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
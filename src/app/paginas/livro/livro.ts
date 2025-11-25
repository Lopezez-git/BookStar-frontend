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

  // Avaliação do usuário
  avaliacaoUsuario = 0;
  hoverRating = 0;
  comentarioUsuario = '';
  
  // Status do livro (apenas local até salvar)
  statusLocal: StatusLivro = '';
  livroNaBiblioteca = false;
  statusAtualNoBanco: StatusLivro = '';

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

        const livroNaBib = biblioteca.find((item: any) => 
          item.id_livro == this.livro!.id
        );

        if (livroNaBib) {
          this.livroNaBiblioteca = true;
          this.statusAtualNoBanco = livroNaBib.status || '';
          this.statusLocal = livroNaBib.status || '';
          this.avaliacaoUsuario = livroNaBib.avaliacao || 0;
          this.comentarioUsuario = livroNaBib.comentario || '';
        }
      },
      error: (err) => {
        console.log('Erro ao carregar biblioteca:', err);
      }
    });
  }

  // Getters para verificar status
  get isQueroLer(): boolean {
    return this.statusLocal === 'quero ler';
  }

  get isEstouLendo(): boolean {
    return this.statusLocal === 'estou lendo';
  }

  get isConcluido(): boolean {
    return this.statusLocal === 'concluido';
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

  // 🔥 Marcar status (local ou no banco)
  marcarStatus(novoStatus: StatusLivro): void {
    if (this.livroNaBiblioteca) {
      // Se já está no banco, atualiza diretamente
      this.atualizarStatusNoBanco(novoStatus);
    } else {
      // Se não está no banco, apenas marca localmente
      this.statusLocal = this.statusLocal === novoStatus ? '' : novoStatus;
      console.log('Status local alterado:', this.statusLocal);
    }
  }

  // 🔥 Atualizar status diretamente no banco (quando já existe)
  atualizarStatusNoBanco(novoStatus: StatusLivro): void {
    if (!this.livro) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado!');
      return;
    }

    this.http.put(
      `http://localhost:5010/usuario/biblioteca/status/${this.livro.id}`,
      { status: novoStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).subscribe({
      next: (res: any) => {
        this.statusLocal = novoStatus;
        this.statusAtualNoBanco = novoStatus;
        console.log('Status atualizado no banco:', res);
        
        const mensagens: Record<StatusLivro, string> = {
          'quero ler': 'adicionado à lista "Quero Ler"',
          'estou lendo': 'marcado como "Estou Lendo"',
          'concluido': 'marcado como concluído',
          '': ''
        };
        
        alert(`Livro ${mensagens[novoStatus]}!`);
      },
      error: (err) => {
        console.error('Erro ao atualizar status:', err);
        alert(err.error?.erro || 'Erro ao atualizar status do livro.');
      }
    });
  }

  // 🔥 SALVAR AVALIAÇÃO (adiciona ao banco com todos os dados)
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
        console.log("Resposta completa do backend:", res);
        this.livroNaBiblioteca = true;
        
        const idLivroNoBanco = res.livro;
        console.log("ID do livro no banco:", idLivroNoBanco);
        
        // Se o usuário marcou algum status, atualiza
        if (this.statusLocal && idLivroNoBanco) {
          this.http.put(
            `http://localhost:5010/usuario/biblioteca/status/${idLivroNoBanco}`,
            { status: this.statusLocal },
            { headers: { Authorization: `Bearer ${token}` }}
          ).subscribe({
            next: () => {
              this.statusAtualNoBanco = this.statusLocal;
              const mensagens: Record<StatusLivro, string> = {
                'quero ler': 'e adicionado à lista "Quero Ler"',
                'estou lendo': 'e marcado como "Estou Lendo"',
                'concluido': 'e marcado como concluído',
                '': ''
              };
              alert(`Avaliação salva ${mensagens[this.statusLocal]}!`);
            },
            error: (err) => {
              console.error('Erro ao atualizar status:', err);
              console.error('Detalhes do erro:', err.error);
              alert("Avaliação salva, mas houve erro ao atualizar o status.");
            }
          });
        } else {
          alert("Avaliação salva com sucesso!");
        }
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
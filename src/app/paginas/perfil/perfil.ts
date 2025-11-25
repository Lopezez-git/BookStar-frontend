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
  usernameUsario: string = '';
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
    this.http.get<any>('http://localhost:5010/usuario/perfil').subscribe({
      next: (res) => {
        this.nomeUsuario = res.nome;
        this.usernameUsario = res.username;
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

    this.http.get<any>(url).subscribe({
      next: (res) => {
        console.log('📦 Resposta completa do backend:', res);
        
        const lista = res.livros || [];
        console.log('📚 Lista de livros bruta:', lista);

        this.livrosFiltrados = lista.map((l: any) => {
          console.log(`📖 Livro: ${l.titulo}`);
          console.log(`   ⭐ Avaliação recebida:`, l.avaliacao);
          console.log(`   ⭐ Tipo:`, typeof l.avaliacao);
          
          return {
            id: l.id,
            titulo: l.titulo,
            autor: l.autores,
            capa: `http://localhost:5010${l.capa_url}`,
            avaliacao: l.avaliacao || 0,
            status: l.status
          };
        });

        console.log('✅ Livros processados:', this.livrosFiltrados);
      },

      error: (err) => {
        console.error("❌ Erro ao carregar livros:", err);
        this.livrosFiltrados = [];
      }
    });
  }

  trocarFoto(event: any) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const formData = new FormData();
    formData.append('imagem', arquivo);

    // Pré-visualização da imagem
    const leitor = new FileReader();
    leitor.onload = () => (this.previewImagem = leitor.result as string);
    leitor.readAsDataURL(arquivo);

    this.http.put('http://localhost:5010/usuario/perfil/capa', formData).subscribe({
      next: (res: any) => {
        console.log("Upload OK:", res);

        // Atualiza a foto que veio do backend
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
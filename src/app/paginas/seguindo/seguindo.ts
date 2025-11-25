import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthHeaderComponent } from "../../auth-header/auth-header";

interface Usuario {
  id: number;
  nome: string;
  avatar: string;
}

@Component({
  selector: 'app-seguindo',
  standalone: true,
  imports: [CommonModule, AuthHeaderComponent],
  templateUrl: './seguindo.html',
  styleUrls: ['./seguindo.css']
})
export class SeguindoComponent {
  
  usuarioPrincipal = {
    nome: 'Jonathan Bennett',
    avatar: 'assets/jonathan.jpg',
    seguidores: 4,
    seguindo: 4
  };

 usuariosSeguindo: Usuario[] = [
  { id: 1, nome: 'Allan Lopes', avatar: '/Allan Lopes.jpg' },
  { id: 2, nome: 'Lethicia Nobre', avatar: '/Lethicia-Nobre.png' },
  { id: 3, nome: 'Ana Carolina', avatar: '/Ana Carolina.jpg' },
  { id: 4, nome: 'Thalyta Cristina', avatar: '/Thalyta Cristina.jpg' }
];


  // FOTO DO USUÁRIO
  previewImagem: string | null = null;
  fotoUsuario: string = this.usuarioPrincipal.avatar;

  // GETTERS PARA BATER COM O HTML
  get nomeUsuario() {
    return this.usuarioPrincipal.nome;
  }

  get seguidores() {
    return this.usuarioPrincipal.seguidores;
  }

  get seguindo() {
    return this.usuarioPrincipal.seguindo;
  }

  get listaSeguindo() {
    return this.usuariosSeguindo;
  }

  // FUNÇÃO DE TROCAR FOTO
  trocarFoto(event: any) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImagem = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // FUNÇÃO DE REMOVER SEGUIDO
  deixarDeSeguir(nome: string) {
    this.usuariosSeguindo = this.usuariosSeguindo.filter(u => u.nome !== nome);
    this.usuarioPrincipal.seguindo--;
  }
}

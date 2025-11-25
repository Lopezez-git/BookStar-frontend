import { Routes } from '@angular/router';
import { HomeComponent } from './paginas/home/home';
import { Cadastro } from './paginas/cadastro/cadastro';
import { LoginComponent } from './paginas/login/login';
import { LivrosComponent } from './paginas/livros/livros';
import { LivroComponent } from './paginas/livro/livro';
import { AuthGuard } from './auth.guard';
import { Perfil } from './paginas/perfil/perfil';
import { SeguindoComponent } from './paginas/seguindo/seguindo';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'cadastro', component: Cadastro },
    { path: 'login', component: LoginComponent },
    { path: 'livros', component: LivrosComponent },
    { path: 'livro/:id', component: LivroComponent },
    { path: 'perfil', component: Perfil, canActivate: [AuthGuard] },
    { path: 'seguindo', component: SeguindoComponent, canActivate: [AuthGuard] },
];
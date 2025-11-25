import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  livrosPopulares: any[] = [];
  livrosPremiados: any[] = [];

  constructor() {}

  ngOnInit() {
    // Apenas exemplo — depois você troca pelas imagens reais

    this.livrosPopulares = [
      { img: '/livros/livro1.png' },
      { img: '/livros/livro2.png' },
      { img: '/livros/livro3.png' },
      { img: '/livros/livro4.png' },
      { img: '/livros/livro5.png' },
      { img: '/livros/livro6.png' },
      { img: '/livros/livro7.png' },
      { img: '/livros/livro8.png' },
      { img: '/livros/livro9.png' },
      { img: '/livros/livro10.png' },
      { img: '/livros/livro11.png' },
      { img: '/livros/livro12.png' },
      { img: '/livros/livro13.png' },
      { img: '/livros/livro14.png' },
      { img: '/livros/livro15.png' },
      { img: '/livros/livro16.png' },
      { img: '/livros/livro17.png' },
      { img: '/livros/livro18.png' },
      { img: '/livros/livro19.png' },
      { img: '/livros/livro20.png' },
      { img: '/livros/livro21.png' },
      { img: '/livros/livro22.png' },
      { img: '/livros/livro23.png' },
      { img: '/livros/livro24.png' },
      
    ];

    this.livrosPremiados = [
      { img: '/livros/livro24.png' },
      { img: '/livros/livro23.png' },
      { img: '/livros/livro22.png' },
      { img: '/livros/livro21.png' },
      { img: '/livros/livro20.png' },
      { img: '/livros/livro19.png' },
      { img: '/livros/livro18.png' },
      { img: '/livros/livro17.png' },
      { img: '/livros/livro16.png' },
      { img: '/livros/livro15.png' },
      { img: '/livros/livro14.png' },
      { img: '/livros/livro13.png' },
      { img: '/livros/livro12.png' },
      { img: '/livros/livro11.png' },
      { img: '/livros/livro10.png' },
      { img: '/livros/livro9.png' },
      { img: '/livros/livro8.png' },
      { img: '/livros/livro7.png' },
      { img: '/livros/livro6.png' },
      { img: '/livros/livro5.png' },
      { img: '/livros/livro4.png' },
      { img: '/livros/livro3.png' },
      { img: '/livros/livro2.png' },
      { img: '/livros/livro1.png' },

    ];
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LivrosService } from '../../services/livros.service';
import { HeaderComponent } from "../../header/header";

@Component({
  selector: 'app-livros',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './livros.html',
  styleUrls: ['./livros.css'],
  providers: [LivrosService]
})
export class LivrosComponent implements OnInit {
  livrosPopulares: any[] = [];

  constructor() { }

  ngOnInit() {
    // Apenas exemplo — depois você troca pelas imagens reais

    this.livrosPopulares = [
      {id: 1, img: '/livros/livro1.png' },
      {id: 2, img: '/livros/livro2.png' },
      {id: 3, img: '/livros/livro3.png' },
      {id: 4, img: '/livros/livro4.png' },
      {id: 5, img: '/livros/livro5.png' },
      {id: 6, img: '/livros/livro6.png' },
      {id: 7, img: '/livros/livro7.png' },
      {id: 8, img: '/livros/livro8.png' },
      {id: 9, img: '/livros/livro9.png' },
      {id: 10, img: '/livros/livro10.png' },
      {id: 11, img: '/livros/livro11.png' },
      {id: 12, img: '/livros/livro12.png' },
      {id: 13, img: '/livros/livro13.png' },
      {id: 14, img: '/livros/livro14.png' },
      {id: 15, img: '/livros/livro15.png' },
      {id: 16, img: '/livros/livro16.png' },
      {id: 17, img: '/livros/livro17.png' },
      {id: 18, img: '/livros/livro18.png' },
      {id: 19, img: '/livros/livro19.png' },
      {id: 20, img: '/livros/livro20.png' },
      {id: 21, img: '/livros/livro21.png' },
      {id: 22, img: '/livros/livro22.png' },
      {id: 23, img: '/livros/livro23.png' },
      {id: 24, img: '/livros/livro24.png' },
      {id: 25, img: '/livros/livro25.png' },
      {id: 26, img: '/livros/livro26.png' },
      {id: 27, img: '/livros/livro27.png' },
      {id: 28, img: '/livros/livro28.jpg' },
      {id: 29, img: '/livros/livro29.jpg' },
      {id: 30, img: '/livros/livro30.jpg' },
      {id: 31, img: '/livros/livro31.jpg' },
      {id: 32, img: '/livros/livro32.jpg' },
      {id: 33, img: '/livros/livro33.jpg' },
      {id: 34, img: '/livros/livro34.jpg' },
      {id: 35, img: '/livros/livro35.jpg' },


    ];
  }
}

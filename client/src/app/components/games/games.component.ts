import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../services/games/games.service';

@Component({
  selector: 'app-games',
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  games: any[] = [];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    this.gamesService.getGames().subscribe({
      next: (data) => {
        let gamesList = data.games || [];
        
        // Ordenar: Cronológicamente por hora de inicio
        gamesList.sort((a: any, b: any) => {
          return new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime();
        });
        
        this.games = gamesList;
      },
      error: (err) => console.error('Error fetching games:', err)
    });
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
  }
}

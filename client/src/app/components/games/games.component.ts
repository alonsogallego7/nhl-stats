import { Component, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GamesService } from '../../services/games/games.service';

@Component({
  selector: 'app-games',
  imports: [DatePipe],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  private gamesService = inject(GamesService);
  private router = inject(Router);

  goToGame(id: number) {
    this.router.navigate(['/games', id]);
  }

  games: any[] = [];
  isLoading: boolean = true;

  ngOnInit() {
    this.gamesService.getGames().subscribe({
      next: (data) => {
        let gamesList = data.games || [];
        
        // Ordenar: Cronológicamente por hora de inicio
        gamesList.sort((a: any, b: any) => {
          return new Date(a.startTimeUTC).getTime() - new Date(b.startTimeUTC).getTime();
        });
        
        this.games = gamesList;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.isLoading = false;
      }
    });
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
  }
}

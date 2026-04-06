import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';
import { GamesService, GameEvent } from '../../services/games/games.service';

@Component({
  selector: 'app-game-center',
  imports: [CommonModule, RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './game-center.component.html',
  styleUrl: './game-center.component.css'
})
export class GameCenterComponent implements OnInit {
  isLoading = true;
  games: GameEvent[] = [];

  private gamesService = inject(GamesService);
  private router = inject(Router);

  goToGame(id: number) {
    this.router.navigate(['/games', id]);
  }

  ngOnInit() {
    this.gamesService.getGames().subscribe({
      next: (data) => {
        this.games = data.games || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.isLoading = false;
      }
    });
  }

  getGameStatus(game: GameEvent): string {
    if (game.gameState === 'FINAL') {
      return 'Final';
    }
    
    if (game.gameState === 'LIVE' || game.gameState === 'CRIT') {
      const period = this.getPeriodString(game.periodDescriptor?.number);
      const remaining = game.clock?.inIntermission ? 'Intermission' : (game.clock?.timeRemaining || '');
      return `${period} | ${remaining}`.trim();
    }
    
    // OFF, scheduled, upcoming... Format time to local
    return new Date(game.startTimeUTC).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isLive(game: GameEvent): boolean {
    return game.gameState === 'LIVE' || game.gameState === 'CRIT';
  }

  private getPeriodString(num: number | undefined): string {
    if (!num) return '';
    if (num === 1) return '1st';
    if (num === 2) return '2nd';
    if (num === 3) return '3rd';
    if (num === 4) return 'OT';
    if (num > 4) return `SO`;
    return `${num}`;
  }
}

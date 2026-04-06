import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';
import { GamesService } from '../../services/games/games.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent implements OnInit {
  isLoading = true;
  gameData: any = null;
  error = false;

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private gamesService = inject(GamesService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchGame(id);
      } else {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  fetchGame(id: string) {
    this.isLoading = true;
    this.gamesService.getGameBoxscore(id).subscribe({
      next: (data) => {
        this.gameData = data;
        this.isLoading = false;
        this.error = false;
      },
      error: (err) => {
        console.error('Error fetching game details', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

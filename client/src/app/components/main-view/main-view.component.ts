import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GamesComponent } from '../games/games.component';
import { StatsPreviewComponent } from '../stats-preview/stats-preview.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';
import { GamesService } from '../../services/games/games.service';
import { StatsService } from '../../services/stats/stats.service';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [GamesComponent, StatsPreviewComponent, NavbarComponent, RouterLink, LoadingComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent implements OnInit {
  isLoading = true;

  constructor(
    private gamesService: GamesService,
    private statsService: StatsService
  ) {}

  ngOnInit() {
    forkJoin([
      this.gamesService.getGames(),
      this.statsService.getLeaders(),
      this.statsService.getTeamLeaders()
    ]).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { GamesComponent } from '../games/games.component';
import { StatsPreviewComponent } from '../stats-preview/stats-preview.component';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [GamesComponent, StatsPreviewComponent],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {
}

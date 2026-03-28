import { Routes } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';
import { TeamsComponent } from './components/teams/teams.component';
import { PlayersComponent } from './components/players/players.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';

export const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'players/:id', component: PlayerDetailComponent }
];



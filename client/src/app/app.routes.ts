import { Routes } from '@angular/router';
import { MainViewComponent } from './components/main-view/main-view.component';
import { TeamsComponent } from './components/teams/teams.component';
import { PlayersComponent } from './components/players/players.component';
import { PlayerDetailComponent } from './components/player-detail/player-detail.component';
import { StandingsFullComponent } from './components/standings-full/standings-full.component';
import { TeamDetailComponent } from './components/team-detail/team-detail.component';
import { StatsFullComponent } from './components/stats-full/stats-full.component';
import { GameCenterComponent } from './components/game-center/game-center.component';
import { GameDetailComponent } from './components/game-detail/game-detail.component';

export const routes: Routes = [
  { path: '', component: MainViewComponent },
  { path: 'standings', component: StandingsFullComponent },
  { path: 'statistics', component: StatsFullComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/:abbrev', component: TeamDetailComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'games', component: GameCenterComponent },
  { path: 'games/:id', component: GameDetailComponent }
];



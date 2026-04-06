import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';
import { StatsService, StatLeader, TeamLeader } from '../../services/stats/stats.service';

@Component({
  selector: 'app-stats-full',
  imports: [RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './stats-full.component.html',
  styleUrl: './stats-full.component.css'
})
export class StatsFullComponent implements OnInit {
  isLoading = true;

  activeTab: 'players' | 'teams' = 'players';

  // Player / Goalie leaders
  pointsLeaders:       StatLeader[] = [];
  goalsLeaders:        StatLeader[] = [];
  assistsLeaders:      StatLeader[] = [];
  plusMinusLeaders:    StatLeader[] = [];
  penaltyMinsLeaders:  StatLeader[] = [];
  goalieWins:          StatLeader[] = [];
  goalieSavePctg:      StatLeader[] = [];

  // Team leaders
  teamPoints:          TeamLeader[] = [];
  teamGoalsFor:        TeamLeader[] = [];
  teamGoalDiff:        TeamLeader[] = [];
  teamGoalAgainst:     TeamLeader[] = [];

  private statsService = inject(StatsService);

  ngOnInit() {
    let playersLoaded = false;
    let teamsLoaded   = false;

    const checkDone = () => {
      if (playersLoaded && teamsLoaded) this.isLoading = false;
    };

    this.statsService.getLeaders().subscribe({
      next: (data) => {
        this.pointsLeaders    = data.points          ?? [];
        this.goalsLeaders     = data.goals           ?? [];
        this.assistsLeaders   = data.assists         ?? [];
        this.plusMinusLeaders   = data.plusMinus        ?? [];
        this.penaltyMinsLeaders = data.penaltyMins      ?? [];
        this.goalieWins         = data.goalieWins       ?? [];
        this.goalieSavePctg   = data.goalieSavePctg   ?? [];
        playersLoaded = true;
        checkDone();
      },
      error: () => { playersLoaded = true; checkDone(); }
    });

    this.statsService.getTeamLeaders().subscribe({
      next: (data) => {
        this.teamPoints      = data.points          ?? [];
        this.teamGoalsFor    = data.goalsFor         ?? [];
        this.teamGoalDiff    = data.goalDifferential ?? [];
        this.teamGoalAgainst = data.goalAgainst      ?? [];
        teamsLoaded = true;
        checkDone();
      },
      error: () => { teamsLoaded = true; checkDone(); }
    });
  }

  setTab(tab: 'players' | 'teams') {
    this.activeTab = tab;
  }

  fullName(leader: StatLeader): string {
    return `${leader.firstName?.default ?? ''} ${leader.lastName?.default ?? ''}`.trim();
  }

  formatSavePctg(value: number): string {
    return value != null ? value.toFixed(3) : '—';
  }
}

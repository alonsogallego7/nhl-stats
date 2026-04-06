import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatsService, StatLeader, TeamLeader } from '../../services/stats/stats.service';

@Component({
  selector: 'app-stats-preview',
  imports: [RouterLink],
  templateUrl: './stats-preview.component.html',
  styleUrls: ['./stats-preview.component.css']
})
export class StatsPreviewComponent implements OnInit {
  private statsService = inject(StatsService);

  viewMode: 'players' | 'teams' = 'players';

  // Player Leaders
  pointsLeaders: StatLeader[] = [];
  goalsLeaders: StatLeader[] = [];
  assistsLeaders: StatLeader[] = [];

  // Team Leaders
  teamPointsLeaders: TeamLeader[] = [];
  teamGoalsForLeaders: TeamLeader[] = [];
  teamGoalDiffLeaders: TeamLeader[] = [];

  ngOnInit(): void {
    // Fetch Player Stats
    this.statsService.getLeaders().subscribe({
      next: (data) => {
        this.pointsLeaders = data.points;
        this.goalsLeaders = data.goals;
        this.assistsLeaders = data.assists;
      },
      error: (err) => console.error('Error fetching player stats leaders', err)
    });

    // Fetch Team Stats
    this.statsService.getTeamLeaders().subscribe({
      next: (data) => {
        this.teamPointsLeaders = data.points;
        this.teamGoalsForLeaders = data.goalsFor;
        this.teamGoalDiffLeaders = data.goalDifferential;
      },
      error: (err) => console.error('Error fetching team stats leaders', err)
    });
  }

  setViewMode(mode: 'players' | 'teams') {
    this.viewMode = mode;
  }
}

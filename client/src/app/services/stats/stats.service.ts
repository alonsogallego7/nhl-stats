import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatLeader {
  id: number;
  firstName: { default: string };
  lastName: { default: string; cs?: string; fi?: string; sk?: string };
  sweaterNumber: number;
  headshot: string;
  teamAbbrev: string;
  teamName: { default: string };
  teamLogo: string;
  position: string;
  value: number;
}

export interface StatsResponse {
  points:           StatLeader[];
  goals:            StatLeader[];
  assists:          StatLeader[];
  plusMinus:        StatLeader[];
  penaltyMins:      StatLeader[];
  goalieWins:       StatLeader[];
  goalieSavePctg:   StatLeader[];
}

export interface TeamLeader {
  id: string;
  teamName: { default: string };
  teamAbbrev: string;
  teamLogo: string;
  value: number | string;
}

export interface TeamStatsResponse {
  points:           TeamLeader[];
  goalsFor:         TeamLeader[];
  goalDifferential: TeamLeader[];
  goalAgainst:      TeamLeader[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  private leadersCache$: Observable<StatsResponse> | null = null;
  private teamLeadersCache$: Observable<TeamStatsResponse> | null = null;

  getLeaders(): Observable<StatsResponse> {
    if (!this.leadersCache$) {
      this.leadersCache$ = this.http.get<StatsResponse>(`${this.apiUrl}/stats/leaders`).pipe(
        shareReplay(1)
      );
    }
    return this.leadersCache$;
  }

  getTeamLeaders(): Observable<TeamStatsResponse> {
    if (!this.teamLeadersCache$) {
      this.teamLeadersCache$ = this.http.get<TeamStatsResponse>(`${this.apiUrl}/stats/team-leaders`).pipe(
        shareReplay(1)
      );
    }
    return this.teamLeadersCache$;
  }
}

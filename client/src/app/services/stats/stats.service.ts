import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  points: StatLeader[];
  goals: StatLeader[];
  assists: StatLeader[];
}

export interface TeamLeader {
  id: string;
  teamName: { default: string };
  teamAbbrev: string;
  teamLogo: string;
  value: number | string;
}

export interface TeamStatsResponse {
  points: TeamLeader[];
  goalsFor: TeamLeader[];
  goalDifferential: TeamLeader[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getLeaders(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.apiUrl}/stats/leaders`);
  }

  getTeamLeaders(): Observable<TeamStatsResponse> {
    return this.http.get<TeamStatsResponse>(`${this.apiUrl}/stats/team-leaders`);
  }
}


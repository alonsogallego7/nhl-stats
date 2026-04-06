import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BoxTeam {
  id: number;
  abbrev: string;
  score?: number;
  sog?: number;
  logo: string;
}

export interface GameEvent {
  id: number;
  gameDate: string;
  venue: { default: string };
  startTimeUTC: string;
  gameState: 'OFF' | 'LIVE' | 'CRIT' | 'FINAL';
  awayTeam: BoxTeam;
  homeTeam: BoxTeam;
  clock?: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  periodDescriptor?: {
    number: number;
    periodType: string;
  };
}

export interface ScoreResponse {
  currentDate: string;
  games: GameEvent[];
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesCache$: Observable<ScoreResponse> | null = null;
  private http = inject(HttpClient);

  getGames(): Observable<ScoreResponse> {
    if (!this.gamesCache$) {
      this.gamesCache$ = this.http.get<ScoreResponse>(`${environment.apiUrl}/games/score/now`).pipe(
        shareReplay(1)
      );
    }
    return this.gamesCache$;
  }
}

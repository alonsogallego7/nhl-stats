import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getGames(): Observable<any> {
    if (!this.gamesCache$) {
      this.gamesCache$ = this.http.get('http://localhost:3000/games/score/now').pipe(
        shareReplay(1)
      );
    }
    return this.gamesCache$;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private gamesCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getGames(): Observable<any> {
    if (!this.gamesCache$) {
      this.gamesCache$ = this.http.get(`${environment.apiUrl}/games/score/now`).pipe(
        shareReplay(1)
      );
    }
    return this.gamesCache$;
  }
}

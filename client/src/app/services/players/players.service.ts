import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private playersCache$: Observable<any[]> | null = null;

  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<any[]> {
    if (!this.playersCache$) {
      this.playersCache$ = this.http.get<any[]>('http://localhost:3000/players/all').pipe(
        shareReplay(1)
      );
    }
    return this.playersCache$;
  }
}

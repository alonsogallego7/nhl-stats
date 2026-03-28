import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  private playersCache$: Observable<any[]> | null = null;
  private playerDetailCache$: Map<number, Observable<any>> = new Map();

  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<any[]> {
    if (!this.playersCache$) {
      this.playersCache$ = this.http.get<any[]>('http://localhost:3000/players/all').pipe(
        shareReplay(1)
      );
    }
    return this.playersCache$;
  }

  getPlayerById(id: number): Observable<any> {
    if (!this.playerDetailCache$.has(id)) {
      const request$ = this.http.get<any>(`http://localhost:3000/players/player/${id}`).pipe(
        shareReplay(1)
      );
      this.playerDetailCache$.set(id, request$);
    }
    return this.playerDetailCache$.get(id)!;
  }
}

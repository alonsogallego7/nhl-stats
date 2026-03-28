import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private teamsCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getTeams(): Observable<any> {
    if (!this.teamsCache$) {
      this.teamsCache$ = this.http.get('http://localhost:3000/teams/all').pipe(
        shareReplay(1)
      );
    }
    return this.teamsCache$;
  }
}

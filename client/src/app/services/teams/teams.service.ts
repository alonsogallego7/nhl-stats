import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private teamsCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getTeams(): Observable<any> {
    if (!this.teamsCache$) {
      this.teamsCache$ = this.http.get(`${environment.apiUrl}/teams/all`).pipe(
        shareReplay(1)
      );
    }
    return this.teamsCache$;
  }

  getTeamByAbbrev(abbrev: string): Observable<any> {
    return this.getTeams().pipe(
      map((teams: any[]) => teams.find(t => t.id === abbrev.toUpperCase()) || null)
    );
  }

  getRoster(triCode: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teams/${triCode.toUpperCase()}`);
  }
}

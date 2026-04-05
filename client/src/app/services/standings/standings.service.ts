import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private standings$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getStandings(): Observable<any> {
    if (!this.standings$) {
      this.standings$ = this.http.get(`${environment.apiUrl}/standings`).pipe(
        shareReplay(1)
      );
    }
    return this.standings$;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private standings$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getStandings(): Observable<any> {
    if (!this.standings$) {
      this.standings$ = this.http.get('http://localhost:3000/standings').pipe(
        shareReplay(1)
      );
    }
    return this.standings$;
  }
}

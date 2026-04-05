import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TeamsService } from '../../services/teams/teams.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-team-detail',
  imports: [RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.css'
})
export class TeamDetailComponent implements OnInit {
  team: any = null;
  forwards: any[] = [];
  defensemen: any[] = [];
  goalies: any[] = [];
  isLoading = true;
  error = false;

  private route = inject(ActivatedRoute);
  private teamsService = inject(TeamsService);
  private location = inject(Location);
  private router = inject(Router);

  ngOnInit() {
    const abbrev = this.route.snapshot.paramMap.get('abbrev') || '';

    forkJoin({
      meta: this.teamsService.getTeamByAbbrev(abbrev),
      roster: this.teamsService.getRoster(abbrev)
    }).subscribe({
      next: ({ meta, roster }) => {
        this.team = meta;
        this.forwards = roster.forwards ?? [];
        this.defensemen = roster.defensemen ?? [];
        this.goalies = roster.goalies ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  goBack() {
    if (window.history.length > 2) {
      this.location.back();
    } else {
      this.router.navigate(['/teams']);
    }
  }

  playerRoute(player: any): string {
    return `/players/${player.id}`;
  }

  formatBirthDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  positionLabel(code: string): string {
    const map: { [k: string]: string } = { C: 'C', L: 'LW', R: 'RW', D: 'D', G: 'G' };
    return map[code] || code;
  }

  get totalPlayers(): number {
    return this.forwards.length + this.defensemen.length + this.goalies.length;
  }
}

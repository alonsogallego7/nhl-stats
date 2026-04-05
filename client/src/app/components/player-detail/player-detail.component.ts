import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../services/players/players.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LoadingComponent],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css'
})
export class PlayerDetailComponent implements OnInit {
  player: any = null;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private playersService: PlayersService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.playersService.getPlayerById(id).subscribe({
      next: (data) => {
        this.player = data;
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
      this.router.navigate(['/players']);
    }
  }

  get currentNHLSeason() {
    return this.player?.featuredStats?.regularSeason?.subSeason;
  }

  get careerRegular() {
    return this.player?.careerTotals?.regularSeason;
  }

  get careerPlayoffs() {
    return this.player?.careerTotals?.playoffs;
  }

  formatHeight(inches: number): string {
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}" (${this.player.heightInCentimeters} cm)`;
  }

  formatBirthDate(dateStr: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
    return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} (age ${age})`;
  }

  formatSeason(s: number): string {
    const y1 = String(s).slice(0, 4);
    const y2 = String(s).slice(6);
    return `${y1}-${y2}`;
  }

  formatPct(val: number): string {
    if (val == null) return '—';
    return (val * 100).toFixed(1) + '%';
  }

  positionFull(code: string): string {
    const map: { [k: string]: string } = { C: 'Center', L: 'Left Wing', R: 'Right Wing', D: 'Defenseman', G: 'Goalie' };
    return map[code] || code;
  }
}

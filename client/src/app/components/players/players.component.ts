import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlayersService } from '../../services/players/players.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-players',
  imports: [FormsModule, RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent implements OnInit {
  allPlayers: any[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';

  private playersService = inject(PlayersService);

  ngOnInit() {
    this.playersService.getAllPlayers().subscribe({
      next: (data) => {
        // Sort all players alphabetically by last name then first name
        this.allPlayers = data.sort((a, b) => {
          const lastCmp = a.lastName.localeCompare(b.lastName);
          return lastCmp !== 0 ? lastCmp : a.firstName.localeCompare(b.firstName);
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching players:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredPlayers(): any[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      // No search → first 30 alphabetically
      return this.allPlayers.slice(0, 30);
    }
    // With search → all matching, alphabetically sorted (already sorted)
    return this.allPlayers.filter(p =>
      (p.firstName + ' ' + p.lastName).toLowerCase().includes(q) ||
      p.teamAbbrev.toLowerCase().includes(q) ||
      p.teamName.toLowerCase().includes(q)
    );
  }

  positionLabel(code: string): string {
    const map: { [key: string]: string } = {
      C: 'Center', L: 'Left Wing', R: 'Right Wing', D: 'Defense', G: 'Goalie'
    };
    return map[code] || code;
  }
}

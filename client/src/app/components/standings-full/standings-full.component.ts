import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StandingsService } from '../../services/standings/standings.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-standings-full',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './standings-full.component.html',
  styleUrl: './standings-full.component.css'
})
export class StandingsFullComponent implements OnInit {
  isLoading: boolean = true;

  conferences: {
    conferenceName: string;
    divisions: {
      divisionName: string;
      teams: any[];
    }[];
  }[] = [];

  constructor(private standingsService: StandingsService) {}

  ngOnInit() {
    this.standingsService.getStandings().subscribe({
      next: (data) => {
        if (data && data.standings) {
          this.processStandings(data.standings);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching standings:', err);
        this.isLoading = false;
      }
    });
  }

  processStandings(standings: any[]) {
    const confOrder = ['Eastern', 'Western'];
    const confMap = new Map<string, Map<string, any[]>>();

    standings.forEach(team => {
      const confName = team.conferenceName;
      const divName = team.divisionName;

      if (!confMap.has(confName)) {
        confMap.set(confName, new Map<string, any[]>());
      }
      const divMap = confMap.get(confName)!;
      if (!divMap.has(divName)) {
        divMap.set(divName, []);
      }
      divMap.get(divName)!.push(team);
    });

    this.conferences = confOrder
      .filter(c => confMap.has(c))
      .map(confName => {
        const divMap = confMap.get(confName)!;
        return {
          conferenceName: confName,
          divisions: Array.from(divMap.entries()).map(([divName, teams]) => {
            teams.sort((a, b) => a.divisionSequence - b.divisionSequence);
            return { divisionName: divName, teams };
          })
        };
      });
  }

}

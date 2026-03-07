import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingsService } from '../../services/standings/standings.service';

@Component({
  selector: 'app-standings-full',
  imports: [CommonModule],
  templateUrl: './standings-full.component.html',
  styleUrl: './standings-full.component.css'
})
export class StandingsFullComponent implements OnInit {
  standings: any[] = [];
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
          this.standings = data.standings;
          this.processStandings(this.standings);
        }
      },
      error: (err) => console.error('Error fetching standings:', err)
    });
  }

  processStandings(standings: any[]) {
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

    this.conferences = Array.from(confMap.entries()).map(([confName, divMap]) => {
      return {
        conferenceName: confName,
        divisions: Array.from(divMap.entries()).map(([divName, teams]) => {
          teams.sort((a, b) => a.divisionSequence - b.divisionSequence);
          return {
            divisionName: divName,
            teams: teams
          };
        })
      };
    });
  }
}

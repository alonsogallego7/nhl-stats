import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamsService } from '../../services/teams/teams.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-teams',
  imports: [RouterLink, NavbarComponent, LoadingComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit {
  groupedTeams: { divisionName: string, teams: any[] }[] = [];
  isLoading: boolean = true;

  private teamsService = inject(TeamsService);

  ngOnInit() {
    this.teamsService.getTeams().subscribe({
      next: (data) => {
        const groups: { [key: string]: any[] } = {};
        for (let team of data) {
          if (!groups[team.division]) {
            groups[team.division] = [];
          }
          groups[team.division].push(team);
        }
        
        // Convert to array and sort divisions alphabetically
        this.groupedTeams = Object.keys(groups)
          .sort()
          .map(key => {
            return {
              divisionName: key,
              // Sort teams internally by name
              teams: groups[key].sort((a, b) => a.fullName.localeCompare(b.fullName))
            };
          });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching teams:', err);
        this.isLoading = false;
      }
    });
  }
}

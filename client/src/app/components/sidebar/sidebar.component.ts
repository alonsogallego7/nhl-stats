import { Component } from '@angular/core';
import { StatsPreviewComponent } from '../stats-preview/stats-preview.component';

@Component({
  selector: 'app-sidebar',
  imports: [StatsPreviewComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}

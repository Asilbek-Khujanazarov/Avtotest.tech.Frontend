import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='dashboard-page'><h2>Dashboard</h2></div>`,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {} 
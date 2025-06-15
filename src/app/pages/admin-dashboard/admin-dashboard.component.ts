import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='dashboard-page'><h2>Admin Dashboard</h2></div>`,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {} 
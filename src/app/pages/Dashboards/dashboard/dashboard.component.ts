import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestSessionComponent } from "../test-session/test-session.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TestSessionComponent],
  templateUrl: './dashboard.component.html',
})
  export class DashboardComponent {}
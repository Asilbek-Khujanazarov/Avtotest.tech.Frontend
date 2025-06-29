import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionComponent } from '../question/create-question.component';
import { ManagementQuestionComponent } from "../question-management/question-management.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CreateQuestionComponent, ManagementQuestionComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  activeTab: 'create' | 'manage' = 'create';

  setActiveTab(tab: 'create' | 'manage'): void {
    this.activeTab = tab;
  }
}
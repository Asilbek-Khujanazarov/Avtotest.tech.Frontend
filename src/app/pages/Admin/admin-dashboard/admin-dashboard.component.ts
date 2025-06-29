import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionComponent } from '../question/create-question.component';
import { ManagementQuestionComponent } from '../question-management/question-management.component';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CreateQuestionComponent, ManagementQuestionComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  activeTab: 'create' | 'manage' = 'create';
  isSidebarOpen = false;
  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  isDesktop(): boolean {
    return this.screenWidth >= 768; // Tailwind md breakpoint
  }

  setActiveTab(tab: 'create' | 'manage') {
    this.activeTab = tab;
    if (!this.isDesktop()) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

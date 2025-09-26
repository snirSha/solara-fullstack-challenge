// Example Campaign List Component

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap, startWith } from 'rxjs/operators';
import { CampaignService } from '../../services/campaign.service';
import { Campaign, CampaignStatus } from '../../models/campaign.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../../../environments/environments';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatProgressBarModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})


export class CampaignListComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  selectedStatus: CampaignStatus | '' = '';
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaigns(): void {
    this.isLoading = true;
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load campaigns:', error);
        this.isLoading = false;
      }
    });
  }

  startAutoRefresh(): void {
    // Refresh every 30 seconds to get status updates
    interval(30000)
      .pipe(
        takeUntil(this.destroy$),
        startWith(0),
        switchMap(() => this.campaignService.getCampaigns())
      )
      .subscribe({
        next: (campaigns) => {
          this.campaigns = campaigns;
          this.applyFilters();
        },
        error: (error) => console.error('Auto-refresh failed:', error)
      });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCampaigns = this.selectedStatus
      ? this.campaigns.filter(c => c.status === this.selectedStatus)
      : this.campaigns;
  }

  createCampaign(): void {
    this.router.navigate(['/app/campaigns/create']);
  }

  viewCampaign(id: number): void {
    this.router.navigate(['/app/campaigns', id]);
  }

  retryCampaign(campaign: Campaign): void {
    this.campaignService.deleteCampaign(campaign.id).subscribe({
      next: () => {
        this.router.navigate(['/app/campaigns/create'], {
          queryParams: { prompt: campaign.prompt }
        });
      },
      error: (error) => {
        console.error('Failed to delete campaign before retry:', error);
      }
    });
}

  trackByCampaignId(index: number, campaign: Campaign): number {
    return campaign.id;
  }

  getStatusColor(status: CampaignStatus): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'failed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(status: CampaignStatus): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'autorenew';
      case 'completed': return 'check_circle';
      case 'failed': return 'error';
      default: return 'help';
    }
  }

  getImageUrl(imagePath: string | null): string | null {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiBaseUrl}/output/${imagePath}`;
  }

  deleteCampaign(campaign: Campaign): void {
  this.campaignService.deleteCampaign(campaign.id).subscribe({
    next: () => {
      this.snackBar.open('Campaign deleted successfully.', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.loadCampaigns(); // רענון הרשימה
    },
    error: (error) => {
      this.snackBar.open('Failed to delete campaign.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      console.error('Delete error:', error);
    }
  });
}
  
}
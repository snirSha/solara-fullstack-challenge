import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../models/campaign.model';
import { UserContextService } from '../../services/user-context.service';

// Angular Material imports
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class CampaignDetailsComponent implements OnInit {
  campaign: Campaign | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private userContext: UserContextService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const userId = this.userContext.getUser();
    console.log('userId:', userId);
    if (id && userId) {
      this.campaignService.getCampaignStatus(id).subscribe({
        next: (data) => {
          this.campaign = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load campaign:', err);
          this.isLoading = false;
        }
      });
    }
  }

  getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'completed': return 'primary';
      case 'processing': return 'accent';
      case 'failed': return 'warn';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'autorenew';
      case 'completed': return 'check_circle';
      case 'failed': return 'error';
      default: return 'help';
    }
  }

  // downloadImage(): void {
  //   if (this.campaign?.imagePath) {
  //     console.log(this.campaign?.imagePath);
  //     const link = document.createElement('a');
  //     link.href = this.campaign.imagePath;
  //     link.download = 'campaign-image.png';
  //     link.click();
  //   }
  // }

  // copyLink(): void {
  //   if (this.campaign?.imagePath) {
  //     navigator.clipboard.writeText(this.campaign.imagePath);
  //     alert('Link copied to clipboard!');
  //   }
  // }

  goBack(): void {
    this.router.navigate(['/app/campaigns']);
  }

  get imageUrl(): string | null {
    if (!this.campaign?.imagePath) return null;
    if (this.campaign.imagePath.startsWith('http')) return this.campaign.imagePath;
    return `${environment.apiBaseUrl}/output/${this.campaign.imagePath.replace(/^\/+/, '')}`;
  }
}
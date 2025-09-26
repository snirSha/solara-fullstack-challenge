import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CampaignService } from '../../services/campaign.service';
import { CreateCampaignRequest } from '../../models/campaign.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.scss']
})

export class CampaignCreateComponent implements OnInit {
  campaignForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    const promptFromQuery = this.route.snapshot.queryParamMap.get('prompt'); //For retries
    this.campaignForm = this.fb.group({
      prompt: [promptFromQuery || '', [Validators.required, Validators.minLength(10)]]
    });
  } 

  ngOnInit(): void {
  }

  onSubmit(): void {
    const prompt = this.campaignForm.get('prompt')?.value || '';

    if (this.campaignForm.invalid || this.isGibberish(prompt) || this.isSubmitting) {
      if (this.isGibberish(prompt)) {
        this.snackBar.open('The prompt looks gibberish. Please write something meaningful.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
      return;
    }

    this.isSubmitting = true;

    const request: CreateCampaignRequest = {
      ...this.campaignForm.value,
      userId: localStorage.getItem('userId') || ''
    };

    this.campaignService.createCampaign(request).subscribe({
      next: (campaign) => {
        this.snackBar.open('Campaign created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/app/campaigns']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.snackBar.open(
          error.message || 'Failed to create campaign. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/app/campaigns']);
  }

  isGibberish(text: string): boolean {
    if (!text) return true;

    const cleaned = text.trim();

    // תווים חוזרים בלבד (כמו sssssss או אאאאאא)
    const repeatedChar = /(.)\1{5,}/.test(cleaned);

    // אין רווחים או סימני פיסוק
    const noStructure = /^[a-zA-Zא-ת]{10,}$/.test(cleaned);

    // פחות משתי מילים שונות
    const words = cleaned.split(/\s+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const tooFewWords = uniqueWords.size < 2;
    return repeatedChar || (noStructure && tooFewWords);
  }
}
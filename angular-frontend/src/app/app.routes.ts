import { Routes } from '@angular/router';
import { CampaignCreateComponent } from './components/campaign-create/campaign-create.component';
import { CampaignListComponent } from './components/campaign-list/campaign-list.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { UserGuard } from './guards/user.guard';
import { InternalLayoutComponent } from './layouts/internal-layout/internal-layout.component';
import { CampaignDetailsComponent } from './components/campaign-details/campaign-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: UserSelectorComponent },

  {
    path: 'app',
    component: InternalLayoutComponent,
    canActivate: [UserGuard],
    children: [
      { path: 'campaigns', component: CampaignListComponent },
      { path: 'campaigns/create', component: CampaignCreateComponent },
      { path: 'campaigns/:id', component: CampaignDetailsComponent },
      { path: '', redirectTo: 'campaigns', pathMatch: 'full' } 
    ]
  },

  // fallback ל־404 אם צריך
  { path: '**', redirectTo: 'login' }
];
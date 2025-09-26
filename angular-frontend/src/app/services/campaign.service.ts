import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign, CreateCampaignRequest } from '../models/campaign.model';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private readonly apiUrl = 'http://localhost:3000/api/campaigns';

  constructor(
    private http: HttpClient,
    private userContext: UserContextService
  ) {}

  getCampaigns(): Observable<Campaign[]> {
    const userId = this.userContext.getUser();
    // console.log('Current user in campaign.service.ts and angular:', this.userContext.getUser());
    return this.http.get<Campaign[]>(`${this.apiUrl}?userId=${userId}`);
  }

  createCampaign(request: CreateCampaignRequest): Observable<Campaign> {
    const userId = this.userContext.getUser();
    return this.http.post<Campaign>(this.apiUrl, { ...request, userId });
  }

  getCampaignStatus(id: number): Observable<any> {
    const userId = this.userContext.getUser();
    return this.http.get(`${this.apiUrl}/${id}/status?userId=${userId}`);
  }

  markImageReady(id: number, imagePath: string): Observable<any> {
    const userId = this.userContext.getUser();
    return this.http.post(`${this.apiUrl}/${id}/image-ready`, { imagePath, userId });
  }

  deleteCampaign(id: number): Observable<void> {
    const userId = this.userContext.getUser();
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }
}
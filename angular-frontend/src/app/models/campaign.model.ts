// Example TypeScript interfaces for the Angular frontend

export interface Campaign {
  id: number;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  imagePath?: string;
  generatedText?: string;
  userId: string;
  error: string;
}

export type CampaignStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface CreateCampaignRequest {
  userId: string;
  prompt: string;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}
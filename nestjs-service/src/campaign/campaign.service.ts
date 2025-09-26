import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import axios from 'axios';
import { CreateCampaignDto } from './campaign.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

interface PythonResponse {
  result: string;
  status: string;
}

@Injectable()
export class CampaignService {
  private PYTHON_URL = 'http://python-generator:8000/generate';

  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
    private rabbit: RabbitMQService
  ) {}

  async findByUser(userId: string): Promise<Campaign[]> {
    return this.campaignRepo.find({
      where: { userId },
      order: { id: 'DESC' }
    });
  }

  async create(payload: CreateCampaignDto) {
    const campaign = this.campaignRepo.create({
      userId: payload.userId,
      prompt: payload.prompt,
      status: 'processing',
    });
    await this.campaignRepo.save(campaign);

    try {
      const response = await axios.post<PythonResponse>(this.PYTHON_URL, {
        prompt: payload.prompt,
        campaignId: campaign.id,
        userId: payload.userId,
      });

      campaign.generatedText = response.data.result;
      campaign.status = response.data.status as Campaign['status'];
      await this.campaignRepo.save(campaign);

      // Only if Gemini responded successfully -> we will send request for RabbitMQ
      if (campaign.status !== 'failed') {
        await this.rabbit.sendToQueue({
          prompt: payload.prompt,
          campaignId: campaign.id,
          userId: payload.userId,
        });
      }
    } catch (err) {
      console.error('Error calling Python generator:', err);
      campaign.status = 'failed';
      campaign.error = err?.message || 'Unknown error';
      await this.campaignRepo.save(campaign);
    }

    return {
      campaignId: campaign.id,
      status: campaign.status,
      error: campaign.error,
    };
  }

  async status(id: number, userId: string) {
    const campaign = await this.campaignRepo.findOneBy({ id, userId });
    return campaign || { campaignId: id, status: 'unknown' };
  }

  async markImageReady(campaignId: number, imagePath: string, userId: string) {
    const campaign = await this.campaignRepo.findOneBy({ id: campaignId, userId });
    if (!campaign) return { success: false, message: 'Campaign not found or unauthorized' };

    campaign.imagePath = imagePath;
    campaign.status = 'completed';
    await this.campaignRepo.save(campaign);
    return { success: true };
  }

  async delete(id: number, userId: string): Promise<{ success: boolean; message?: string }> {
    const campaign = await this.campaignRepo.findOneBy({ id, userId });
    if (!campaign) {
      return { success: false, message: 'Campaign not found or unauthorized' };
    }

    await this.campaignRepo.remove(campaign);
    return { success: true };
  }
}
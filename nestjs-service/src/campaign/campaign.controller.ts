import { Body, Controller, Get, Param, Post, Query, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './campaign.dto';

@Controller('api/campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async getCampaigns(@Query('userId') userId: string) {
    return this.campaignService.findByUser(userId);
  }

  @Post()
  async createCampaign(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Get(':id/status')
  async getStatus(
    @Param('id') id: number,
    @Query('userId') userId: string
  ) {
    const numericId = id;
    return this.campaignService.status(numericId, userId);
  }

  @Post(':id/image-ready')
  async markImageReady(
    @Param('id') id: number,
    @Body() body: { imagePath: string; userId: string }
  ) {
    const numericId = id;
    return this.campaignService.markImageReady(numericId, body.imagePath, body.userId);
  }

  @Delete(':id')
  async deleteCampaign(
    @Param('id') id: number,
    @Query('userId') userId: string
  ) {
    return this.campaignService.delete(id, userId);
  }
}
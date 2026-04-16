import { Controller, Post, Body } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';

@Controller('enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Post()
  async create(@Body() createEnquiryDto: CreateEnquiryDto) {
    const enquiry = await this.enquiryService.create(createEnquiryDto);
    return {
      success: true,
      message: 'Enquiry submitted successfully! We will get back to you soon.',
      data: enquiry,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Enquiry, EnquiryDocument } from './schemas/enquiry.schema';
import { Model } from 'mongoose';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<EnquiryDocument>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto): Promise<Enquiry> {
    try {
      const createdEnquiry = new this.enquiryModel(createEnquiryDto);
      const savedEnquiry = await createdEnquiry.save();

      try {
        await this.sendEmail(savedEnquiry);
      } catch (mailError) {
        console.error('Mail Sending Error:', mailError.message);
        // We still return the enquiry even if mail fails, but we log the error
      }

      return savedEnquiry;
    } catch (dbError) {
      console.error('Database Error:', dbError.message);
      throw dbError;
    }
  }

  private async sendEmail(enquiry: Enquiry) {
    const receiver = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');
    
    if (!receiver) {
      console.warn('Warning: CONTACT_RECEIVER_EMAIL not found in environment variables.');
    }

    try {
      await this.mailerService.sendMail({
        to: receiver || 'ydharmender347@gmail.com',
        subject: `⭐ New Action Required: Enquiry from ${enquiry.fullName}`,
        html: `...`, // (Keeping original HTML template)
      });
    } catch (error) {
      throw error;
    }
  }
}

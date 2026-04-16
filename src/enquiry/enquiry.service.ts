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
    const createdEnquiry = new this.enquiryModel(createEnquiryDto);
    const savedEnquiry = await createdEnquiry.save();

    await this.sendEmail(savedEnquiry);

    return savedEnquiry;
  }

  private async sendEmail(enquiry: Enquiry) {
    const receiver = this.configService.get<string>('CONTACT_RECEIVER_EMAIL');
    
    await this.mailerService.sendMail({
      to: receiver,
      subject: `⭐ New Action Required: Enquiry from ${enquiry.fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 40px 20px; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-top: 6px solid #e67e22;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #2c3e50; margin: 0; font-size: 26px; font-weight: 700;">New Enquiry Received</h2>
              <p style="color: #7f8c8d; font-size: 15px; margin-top: 8px;">You have a new lead! Check details below.</p>
            </div>
            
            <div style="background-color: #fcfcfc; border: 1px solid #f0f0f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0; width: 40%;"><strong style="color: #34495e;">👤 Full Name</strong></td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0; color: #2c3e50; font-weight: 500;">${enquiry.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0;"><strong style="color: #34495e;">✉️ Email Address</strong></td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${enquiry.email}" style="color: #3498db; text-decoration: none; font-weight: 500;">${enquiry.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0;"><strong style="color: #34495e;">📞 Phone Number</strong></td>
                  <td style="padding: 14px 10px; border-bottom: 1px solid #f0f0f0; color: #2c3e50; font-weight: 500;">${enquiry.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 10px;"><strong style="color: #34495e;">💼 Service Required</strong></td>
                  <td style="padding: 14px 10px;">
                    <span style="background-color: #e8f4f8; color: #0277bd; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block;">
                      ${enquiry.serviceRequired}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fff9f5; border-left: 4px solid #e67e22; padding: 20px; border-radius: 0 8px 8px 0;">
              <strong style="color: #34495e; display: block; margin-bottom: 10px; font-size: 16px;">📝 Brief Requirement</strong>
              <p style="color: #555; margin: 0; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${enquiry.briefRequirement || '<i style="color: #aaa;">No additional details provided.</i>'}</p>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #95a5a6; font-size: 13px; line-height: 1.5;">This is an automated notification from your website. Please do not reply directly to this email unless responding to the sender's address.</p>
            </div>
          </div>
        </div>
      `,
    });
  }
}

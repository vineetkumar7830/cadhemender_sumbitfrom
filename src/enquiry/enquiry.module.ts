import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { Enquiry, EnquirySchema } from './schemas/enquiry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }]),
  ],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule {}

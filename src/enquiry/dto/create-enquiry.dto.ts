import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnquiryDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  serviceRequired: string;

  @IsOptional()
  @IsString()
  briefRequirement?: string;
}

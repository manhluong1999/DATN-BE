import { Role, UserStatus } from 'src/@core/constants';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/schemas/user.schema';
export class CreatePaymentDto {
  @ApiProperty({
    type: String,
    example: '456',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    type: String,
    example: 'meetingId',
  })
  @IsString()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty({
    example: 1000000,
  })
  amount: number;

  @ApiProperty({
    example: 'description',
  })
  description?: string;
}

export default CreatePaymentDto;

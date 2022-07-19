import { Role, UserStatus } from 'src/@core/constants';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/users/schemas/user.schema';
export class CreateMeetingDto {
  @ApiProperty({
    type: String,
    example: '456',
  })
  @IsString()
  @IsNotEmpty()
  lawyerId: string;

  @ApiProperty({
    type: String,
    example: 'YYYY-MM-DD',
  })
  @IsNotEmpty()
  @IsString()
  meetingDate?: string;

  @ApiProperty({
    example: 1,
  })
  timeCode?: number;
}

export default CreateMeetingDto;

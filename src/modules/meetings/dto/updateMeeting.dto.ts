import { MeetingStatus, Role, UserStatus } from 'src/@core/constants';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateMeetingDto {
  @ApiProperty({
    type: String,
    example: 'meetingId',
  })
  @IsString()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty({
    type: Number,
    example: MeetingStatus.APPROVED,
  })
  @IsString()
  status: MeetingStatus;

  @ApiProperty({
    type: Number,
    example: 1500000,
  })
  price?: number;
}

export default UpdateMeetingDto;

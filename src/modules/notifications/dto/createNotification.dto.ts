import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateNotificationDto {
  @ApiProperty({
    type: String,
    example: '456',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    example: 'content',
  })
  content: string;

  @ApiProperty({
    type: String,
    example: 'url',
  })
  url?: string;
}

export default CreateNotificationDto;

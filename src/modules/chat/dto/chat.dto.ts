import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    type: String,
    example: 'conversationId',
  })
  @IsEmail()
  conversationId: string;

  @ApiProperty({
    type: String,
    example: 'content',
  })
  @IsString()
  content: string;
}

export default ChatDto;

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    type: String,
    example: 'manhluong@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '123456789a',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export default LogInDto;

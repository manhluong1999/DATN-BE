import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    example: 'manhluong@gmail.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    type: String,
    example: 'manh',
  })
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'luong',
  })
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    type: String,
    example: '0123456789',
  })
  phone?: string;

  @ApiProperty({
    type: String,
    example: 'Ha noi',
  })
  address?: string;

  @ApiProperty({
    type: String,
    example: 'http:image/url',
  })
  imgUrl?: string;
}

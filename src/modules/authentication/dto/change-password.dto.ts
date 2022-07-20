import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    example: '123456789a',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  oldPassword: string;

  @ApiProperty({
    type: String,
    example: '123456789a',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  newPassword: string;
}

export default ChangePasswordDto;

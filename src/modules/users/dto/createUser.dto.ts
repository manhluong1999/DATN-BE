import { Role } from "src/@core/constants";
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: "manhluong@gmail.com"
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: "manh"
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    example: "luong"
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: String,
    example: "123456789a"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  role?: Role
}

export default CreateUserDto;

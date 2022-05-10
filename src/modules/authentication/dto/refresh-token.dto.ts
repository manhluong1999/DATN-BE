import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        type: String,
        example: "xxxxxxxxxxxxxxxx"
    })
    @IsEmail()
    refreshToken: string;
}

export default RefreshTokenDto;

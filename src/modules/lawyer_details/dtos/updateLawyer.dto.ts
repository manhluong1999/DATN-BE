import { ApiProperty } from '@nestjs/swagger';

export class UpdateLawyerDto {
  @ApiProperty({
    type: Array,
    example: ['major1'],
  })
  majorFields: Array<string>;

  @ApiProperty({
    type: String,
    example: 'description 1',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 9.6,
  })
  ratingScore: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  yearExperiences: number;

  @ApiProperty({
    type: Number,
    example: 4.9,
  })
  userRatesScore: number;
}

export default UpdateLawyerDto;

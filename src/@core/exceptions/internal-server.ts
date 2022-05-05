import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any> | Array<string>) {
    super(response ?? 'Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

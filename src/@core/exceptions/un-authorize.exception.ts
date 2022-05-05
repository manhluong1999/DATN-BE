import { HttpException, HttpStatus } from '@nestjs/common';

export class UnAuthorizedExceptionCustom extends HttpException {
  constructor(response?: string | Record<string, any>) {
    super(response ?? 'UnAuthorized', HttpStatus.UNAUTHORIZED);
  }
}

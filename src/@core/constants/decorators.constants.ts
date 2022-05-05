import { GUARDS } from './guards.enum';
import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const DECORATORS = {
    IS_PUBLIC_GUARD: 'isPublic',
  };
  
export const Public = (guards: GUARDS[]): CustomDecorator<string> =>
  SetMetadata(DECORATORS.IS_PUBLIC_GUARD, guards);
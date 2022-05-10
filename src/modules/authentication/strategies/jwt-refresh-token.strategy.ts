import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { config } from 'src/@core/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly userService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.jwt.refresh_token_secret,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        console.log("validate refresh jwt", request.headers)
        console.log("validate refresh jwt", payload.userId)

        const refreshToken = request.headers['authorization']?.replace('Bearer ', '')
        return this.userService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.userId,
        );
    }
}
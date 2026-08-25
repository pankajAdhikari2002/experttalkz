import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'expertalkz_secret_key_change_in_prod',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, name: payload.name, role: payload.role };
  }
}

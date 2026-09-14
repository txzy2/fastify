import {SignJWT, jwtVerify, errors} from 'jose';
import {randomUUID} from 'node:crypto';
import {SERVER_CONFIG} from '@/core/config';
import {ApiErrors} from '@/utils/enums/errors';
import {AppError} from '@/utils/error-handler';

export interface AccessTokenPayload {
    sub: string;
    email: string;
}

export interface ITokenService {
    signAccessToken(payload: AccessTokenPayload): Promise<string>;
    verifyAccessToken(token: string): Promise<AccessTokenPayload>;
    generateRefreshToken(): string;
}

const ALGORITHM = 'HS256';

export class TokenService implements ITokenService {
    private readonly secret = new TextEncoder().encode(SERVER_CONFIG.jwt.secret);

    public async signAccessToken(payload: AccessTokenPayload): Promise<string> {
        return await new SignJWT({email: payload.email})
            .setProtectedHeader({alg: ALGORITHM})
            .setSubject(payload.sub)
            .setIssuedAt()
            .setExpirationTime(SERVER_CONFIG.jwt.accessTtl)
            .sign(this.secret);
    }

    public async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
        try {
            const {payload} = await jwtVerify(token, this.secret);

            if (!payload.sub || typeof payload.email !== 'string') {
                throw new AppError(ApiErrors.UNAUTHORIZED, 401);
            }

            return {sub: payload.sub, email: payload.email};
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            if (error instanceof errors.JWTExpired) {
                throw new AppError(ApiErrors.TOKEN_EXPIRED, 401);
            }
            throw new AppError(ApiErrors.UNAUTHORIZED, 401);
        }
    }

    public generateRefreshToken(): string {
        return randomUUID();
    }
}

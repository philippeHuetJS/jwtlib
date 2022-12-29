import type {JwtPayload, SignOptions, VerifyOptions, Jwt} from 'jsonwebtoken'

declare module 'jwtlib' {
  export function sign(payload: JwtPayload, options: SignOptions): string
  export function verify(token: string, options: VerifyOptions): Jwt
  export function refresh(token: string, options: VerifyOptions): string
}

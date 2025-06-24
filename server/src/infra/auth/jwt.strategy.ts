import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { z } from "zod"

import { EnvService } from "../env/env.service"

const tokenPayloadSchema = z.object({
	sub: z.string().uuid(),
	name: z.string(),
	role: z.enum(["USER", "ADMIN"]),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(env: EnvService) {
		const secret = env.get("JWT_SECRET")

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: secret,
			algorithms: ["HS256"],
		})
	}

	async validate(payload: UserPayload) {
		return tokenPayloadSchema.parse(payload)
	}
}

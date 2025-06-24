import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"

import { EnvModule } from "../env/env.module"
import { EnvService } from "../env/env.service"
import { JwtStrategy } from "./jwt.strategy"
import { JwtAuthGuard } from "./jwt-auth.guard"
import { RolesGuard } from "./roles.guard"

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [EnvService],
			imports: [EnvModule],
			global: true,
			useFactory(env: EnvService) {
				const secret = env.get("JWT_SECRET")

				return {
					signOptions: { algorithm: "HS256" },
					secret,
				}
			},
		}),
	],
	providers: [
		JwtStrategy,
		EnvService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AuthModule {}

import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Post,
	UsePipes,
} from "@nestjs/common"
import { z } from "zod"

import { AuthenticateUseCase } from "@/domains/events/application/use-cases/authenticate"
import { UserAlreadyExistsError } from "@/domains/events/application/use-cases/errors/user-already-exists-error"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"

const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Public()
@Controller("/sessions")
export class AuthenticateController {
	constructor(private authenticateUseCase: AuthenticateUseCase) {}

	@Post()
	@HttpCode(200)
	@UsePipes(new ZodValidationPipe(authenticateBodySchema))
	async handle(@Body() data: AuthenticateBodySchema) {
		const { email, password } = data

		const result = await this.authenticateUseCase.execute({
			email,
			password,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case UserAlreadyExistsError:
					throw new ConflictException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			access_token: result.value.accessToken,
		}
	}
}

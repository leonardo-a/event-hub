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
import { UserAlreadyExistsError } from "@/domains/events/application/use-cases/errors/user-already-exists-error"
import { RegisterUserUseCase } from "@/domains/events/application/use-cases/register-user"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"

const registerUserBodySchema = z.object({
	fullName: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(6),
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Public()
@Controller("/users")
export class RegisterAsUserController {
	constructor(private registerUserUseCase: RegisterUserUseCase) {}

	@Post()
	@HttpCode(204)
	@UsePipes(new ZodValidationPipe(registerUserBodySchema))
	async handle(@Body() data: RegisterUserBodySchema) {
		const { email, fullName, password } = data

		const result = await this.registerUserUseCase.execute({
			email,
			fullName,
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
	}
}

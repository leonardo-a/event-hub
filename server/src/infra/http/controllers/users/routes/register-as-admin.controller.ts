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
import { RegisterAdminUseCase } from "@/domains/events/application/use-cases/register-admin"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"

const registerAdminBodySchema = z.object({
	fullName: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(6),
})

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>

@Public()
@Controller("/admins")
export class RegisterAsAdminController {
	constructor(private registerAdminUseCase: RegisterAdminUseCase) {}

	@Post()
	@HttpCode(204)
	@UsePipes(new ZodValidationPipe(registerAdminBodySchema))
	async handle(@Body() data: RegisterAdminBodySchema) {
		const { email, fullName, password } = data

		const result = await this.registerAdminUseCase.execute({
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

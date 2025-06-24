import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	Param,
	Put,
} from "@nestjs/common"
import { z } from "zod"

import { EditUserUseCase } from "@/domains/events/application/use-cases/edit-user"
import { UserAlreadyExistsError } from "@/domains/events/application/use-cases/errors/user-already-exists-error"
import { Roles } from "@/infra/auth/roles.decorator"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"

const editUserBodySchema = z.object({
	fullName: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(6),
})

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

@Controller("/users/:id")
export class EditUserController {
	constructor(private editUserUseCase: EditUserUseCase) {}

	@Put()
	@Roles(["ADMIN"])
	@HttpCode(204)
	async handle(
		@Param("id") id: string,
		@Body(bodyValidationPipe) data: EditUserBodySchema,
	) {
		const { email, fullName, password } = data

		const result = await this.editUserUseCase.execute({
			id,
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

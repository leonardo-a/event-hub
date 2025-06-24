import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common"
import { DeleteUserUseCase } from "@/domains/events/application/use-cases/delete-user"
import { Roles } from "@/infra/auth/roles.decorator"

@Controller("/users/:id")
export class DeleteUserController {
	constructor(private deleteUser: DeleteUserUseCase) {}

	@Delete()
	@Roles(["ADMIN"])
	@HttpCode(204)
	async handle(@Param("id") id: string) {
		const result = await this.deleteUser.execute({
			userId: id,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				default:
					throw new BadRequestException(error.message)
			}
		}
	}
}

import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { GetProfileUseCase } from "@/domains/events/application/use-cases/get-profile"
import { Roles } from "@/infra/auth/roles.decorator"
import { ProfilePresenter } from "@/infra/http/presenters/profile-presenter"

@Controller("/users/:id")
export class GetUserController {
	constructor(private getProfileUseCase: GetProfileUseCase) {}

	@Get()
	@Roles(["ADMIN"])
	@HttpCode(200)
	async handle(@Param("id") profileId: string) {
		const result = await this.getProfileUseCase.execute({
			profileId,
		})

		if (result.isLeft()) {
			const error = result.value

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message)
				default:
					throw new BadRequestException(error.message)
			}
		}

		return {
			user: ProfilePresenter.toHTTP(result.value.profile),
		}
	}
}

import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { GetProfileUseCase } from "@/domains/events/application/use-cases/get-profile"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { ProfilePresenter } from "@/infra/http/presenters/profile-presenter"

@Controller("/profile")
export class GetProfileController {
	constructor(private getProfileUseCase: GetProfileUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(@CurrentUser() user: UserPayload) {
		const result = await this.getProfileUseCase.execute({
			profileId: user.sub,
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

		return ProfilePresenter.toHTTP(result.value.profile)
	}
}

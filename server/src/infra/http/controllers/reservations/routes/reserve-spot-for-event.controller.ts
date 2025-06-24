import {
	BadRequestException,
	Controller,
	HttpCode,
	NotFoundException,
	Param,
	Post,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { ReserveEventSpotUseCase } from "@/domains/events/application/use-cases/reserve-event-spot"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { Roles } from "@/infra/auth/roles.decorator"

@Controller("/events/:eventId/reserve")
export class ReserveSpotForEventController {
	constructor(private reserveEventSpot: ReserveEventSpotUseCase) {}

	@Post()
	@Roles(["USER"])
	@HttpCode(204)
	async handle(
		@Param("eventId") eventId: string,
		@CurrentUser() user: UserPayload,
	) {
		const result = await this.reserveEventSpot.execute({
			eventId,
			userId: user.sub,
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
	}
}

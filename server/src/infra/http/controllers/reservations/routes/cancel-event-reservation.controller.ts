import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	NotFoundException,
	Param,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { CancelReservationUseCase } from "@/domains/events/application/use-cases/cancel-reservation"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { Roles } from "@/infra/auth/roles.decorator"

@Controller("/reservations/:id")
export class CancelEventReservationController {
	constructor(private cancelReservation: CancelReservationUseCase) {}

	@Delete()
	@Roles(["USER"])
	@HttpCode(204)
	async handle(@Param("id") id: string, @CurrentUser() user: UserPayload) {
		const result = await this.cancelReservation.execute({
			reservationId: id,
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

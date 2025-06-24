import { Controller, Get, HttpCode, Query } from "@nestjs/common"
import { z } from "zod"

import { FetchUserReservationsUseCase } from "@/domains/events/application/use-cases/fetch-user-reservations"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { Roles } from "@/infra/auth/roles.decorator"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"
import { ReservationPresenter } from "@/infra/http/presenters/reservation-presenter"

const pageQuerySchema = z.coerce.number().int().positive().default(1)

const pageValidationPipe = new ZodValidationPipe(pageQuerySchema)

@Controller("/my-reservations")
export class FetchUserReservationsController {
	constructor(private fetchUserReservations: FetchUserReservationsUseCase) {}

	@Get()
	@Roles(["USER"])
	@HttpCode(200)
	async handle(
		@Query("page", pageValidationPipe) page: number,
		@CurrentUser() user: UserPayload,
	) {
		const result = await this.fetchUserReservations.execute({
			userId: user.sub,
			page,
		})

		return {
			reservations: result.value?.reservations.map(ReservationPresenter.toHTTP),
		}
	}
}

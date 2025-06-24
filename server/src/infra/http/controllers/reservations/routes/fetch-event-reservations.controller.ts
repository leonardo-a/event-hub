import { Controller, Get, HttpCode, Param, Query } from "@nestjs/common"
import { z } from "zod"

import { FetchEventReservationsUseCase } from "@/domains/events/application/use-cases/fetch-event-reservations"
import { Roles } from "@/infra/auth/roles.decorator"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"
import { ReservationPresenter } from "@/infra/http/presenters/reservation-presenter"

const pageQuerySchema = z.coerce.number().int().positive().default(1)

const pageValidationPipe = new ZodValidationPipe(pageQuerySchema)

@Controller("/events/:eventId/reservations")
export class FetchEventReservationsController {
	constructor(private fetchEventReservations: FetchEventReservationsUseCase) {}

	@Get()
	@Roles(["ADMIN"])
	@HttpCode(200)
	async handle(
		@Param("eventId") eventId: string,
		@Query("page", pageValidationPipe) page: number,
	) {
		const result = await this.fetchEventReservations.execute({
			eventId,
			page,
		})

		return {
			reservations: result.value?.reservations.map(ReservationPresenter.toHTTP),
		}
	}
}

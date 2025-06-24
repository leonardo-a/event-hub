import { Controller, Get, HttpCode, Query } from "@nestjs/common"
import { z } from "zod"

import { FetchEventsUseCase } from "@/domains/events/application/use-cases/fetch-events"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"
import { EventPresenter } from "@/infra/http/presenters/event-presenter"

const searchQuerySchema = z.string().default("")
const pageQuerySchema = z.coerce.number().int().positive().default(1)
const fromDateQuerySchema = z.coerce.date().nullable().default(null)

const searchValidationPipe = new ZodValidationPipe(searchQuerySchema)
const pageValidationPipe = new ZodValidationPipe(pageQuerySchema)
const dateValidationPipe = new ZodValidationPipe(fromDateQuerySchema)

@Controller("/events")
export class FetchEventsController {
	constructor(private fetchEvents: FetchEventsUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(
		@Query("page", pageValidationPipe) page: number,
		@Query("query", searchValidationPipe) query: string,
		@Query("fromDate", dateValidationPipe) fromDate?: Date,
	) {
		const result = await this.fetchEvents.execute({
			page,
			query,
			fromDate,
		})

		return {
			events: result.value?.events.map(EventPresenter.toHTTP),
		}
	}
}

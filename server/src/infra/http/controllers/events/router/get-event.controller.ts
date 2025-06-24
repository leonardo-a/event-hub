import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	NotFoundException,
	Param,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { GetEventUseCase } from "@/domains/events/application/use-cases/get-event"
import { EventPresenter } from "@/infra/http/presenters/event-presenter"

@Controller("/events/:id")
export class GetEventController {
	constructor(private getEvent: GetEventUseCase) {}

	@Get()
	@HttpCode(200)
	async handle(@Param("id") id: string) {
		const result = await this.getEvent.execute({
			eventId: id,
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
			event: EventPresenter.toHTTP(result.value.event),
		}
	}
}

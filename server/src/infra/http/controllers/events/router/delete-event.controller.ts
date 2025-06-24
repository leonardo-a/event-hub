import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	NotFoundException,
	Param,
} from "@nestjs/common"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { DeleteEventUseCase } from "@/domains/events/application/use-cases/delete-event"
import { Roles } from "@/infra/auth/roles.decorator"

@Controller("/events/:id")
export class DeleteEventController {
	constructor(private deleteEvent: DeleteEventUseCase) {}

	@Delete()
	@Roles(["ADMIN"])
	@HttpCode(204)
	async handle(@Param("id") id: string) {
		const result = await this.deleteEvent.execute({
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
	}
}

import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	NotFoundException,
	Param,
	Put,
} from "@nestjs/common"
import { z } from "zod"

import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EditEventUseCase } from "@/domains/events/application/use-cases/edit-event"
import { Roles } from "@/infra/auth/roles.decorator"
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe"

const editEventBodySchema = z.object({
	eventDate: z.date().min(new Date()),
	maxCapacity: z.number().int().min(10),
	name: z.string().min(3),
	description: z.string().nullish(),
	location: z.string().min(5).nullish(),
	onlineLink: z.string().url().nullish(),
})

type EditEventBodySchema = z.infer<typeof editEventBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editEventBodySchema)

@Controller("/events/:id")
export class EditEventController {
	constructor(private editEvent: EditEventUseCase) {}

	@Put()
	@Roles(["ADMIN"])
	@HttpCode(204)
	async handle(
		@Param("id") id: string,
		@Body(bodyValidationPipe) data: EditEventBodySchema,
	) {
		const { eventDate, maxCapacity, name, description, location, onlineLink } =
			data

		const result = await this.editEvent.execute({
			id,
			eventDate,
			maxCapacity,
			name,
			description,
			location,
			onlineLink,
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

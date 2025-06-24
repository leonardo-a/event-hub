import { Body, Controller, HttpCode, Post } from "@nestjs/common"
import { z } from "zod"

import { CreateEventUseCase } from "@/domains/events/application/use-cases/create-event"
import { CurrentUser } from "@/infra/auth/current-user.decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
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

@Controller("/events")
export class CreateEventController {
	constructor(private createEvent: CreateEventUseCase) {}

	@Post()
	@Roles(["ADMIN"])
	@HttpCode(201)
	async handle(
		@Body(bodyValidationPipe) data: EditEventBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { eventDate, maxCapacity, name, description, location, onlineLink } =
			data

		const result = await this.createEvent.execute({
			creatorId: user.sub,
			eventDate,
			maxCapacity,
			name,
			description,
			location,
			onlineLink,
		})

		return {
			eventId: result.value?.event.id.toString(),
		}
	}
}

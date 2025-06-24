import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EventsRepository } from "../repositories/events-repository"

interface EditEventUseCaseRequest {
	id: string
	name: string
	description?: string | null
	eventDate: Date
	location?: string | null
	onlineLink?: string | null
	maxCapacity: number
}

type EditEventUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class EditEventUseCase {
	constructor(private eventsRepository: EventsRepository) {}

	async execute({
		id,
		name,
		description,
		eventDate,
		location,
		onlineLink,
		maxCapacity,
	}: EditEventUseCaseRequest): Promise<EditEventUseCaseResponse> {
		const event = await this.eventsRepository.findById(id)

		if (!event) {
			return left(new ResourceNotFoundError())
		}

		event.name = name
		event.description = description
		event.eventDate = eventDate
		event.location = location
		event.onlineLink = onlineLink
		event.maxCapacity = maxCapacity

		await this.eventsRepository.save(event)

		return right(null)
	}
}

import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EventsRepository } from "../repositories/events-repository"

interface DeleteEventUseCaseRequest {
	eventId: string
}

type DeleteEventUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteEventUseCase {
	constructor(private eventsRepository: EventsRepository) {}

	async execute({
		eventId,
	}: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
		const event = await this.eventsRepository.findById(eventId)

		if (!event) {
			return left(new ResourceNotFoundError())
		}

		await this.eventsRepository.delete(event)

		return right(null)
	}
}

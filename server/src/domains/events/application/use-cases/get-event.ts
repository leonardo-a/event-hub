import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import type { Event } from "../../enterprise/entities/event"
import { EventsRepository } from "../repositories/events-repository"

interface GetEventUseCaseRequest {
	eventId: string
}

type GetEventUseCaseResponse = Either<ResourceNotFoundError, { event: Event }>

@Injectable()
export class GetEventUseCase {
	constructor(private eventsRepository: EventsRepository) {}

	async execute({
		eventId,
	}: GetEventUseCaseRequest): Promise<GetEventUseCaseResponse> {
		const event = await this.eventsRepository.findById(eventId)

		if (!event) {
			return left(new ResourceNotFoundError())
		}

		return right({
			event,
		})
	}
}

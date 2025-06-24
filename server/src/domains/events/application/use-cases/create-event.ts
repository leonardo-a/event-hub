import { Injectable } from "@nestjs/common"

import { type Either, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Event } from "../../enterprise/entities/event"
import { EventsRepository } from "../repositories/events-repository"

export interface CreateEventUseCaseRequest {
	name: string
	creatorId: string
	eventDate: Date
	maxCapacity: number
	description?: string | null
	location?: string | null
	onlineLink?: string | null
}

export type CreateEventUseCaseResponse = Either<null, { event: Event }>

@Injectable()
export class CreateEventUseCase {
	constructor(private eventsRepository: EventsRepository) {}

	async execute({
		name,
		creatorId,
		eventDate,
		maxCapacity,
		description,
		location,
		onlineLink,
	}: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
		const event = Event.create({
			name,
			creatorId: new UniqueEntityID(creatorId),
			eventDate,
			maxCapacity,
			description,
			location,
			onlineLink,
		})

		await this.eventsRepository.create(event)

		return right({
			event,
		})
	}
}

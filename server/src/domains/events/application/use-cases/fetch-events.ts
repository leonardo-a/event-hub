import { Injectable } from "@nestjs/common"
import { type Either, right } from "@/core/either"
import type { Event } from "../../enterprise/entities/event"
import { EventsRepository } from "../repositories/events-repository"

interface FetchEventsUseCaseRequest {
	page: number
	query: string
	fromDate?: Date
}

type FetchEventsUseCaseResponse = Either<null, { events: Event[] }>

@Injectable()
export class FetchEventsUseCase {
	constructor(private eventsRepository: EventsRepository) {}

	async execute({
		page,
		query,
		fromDate,
	}: FetchEventsUseCaseRequest): Promise<FetchEventsUseCaseResponse> {
		const events = await this.eventsRepository.findMany({
			page,
			query,
			fromDate,
		})

		return right({
			events,
		})
	}
}

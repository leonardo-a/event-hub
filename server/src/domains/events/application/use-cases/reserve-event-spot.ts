import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Reservation } from "../../enterprise/entities/reservation"
import { EventsRepository } from "../repositories/events-repository"
import { ReservationsRepository } from "../repositories/reservations-repository"
import { NoSpotsAvailableForEventError } from "./errors/no-spots-available-for-event-error"

interface ReserveEventSpotUseCaseRequest {
	eventId: string
	userId: string
}

type ReserveEventSpotUseCaseResponse = Either<
	ResourceNotFoundError | NoSpotsAvailableForEventError,
	null
>

@Injectable()
export class ReserveEventSpotUseCase {
	constructor(
		private eventsRepository: EventsRepository,
		private reservationsRepository: ReservationsRepository,
	) {}

	async execute({
		eventId,
		userId,
	}: ReserveEventSpotUseCaseRequest): Promise<ReserveEventSpotUseCaseResponse> {
		const event = await this.eventsRepository.findById(eventId)

		if (!event) {
			return left(new ResourceNotFoundError())
		}

		if (event.availableSpots <= 0) {
			return left(new NoSpotsAvailableForEventError())
		}

		const reservation = Reservation.create({
			eventId: event.id,
			userId: new UniqueEntityID(userId),
		})

		await this.reservationsRepository.create(reservation)

		return right(null)
	}
}

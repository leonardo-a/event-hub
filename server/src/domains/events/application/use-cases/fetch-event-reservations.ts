import { Injectable } from "@nestjs/common"

import { type Either, right } from "@/core/either"
import type { Reservation } from "../../enterprise/entities/reservation"
import { ReservationsRepository } from "../repositories/reservations-repository"

interface FetchEventReservationsUseCaseRequest {
	eventId: string
	page: number
}

type FetchEventReservationsUseCaseResponse = Either<
	null,
	{ reservations: Reservation[] }
>

@Injectable()
export class FetchEventReservationsUseCase {
	constructor(private reservationsRepository: ReservationsRepository) {}

	async execute({
		eventId,
		page,
	}: FetchEventReservationsUseCaseRequest): Promise<FetchEventReservationsUseCaseResponse> {
		const reservations = await this.reservationsRepository.findManyByEvent({
			eventId,
			page,
		})

		return right({
			reservations,
		})
	}
}

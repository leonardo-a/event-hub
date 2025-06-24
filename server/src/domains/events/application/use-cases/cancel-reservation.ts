import { Injectable } from "@nestjs/common"

import { type Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { ReservationsRepository } from "../repositories/reservations-repository"

interface CancelReservationRequest {
	reservationId: string
	userId: string
}

type CancelReservationResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

@Injectable()
export class CancelReservationUseCase {
	constructor(
		private readonly reservationsRepository: ReservationsRepository,
	) {}

	async execute({
		reservationId,
		userId,
	}: CancelReservationRequest): Promise<CancelReservationResponse> {
		const reservation =
			await this.reservationsRepository.findById(reservationId)

		if (!reservation) {
			return left(new ResourceNotFoundError())
		}

		if (reservation.userId.toString() !== userId) {
			return left(new NotAllowedError())
		}

		if (reservation.status === "CANCELED") {
			return right(null)
		}

		reservation.cancel()

		await this.reservationsRepository.save(reservation)

		return right(null)
	}
}

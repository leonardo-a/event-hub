import { Injectable } from "@nestjs/common"

import { type Either, right } from "@/core/either"
import type { Reservation } from "../../enterprise/entities/reservation"
import { ReservationsRepository } from "../repositories/reservations-repository"

interface FetchUserReservationsUseCaseRequest {
	userId: string
	page: number
}

type FetchUserReservationsUseCaseResponse = Either<
	null,
	{ reservations: Reservation[] }
>

@Injectable()
export class FetchUserReservationsUseCase {
	constructor(private reservationsRepository: ReservationsRepository) {}

	async execute({
		userId,
		page,
	}: FetchUserReservationsUseCaseRequest): Promise<FetchUserReservationsUseCaseResponse> {
		const reservations = await this.reservationsRepository.findManyByUser({
			userId,
			page,
		})

		return right({
			reservations,
		})
	}
}

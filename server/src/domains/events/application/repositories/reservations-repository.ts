import type { FilterParams } from "@/core/repositories/filter-params"
import type { Reservation } from "../../enterprise/entities/reservation"

export interface UserReservationsFilterParams extends FilterParams {
	userId: string
}

export interface EventReservationsFilterParams extends FilterParams {
	eventId: string
}

export abstract class ReservationsRepository {
	abstract findManyByUser(
		params: UserReservationsFilterParams,
	): Promise<Reservation[]>

	abstract findManyByEvent(
		params: EventReservationsFilterParams,
	): Promise<Reservation[]>

	abstract findById(id: string): Promise<Reservation | null>

	abstract create(reservation: Reservation): Promise<void>

	abstract save(reservation: Reservation): Promise<void>
}

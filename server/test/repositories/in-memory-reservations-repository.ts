import {
	type EventReservationsFilterParams,
	ReservationsRepository,
	type UserReservationsFilterParams,
} from "@/domains/events/application/repositories/reservations-repository"
import type { Reservation } from "@/domains/events/enterprise/entities/reservation"

export class InMemoryReservationsRepository extends ReservationsRepository {
	public items: Reservation[] = []

	async findManyByUser({
		userId,
		page,
	}: UserReservationsFilterParams): Promise<Reservation[]> {
		const reservations = this.items
			.filter((item) => item.userId.toString() === userId)
			.slice((page - 1) * 20, page * 20)

		return reservations
	}

	async findManyByEvent({
		eventId,
		page,
	}: EventReservationsFilterParams): Promise<Reservation[]> {
		const reservations = this.items
			.filter((item) => item.eventId.toString() === eventId)
			.slice((page - 1) * 20, page * 20)

		return reservations
	}

	async findById(id: string): Promise<Reservation | null> {
		const reservation = this.items.find((item) => item.id.toString() === id)

		if (!reservation) {
			return null
		}

		return reservation
	}

	async create(reservation: Reservation): Promise<void> {
		this.items.push(reservation)
	}

	async save(reservation: Reservation): Promise<void> {
		const index = this.items.findIndex((i) => i.id === reservation.id)

		if (index !== -1) {
			this.items[index] = reservation
		}
	}
}

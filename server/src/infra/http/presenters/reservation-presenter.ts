import { Reservation } from "@/domains/events/enterprise/entities/reservation"

export class ReservationPresenter {
	static toHTTP(reservation: Reservation) {
		return {
			id: reservation.id.toString(),
			event: reservation.eventId,
			status: reservation.status,
			reservedAt: reservation.reservedAt,
			updatedAt: reservation.updatedAt,
		}
	}
}

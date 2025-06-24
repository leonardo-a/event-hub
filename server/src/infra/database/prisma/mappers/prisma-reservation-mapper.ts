import type { Reservation as PrismaReservation } from "generated/prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Reservation } from "@/domains/events/enterprise/entities/reservation"

export class PrismaReservationMapper {
	static toDomain(raw: PrismaReservation): Reservation {
		return Reservation.create(
			{
				eventId: new UniqueEntityID(raw.eventId),
				userId: new UniqueEntityID(raw.userId),
				reservedAt: raw.reservedAt,
				status: raw.status,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id),
		)
	}

	static toPrisma(reservation: Reservation): PrismaReservation {
		return {
			id: reservation.id.toString(),
			eventId: reservation.eventId.toString(),
			userId: reservation.userId.toString(),
			reservedAt: reservation.reservedAt,
			status: reservation.status,
			updatedAt: reservation.updatedAt ?? new Date(),
		}
	}
}

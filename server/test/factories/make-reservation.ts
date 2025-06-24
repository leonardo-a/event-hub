import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
	Reservation,
	type ReservationProps,
} from "@/domains/events/enterprise/entities/reservation"
import { PrismaReservationMapper } from "@/infra/database/prisma/mappers/prisma-reservation-mapper"
import type { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeReservation(
	props?: Partial<ReservationProps>,
	id?: UniqueEntityID,
) {
	const reservation = Reservation.create(
		{
			eventId: new UniqueEntityID(),
			userId: new UniqueEntityID(),
			reservedAt: faker.date.recent(),
			status: "CONFIRMED",
			...props,
		},
		id,
	)

	return reservation
}

@Injectable()
export class ReservationsFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaReservation(
		data: Partial<ReservationProps> = {},
	): Promise<Reservation> {
		const reservation = makeReservation(data)

		await this.prisma.reservation.create({
			data: PrismaReservationMapper.toPrisma(reservation),
		})

		return reservation
	}
}

import { Injectable } from "@nestjs/common"

import type {
	EventReservationsFilterParams,
	ReservationsRepository,
	UserReservationsFilterParams,
} from "@/domains/events/application/repositories/reservations-repository"
import type { Reservation } from "@/domains/events/enterprise/entities/reservation"
import { PrismaReservationMapper } from "../mappers/prisma-reservation-mapper"

import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaReservationsRepository implements ReservationsRepository {
	constructor(private prisma: PrismaService) {}

	async findManyByUser({
		page,
		userId,
	}: UserReservationsFilterParams): Promise<Reservation[]> {
		const reservations = await this.prisma.reservation.findMany({
			where: {
				userId,
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return reservations.map(PrismaReservationMapper.toDomain)
	}

	async findManyByEvent({
		eventId,
		page,
	}: EventReservationsFilterParams): Promise<Reservation[]> {
		const reservations = await this.prisma.reservation.findMany({
			where: {
				eventId,
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return reservations.map(PrismaReservationMapper.toDomain)
	}

	async findById(id: string): Promise<Reservation | null> {
		const reservation = await this.prisma.reservation.findUnique({
			where: {
				id,
			},
		})

		if (!reservation) {
			return null
		}

		return PrismaReservationMapper.toDomain(reservation)
	}

	async create(reservation: Reservation): Promise<void> {
		const data = PrismaReservationMapper.toPrisma(reservation)

		await this.prisma.reservation.create({
			data,
		})
	}

	async save(reservation: Reservation): Promise<void> {
		const data = PrismaReservationMapper.toPrisma(reservation)

		await this.prisma.reservation.update({
			data: {
				event: {
					update: {
						availableSpots: {
							increment: data.status === "CANCELED" ? 1 : 0,
							decrement: data.status === "CONFIRMED" ? 1 : 0,
						},
					},
				},
			},
			where: {
				id: data.id,
			},
		})
	}
}

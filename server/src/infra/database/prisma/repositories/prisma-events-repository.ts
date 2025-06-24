import { Injectable } from "@nestjs/common"
import type {
	EventsFilterParams,
	EventsRepository,
} from "@/domains/events/application/repositories/events-repository"
import type { Event } from "@/domains/events/enterprise/entities/event"
import { PrismaEventMapper } from "../mappers/prisma-event-mapper"

import { PrismaService } from "../prisma.service"

@Injectable()
export class PrismaEventsRepository implements EventsRepository {
	constructor(private prisma: PrismaService) {}

	async findMany({
		page,
		query,
		fromDate,
	}: EventsFilterParams): Promise<Event[]> {
		const events = await this.prisma.event.findMany({
			where: {
				name: {
					contains: query,
					mode: "insensitive",
				},
				eventDate: fromDate
					? {
							gte: fromDate,
						}
					: undefined,
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return events.map(PrismaEventMapper.toDomain)
	}

	async findById(id: string): Promise<Event | null> {
		const event = await this.prisma.event.findUnique({
			where: {
				id,
			},
		})

		if (!event) {
			return null
		}

		return PrismaEventMapper.toDomain(event)
	}

	async create(event: Event): Promise<void> {
		const data = PrismaEventMapper.toPrisma(event)

		await this.prisma.event.create({
			data,
		})
	}

	async save(event: Event): Promise<void> {
		const data = PrismaEventMapper.toPrisma(event)

		await this.prisma.event.update({
			where: {
				id: data.id,
			},
			data,
		})
	}

	async delete(event: Event): Promise<void> {
		await this.prisma.event.delete({
			where: {
				id: event.id.toString(),
			},
		})
	}
}

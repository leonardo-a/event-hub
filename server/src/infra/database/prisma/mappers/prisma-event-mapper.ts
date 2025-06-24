import type { Event as PrismaEvent } from "generated/prisma/client"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Event } from "@/domains/events/enterprise/entities/event"

export class PrismaEventMapper {
	static toDomain(raw: PrismaEvent): Event {
		return Event.create(
			{
				name: raw.name,
				creatorId: new UniqueEntityID(raw.creatorId),
				eventDate: raw.eventDate,
				maxCapacity: raw.maxCapacity,
				description: raw.description,
				location: raw.location,
				onlineLink: raw.onlineLink,
				availableSpots: raw.availableSpots,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id),
		)
	}

	static toPrisma(event: Event): PrismaEvent {
		return {
			id: event.id.toString(),
			creatorId: event.creatorId.toString(),
			name: event.name,
			description: event.description ?? null,
			location: event.location ?? null,
			onlineLink: event.onlineLink ?? null,
			maxCapacity: event.maxCapacity,
			availableSpots: event.availableSpots,
			eventDate: event.eventDate,
			createdAt: event.createdAt,
			updatedAt: event.updatedAt ?? event.createdAt,
		}
	}
}

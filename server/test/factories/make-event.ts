import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
	Event,
	type EventProps,
} from "@/domains/events/enterprise/entities/event"
import { PrismaEventMapper } from "@/infra/database/prisma/mappers/prisma-event-mapper"
import type { PrismaService } from "@/infra/database/prisma/prisma.service"

export function makeEvent(props?: Partial<EventProps>, id?: UniqueEntityID) {
	const event = Event.create(
		{
			creatorId: new UniqueEntityID(),
			name: faker.lorem.sentence(),
			description: faker.lorem.paragraph(),
			eventDate: faker.date.future(),
			maxCapacity: faker.number.int({ min: 1, max: 100 }),
			location: faker.location.streetAddress(),
			onlineLink: faker.internet.url(),
			...props,
		},
		id,
	)

	return event
}

@Injectable()
export class EventsFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaEvent(data: Partial<EventProps> = {}): Promise<Event> {
		const event = makeEvent(data)

		await this.prisma.event.create({
			data: PrismaEventMapper.toPrisma(event),
		})

		return event
	}
}

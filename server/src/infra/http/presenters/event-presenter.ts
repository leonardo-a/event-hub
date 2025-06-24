import { Event } from "@/domains/events/enterprise/entities/event"

export class EventPresenter {
	static toHTTP(event: Event) {
		return {
			id: event.id.toString(),
			name: event.name,
			description: event.description,
			location: event.location,
			onlineLink: event.onlineLink,
			maxCapacity: event.maxCapacity,
			availableSpots: event.availableSpots,
			eventDate: event.eventDate,
		}
	}
}

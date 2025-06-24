import type {
	EventsFilterParams,
	EventsRepository,
} from "@/domains/events/application/repositories/events-repository"
import type { Event } from "@/domains/events/enterprise/entities/event"

export class InMemoryEventsRepository implements EventsRepository {
	public items: Event[] = []

	async findMany({
		page,
		query,
		fromDate,
	}: EventsFilterParams): Promise<Event[]> {
		const events = this.items
			.filter((item) => {
				const matchesQuery = query ? item.name.includes(query) : true
				const matchesDate = fromDate ? item.eventDate >= fromDate : true
				return matchesQuery && matchesDate
			})
			.slice((page - 1) * 20, page * 20)

		return events
	}

	async findById(id: string): Promise<Event | null> {
		const event = this.items.find((item) => item.id.toString() === id)

		if (!event) {
			return null
		}

		return event
	}

	async create(event: Event): Promise<void> {
		this.items.push(event)
	}

	async save(event: Event): Promise<void> {
		const index = this.items.findIndex((i) => i.id === event.id)
		if (index !== -1) {
			this.items[index] = event
		}
	}

	async delete(event: Event): Promise<void> {
		this.items = this.items.filter((i) => i.id !== event.id)
	}
}

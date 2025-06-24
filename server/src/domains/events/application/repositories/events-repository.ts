import type { FilterParams } from "@/core/repositories/filter-params"
import type { Event } from "../../enterprise/entities/event"

export interface EventsFilterParams extends FilterParams {
	fromDate?: Date
}

export abstract class EventsRepository {
	abstract findMany(params: EventsFilterParams): Promise<Event[]>

	abstract findById(id: string): Promise<Event | null>

	abstract create(event: Event): Promise<void>

	abstract save(event: Event): Promise<void>

	abstract delete(event: Event): Promise<void>
}

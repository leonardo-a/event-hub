import { AggregateRoot } from "@/core/entities/aggregate-root"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import type { Optional } from "@/core/types/optional"

export interface EventProps {
	creatorId: UniqueEntityID
	name: string
	description?: string | null
	eventDate: Date
	location?: string | null
	onlineLink?: string | null
	maxCapacity: number
	availableSpots: number
	createdAt: Date
	updatedAt?: Date | null
}

export class Event extends AggregateRoot<EventProps> {
	get creatorId() {
		return this.props.creatorId
	}

	get name() {
		return this.props.name
	}

	set name(value: string) {
		this.props.name = value
		this.touch()
	}

	get description() {
		return this.props.description
	}

	set description(value: string | undefined | null) {
		this.props.description = value
		this.touch()
	}

	get eventDate() {
		return this.props.eventDate
	}

	set eventDate(value: Date) {
		this.props.eventDate = value
		this.touch()
	}

	get location() {
		return this.props.location
	}

	set location(value: string | undefined | null) {
		this.props.location = value
		this.touch()
	}

	get onlineLink() {
		return this.props.onlineLink
	}

	set onlineLink(value: string | undefined | null) {
		this.props.onlineLink = value
		this.touch()
	}

	get maxCapacity() {
		return this.props.maxCapacity
	}

	set maxCapacity(value: number) {
		const currentSpots = this.props.maxCapacity - this.props.availableSpots

		if (value < currentSpots) {
			throw new Error("Max capacity cannot be less than available spots")
		}

		if (value < 10) {
			throw new Error("Max capacity cannot be less than 10")
		}

		this.props.availableSpots = value - currentSpots
		this.props.maxCapacity = value
		this.touch()
	}

	get availableSpots() {
		return this.props.availableSpots
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<EventProps, "createdAt" | "availableSpots">,
		id?: UniqueEntityID,
	): Event {
		const event = new Event(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				availableSpots: props.availableSpots ?? props.maxCapacity,
			},
			id,
		)
		return event
	}
}

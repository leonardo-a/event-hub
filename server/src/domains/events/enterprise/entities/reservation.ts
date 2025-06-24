import { AggregateRoot } from "@/core/entities/aggregate-root"
import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import type { Optional } from "@/core/types/optional"

export interface ReservationProps {
	eventId: UniqueEntityID
	userId: UniqueEntityID
	status: "CONFIRMED" | "CANCELED"
	reservedAt: Date
	updatedAt?: Date | null
}

export class Reservation extends AggregateRoot<ReservationProps> {
	get eventId() {
		return this.props.eventId
	}

	get userId() {
		return this.props.userId
	}

	get reservedAt() {
		return this.props.reservedAt
	}

	get status() {
		return this.props.status
	}

	cancel() {
		this.props.status = "CANCELED"
		this.touch()
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	static create(
		props: Optional<ReservationProps, "status" | "reservedAt">,
		id?: UniqueEntityID,
	): Reservation {
		const reservation = new Reservation(
			{
				...props,
				status: props.status ?? "CONFIRMED",
				reservedAt: props.reservedAt ?? new Date(),
			},
			id,
		)

		return reservation
	}
}

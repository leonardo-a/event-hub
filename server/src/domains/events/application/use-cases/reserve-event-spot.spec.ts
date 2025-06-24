import { makeEvent } from "test/factories/make-event"
import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { InMemoryReservationsRepository } from "test/repositories/in-memory-reservations-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { NoSpotsAvailableForEventError } from "./errors/no-spots-available-for-event-error"
import { ReserveEventSpotUseCase } from "./reserve-event-spot"

let inMemoryEventsRepository: InMemoryEventsRepository
let inMemoryReservationsRepository: InMemoryReservationsRepository
let sut: ReserveEventSpotUseCase

describe("Reserve Event Spot Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()
		inMemoryReservationsRepository = new InMemoryReservationsRepository()
		sut = new ReserveEventSpotUseCase(
			inMemoryEventsRepository,
			inMemoryReservationsRepository,
		)
	})

	it("should be able to reserve a spot for an event", async () => {
		const event = makeEvent({
			name: "Test Event",
			description: "Test Description",
			maxCapacity: 100,
			eventDate: new Date("2025-08-01"),
		})

		inMemoryEventsRepository.items.push(event)

		const response = await sut.execute({
			eventId: event.id.toString(),
			userId: "user-1",
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryReservationsRepository.items).toHaveLength(1)
		expect(inMemoryReservationsRepository.items[0]).toEqual(
			expect.objectContaining({
				eventId: event.id,
				userId: new UniqueEntityID("user-1"),
				status: "CONFIRMED",
			}),
		)
	})

	it("should not be able to reserve a spot for a full event", async () => {
		const event = makeEvent({
			name: "Test Event",
			description: "Test Description",
			maxCapacity: 100,
			availableSpots: 0,
			eventDate: new Date("2025-08-01"),
		})

		inMemoryEventsRepository.items.push(event)

		const response = await sut.execute({
			eventId: event.id.toString(),
			userId: "user-123",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(NoSpotsAvailableForEventError)
	})

	it("should not be able to reserve a spot for a non-existing event", async () => {
		const response = await sut.execute({
			eventId: "non-existing-event-id",
			userId: "user-123",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})

import { makeEvent } from "test/factories/make-event"
import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { EditEventUseCase } from "./edit-event"

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: EditEventUseCase

describe("Edit Event Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()
		sut = new EditEventUseCase(inMemoryEventsRepository)
	})

	it("should be able to edit an event", async () => {
		const event = makeEvent({
			name: "Original Event",
			maxCapacity: 100,
			availableSpots: 80,
			eventDate: new Date("2025-08-01"),
		})

		inMemoryEventsRepository.items.push(event)

		const response = await sut.execute({
			id: event.id.toString(),
			name: "Updated Event",
			description: "New Event Description",
			maxCapacity: 150,
			eventDate: new Date("2025-09-01"),
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryEventsRepository.items).toHaveLength(1)
		expect(inMemoryEventsRepository.items[0]).toEqual(
			expect.objectContaining({
				name: "Updated Event",
				description: "New Event Description",
				maxCapacity: 150,
				availableSpots: 130,
				eventDate: new Date("2025-09-01"),
			}),
		)
	})

	it("should not be able to edit a non-existing event", async () => {
		const response = await sut.execute({
			id: "non-existing-event-id",
			name: "Updated Event",
			description: "New Event Description",
			maxCapacity: 150,
			eventDate: new Date("2025-09-01"),
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})

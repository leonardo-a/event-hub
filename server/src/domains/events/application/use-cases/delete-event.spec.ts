import { makeEvent } from "test/factories/make-event"
import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { DeleteEventUseCase } from "./delete-event"

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: DeleteEventUseCase

describe("Delete Event Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()

		sut = new DeleteEventUseCase(inMemoryEventsRepository)
	})

	it("should be able to delete a event", async () => {
		const event = makeEvent()

		inMemoryEventsRepository.items.push(event)

		const response = await sut.execute({
			eventId: event.id.toString(),
		})

		expect(response.isRight()).toBe(true)
		expect(inMemoryEventsRepository.items).toHaveLength(0)
	})

	it("should not be able to delete an event that doesnt exist", async () => {
		const response = await sut.execute({
			eventId: "non-existing-event-id",
		})

		expect(response.isLeft()).toBe(true)
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})

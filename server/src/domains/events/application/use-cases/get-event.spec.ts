import { makeEvent } from "test/factories/make-event"
import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { GetEventUseCase } from "./get-event"

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: GetEventUseCase

describe("Get Event Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()
		sut = new GetEventUseCase(inMemoryEventsRepository)
	})

	it("should be able to get an event", async () => {
		const event = makeEvent()

		inMemoryEventsRepository.items.push(event)

		const eventId = event.id.toString()

		const response = await sut.execute({
			eventId,
		})

		expect(response.isRight()).toBeTruthy()
		if (response.isRight()) {
			expect(response.value.event).toEqual(event)
		}
	})

	it("should not be able to get a non-existing event", async () => {
		const eventId = "non-existing-event-id"

		const response = await sut.execute({
			eventId,
		})

		expect(response.isLeft()).toBeTruthy()
		expect(response.value).toBeInstanceOf(ResourceNotFoundError)
	})
})

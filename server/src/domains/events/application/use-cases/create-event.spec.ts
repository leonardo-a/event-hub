import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { CreateEventUseCase } from "./create-event"

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: CreateEventUseCase

describe("Create Event Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()
		sut = new CreateEventUseCase(inMemoryEventsRepository)
	})

	it("should be able to create an event", async () => {
		const response = await sut.execute({
			name: "Test Event",
			creatorId: "creator-id",
			eventDate: new Date(),
			maxCapacity: 100,
			description: "This is a test event",
			location: "Test Location",
			onlineLink: "http://test.com",
		})

		expect(response.isRight()).toBe(true)

		if (response.isRight()) {
			expect(inMemoryEventsRepository.items).toHaveLength(1)
			expect(inMemoryEventsRepository.items[0].name).toBe("Test Event")
		}
	})
})

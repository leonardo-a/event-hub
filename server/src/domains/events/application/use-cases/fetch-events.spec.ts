import { makeEvent } from "test/factories/make-event"
import { InMemoryEventsRepository } from "test/repositories/in-memory-events-repository"
import { FetchEventsUseCase } from "./fetch-events"

let inMemoryEventsRepository: InMemoryEventsRepository
let sut: FetchEventsUseCase

describe("Fetch Events Use Case", () => {
	beforeEach(() => {
		inMemoryEventsRepository = new InMemoryEventsRepository()
		sut = new FetchEventsUseCase(inMemoryEventsRepository)
	})

	it("should be able to fetch events", async () => {
		inMemoryEventsRepository.items.push(
			makeEvent({
				name: "Event 1",
				maxCapacity: 100,
				eventDate: new Date("2025-08-01"),
			}),
			makeEvent({
				name: "Event 2",
				maxCapacity: 100,
				eventDate: new Date("2025-10-01"),
			}),
			makeEvent({
				name: "Chistmas Party",
				maxCapacity: 100,
				eventDate: new Date("2025-12-25"),
			}),
		)

		const result = await sut.execute({
			page: 1,
			query: "Event",
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value?.events).toHaveLength(2)
		expect(result.value?.events).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Event 1",
				}),
				expect.objectContaining({
					name: "Event 2",
				}),
			]),
		)
	})

	it("should be able to fetch events from a specific date", async () => {
		inMemoryEventsRepository.items.push(
			makeEvent({
				name: "Event 1",
				maxCapacity: 100,
				eventDate: new Date("2025-08-01"),
			}),
			makeEvent({
				name: "Event 2",
				maxCapacity: 100,
				eventDate: new Date("2025-10-01"),
			}),
			makeEvent({
				name: "Chistmas Party",
				maxCapacity: 100,
				eventDate: new Date("2025-12-25"),
			}),
		)

		const result = await sut.execute({
			page: 1,
			query: "",
			fromDate: new Date("2025-09-01"),
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value?.events).toHaveLength(2)
		expect(result.value?.events).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Event 2",
				}),
				expect.objectContaining({
					name: "Chistmas Party",
				}),
			]),
		)
	})

	it("should be able to fetch paginated events", async () => {
		for (let i = 1; i <= 23; i++) {
			inMemoryEventsRepository.items.push(
				makeEvent({
					name: `Event ${i}`,
					maxCapacity: 100,
				}),
			)
		}

		const result = await sut.execute({
			page: 2,
			query: "",
		})

		expect(result.isRight()).toBeTruthy()
		expect(result.value?.events).toHaveLength(3)
		expect(result.value?.events).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: "Event 21",
				}),
				expect.objectContaining({
					name: "Event 22",
				}),
				expect.objectContaining({
					name: "Event 23",
				}),
			]),
		)
	})
})
